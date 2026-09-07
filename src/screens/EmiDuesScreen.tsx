import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { RootTabParamList } from '../../App';
import { ActiveEmiCard } from '../components/ActiveEmiCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SectionHeader } from '../components/SectionHeader';
import { UpcomingPaymentCard } from '../components/UpcomingPaymentCard';
import {
  getActiveEmiPlans,
  getEmiOverview,
  getUpcomingPayments,
  subscribeToEmiUpdates,
} from '../services/emiDuesService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ActiveEmiPlan, EmiOverviewSummary, UpcomingPayment } from '../types/emi';
import { formatINR } from '../utils/formatters';
import { EmiDetailsScreen } from './EmiDetailsScreen';
import { EmiPaymentScreen } from './EmiPaymentScreen';

export function EmiDuesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<EmiOverviewSummary | null>(null);
  const [activePlans, setActivePlans] = useState<ActiveEmiPlan[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Navigation state within EMI Dues
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<ActiveEmiPlan | null>(null);

  // Dedicated Payment screen target state
  const [paymentTarget, setPaymentTarget] = useState<{
    plan: ActiveEmiPlan;
    installmentNumber: number;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [overviewData, plansData, paymentsData] = await Promise.all([
        getEmiOverview(),
        getActiveEmiPlans(),
        getUpcomingPayments(),
      ]);
      setOverview(overviewData);
      setActivePlans(plansData);
      setUpcomingPayments(paymentsData);

      // If user is currently viewing details of a plan, keep it synchronized
      if (selectedPlanForDetails) {
        const updated = plansData.find((p) => p.planId === selectedPlanForDetails.planId);
        if (updated) setSelectedPlanForDetails(updated);
      }
    } catch {
      setError('Unable to load EMI dues. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedPlanForDetails]);

  useEffect(() => {
    void loadData();
    const unsubscribe = subscribeToEmiUpdates(() => {
      void loadData();
    });
    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Open payment screen from Active Card (current payable installment)
  const handleOpenPayFromCard = (plan: ActiveEmiPlan) => {
    const nextUnpaid = plan.schedule.find((i) => i.status !== 'Paid');
    if (!nextUnpaid) return;

    setPaymentTarget({
      plan,
      installmentNumber: nextUnpaid.installmentNumber,
    });
  };

  // Open payment screen from Upcoming Payment card (Due Soon or Prepay)
  const handleOpenPayFromUpcoming = (payment: UpcomingPayment) => {
    const plan = activePlans.find((p) => p.planId === payment.planId);
    if (!plan) return;

    setPaymentTarget({
      plan,
      installmentNumber: payment.installmentNumber,
    });
  };

  // Open payment screen from Details Screen schedule (Pay Now or Prepay)
  const handleOpenPayFromDetailsSchedule = (plan: ActiveEmiPlan, installmentNumber: number) => {
    setPaymentTarget({
      plan,
      installmentNumber,
    });
  };

  // Navigate to Marketplace
  const handleExploreMarketplace = () => {
    navigation.navigate('Shop');
  };

  // 1. Dedicated EMI Payment Screen Flow
  if (paymentTarget) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <EmiPaymentScreen
              plan={paymentTarget.plan}
              installmentNumber={paymentTarget.installmentNumber}
              onBack={() => setPaymentTarget(null)}
              onPaymentSuccess={async () => {
                await loadData();
                setPaymentTarget(null);
                setSelectedPlanForDetails(null);
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 2. EMI Plan Details Screen Flow
  if (selectedPlanForDetails) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <EmiDetailsScreen
              plan={selectedPlanForDetails}
              onBack={() => setSelectedPlanForDetails(null)}
              onPayInstallment={handleOpenPayFromDetailsSchedule}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const hasActivePlans = activePlans.length > 0;
  const progressPercent = overview ? Math.round(overview.overallRepaymentProgress * 100) : 0;

  // 3. Main EMI Dues Dashboard
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.screenHeaderRow}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="card-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.screenTitle}>EMI Dues</Text>
              <Text style={styles.screenSubtitle}>Manage your active plans &amp; repayments</Text>
            </View>
          </View>

          {/* Loading State during initial retrieval */}
          {loading ? (
            <LoadingState message="Loading your EMI dues..." />
          ) : error && activePlans.length === 0 ? (
            <ErrorState
              title="Unable to load EMI dues"
              message={error}
              actionLabel="Try again"
              onAction={loadData}
            />
          ) : (
            <>
              {/* 1. EMI Dues Overview Card */}
              {overview && hasActivePlans ? (
                <View style={styles.overviewCard}>
                  <View style={styles.overviewTopRow}>
                    <View style={styles.outstandingWrap}>
                      <Text style={styles.outstandingLabel}>Total Outstanding</Text>
                      <Text style={styles.outstandingValue}>
                        {formatINR(overview.totalOutstanding)}
                      </Text>
                    </View>

                    <View style={styles.plansBadge}>
                      <Ionicons name="layers-outline" size={14} color={colors.primaryDark} />
                      <Text style={styles.plansBadgeText}>
                        {overview.activePlansCount} Active {overview.activePlansCount === 1 ? 'Plan' : 'Plans'}
                      </Text>
                    </View>
                  </View>

                  {/* Next EMI Highlight */}
                  <View style={styles.nextEmiBox}>
                    <View style={styles.nextEmiLeft}>
                      <Text style={styles.nextEmiLabel}>Next EMI Due</Text>
                      <Text style={styles.nextEmiAmount}>{formatINR(overview.nextEmiDueAmount)}</Text>
                    </View>

                    <View style={styles.nextEmiRight}>
                      <Ionicons name="calendar" size={16} color={colors.primary} />
                      <Text style={styles.nextEmiDate}>Due {overview.nextDueDate}</Text>
                    </View>
                  </View>

                  {/* Repayment Progress */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressMeta}>
                      <Text style={styles.progressLabel}>Overall Repayment Progress</Text>
                      <Text style={styles.progressPercent}>{progressPercent}%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>
                  </View>
                </View>
              ) : null}

              {/* 2. Active EMI Plans Section */}
              {hasActivePlans ? (
                <View style={styles.sectionWrap}>
                  <SectionHeader
                    title="Active EMI Plans"
                    badge={activePlans.length}
                  />

                  <View style={styles.plansList}>
                    {activePlans.map((plan) => (
                      <ActiveEmiCard
                        key={plan.planId}
                        plan={plan}
                        onPressPlan={(p) => setSelectedPlanForDetails(p)}
                        onPayEmi={handleOpenPayFromCard}
                      />
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 3. Upcoming Payments Section */}
              {hasActivePlans && upcomingPayments.length > 0 ? (
                <View style={styles.sectionWrap}>
                  <SectionHeader
                    title="Upcoming Payments"
                    subtitle="Chronological schedule"
                  />

                  <View style={styles.upcomingList}>
                    {upcomingPayments.map((payment) => (
                      <UpcomingPaymentCard
                        key={payment.id}
                        payment={payment}
                        onPayNow={handleOpenPayFromUpcoming}
                      />
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 4. Empty State (if no active plans) */}
              {!hasActivePlans ? (
                <EmptyState
                  icon="card-outline"
                  title="No Active EMIs"
                  subtitle="Your active EMI purchases will appear here."
                  actionLabel="Explore Marketplace"
                  onAction={handleExploreMarketplace}
                />
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    // Clearance for floating bottom navigation
    paddingBottom: 160,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  screenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    gap: 2,
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: typography.screenTitle,
    fontWeight: '800',
    lineHeight: 30,
  },
  screenSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  overviewCard: {
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  outstandingWrap: {
    gap: 2,
  },
  outstandingLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  outstandingValue: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  plansBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  plansBadgeText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  nextEmiBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  nextEmiLeft: {
    gap: 2,
  },
  nextEmiLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '700',
  },
  nextEmiAmount: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '800',
  },
  nextEmiRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  nextEmiDate: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: '800',
  },
  progressSection: {
    gap: spacing.xs,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  progressPercent: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  sectionWrap: {
    gap: spacing.sm + 2,
  },
  plansList: {
    gap: spacing.sm + 2,
  },
  upcomingList: {
    gap: spacing.xs + 2,
  },
});
