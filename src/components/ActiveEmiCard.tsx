import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ActiveEmiPlan } from '../types/emi';
import { formatINR } from '../utils/formatters';

type ActiveEmiCardProps = {
  plan: ActiveEmiPlan;
  onPressPlan: (plan: ActiveEmiPlan) => void;
  onPayEmi: (plan: ActiveEmiPlan) => void;
};

export function ActiveEmiCard({ plan, onPressPlan, onPayEmi }: ActiveEmiCardProps) {
  const imageSource = plan.productImage.source ?? (plan.productImage.uri ? { uri: plan.productImage.uri } : null);
  const progressRatio = plan.totalInstallments > 0 ? plan.paidInstallments / plan.totalInstallments : 0;
  const progressPercent = Math.round(progressRatio * 100);
  const isFullyPaid = plan.remainingAmount <= 0 || plan.paidInstallments >= plan.totalInstallments;

  return (
    <Pressable
      onPress={() => onPressPlan(plan)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${plan.productName}, ${formatINR(plan.monthlyEmi)} per month, ${plan.paidInstallments} of ${plan.totalInstallments} paid`}
    >
      {/* Top Product & Variant Row */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.imageFrame,
            { backgroundColor: plan.productImage.backgroundColor ?? '#F8F8FA' },
          ]}
        >
          {imageSource ? (
            <Image source={imageSource} style={styles.productThumb} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={26} color={colors.primary} />
          )}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {plan.productName}
          </Text>
          <Text style={styles.variantBadge}>{plan.variant}</Text>

          <View style={styles.rateRow}>
            <Text style={styles.monthlyText}>
              {formatINR(plan.monthlyEmi)} <Text style={styles.perMonthLabel}>/ month</Text>
            </Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{plan.totalInstallments}-month EMI</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Repayment Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>
            {plan.paidInstallments} of {plan.totalInstallments} installments paid
          </Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, progressPercent))}%` }]} />
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.remainingText}>
            Remaining: <Text style={styles.remainingBold}>{formatINR(plan.remainingAmount)}</Text>
          </Text>
          <Text style={styles.originalPriceText}>
            Total: {formatINR(plan.totalPayable)}
          </Text>
        </View>
      </View>

      {/* Due Date & Pay Action Footer */}
      <View style={styles.footerRow}>
        <View style={styles.dueWrap}>
          <Ionicons
            name={isFullyPaid ? 'checkmark-circle' : 'calendar-outline'}
            size={16}
            color={isFullyPaid ? '#059669' : colors.primary}
          />
          <Text style={styles.dueLabel}>
            {isFullyPaid ? (
              <Text style={styles.completedText}>All Installments Paid</Text>
            ) : (
              <>
                Next payment: <Text style={styles.dueBold}>{plan.nextDueDate}</Text>
              </>
            )}
          </Text>
        </View>

        {!isFullyPaid ? (
          <Pressable
            style={styles.payBtn}
            onPress={(e) => {
              e.stopPropagation();
              onPayEmi(plan);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Pay EMI for ${plan.productName}`}
          >
            <Text style={styles.payBtnText}>Pay EMI</Text>
          </Pressable>
        ) : (
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>Completed</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md + 2,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  imageFrame: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  productThumb: {
    width: '90%',
    height: '90%',
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 20,
  },
  variantBadge: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  monthlyText: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  perMonthLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  durationBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  durationText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  progressSection: {
    gap: spacing.xs,
    backgroundColor: '#FAFAFC',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
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
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  remainingText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  remainingBold: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  originalPriceText: {
    color: colors.textTertiary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  dueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dueLabel: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  dueBold: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  completedText: {
    color: '#059669',
    fontWeight: '800',
  },
  payBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 7,
    borderRadius: radius.button,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  payBtnText: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  paidBadgeText: {
    color: '#059669',
    fontSize: typography.small,
    fontWeight: '800',
  },
});
