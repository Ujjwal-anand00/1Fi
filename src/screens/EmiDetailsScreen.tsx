import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ActiveEmiPlan, Installment } from '../types/emi';
import { formatINR } from '../utils/formatters';

type EmiDetailsScreenProps = {
  plan: ActiveEmiPlan;
  onBack: () => void;
  onPayInstallment: (plan: ActiveEmiPlan, installmentNumber: number) => void;
};

export function EmiDetailsScreen({ plan, onBack, onPayInstallment }: EmiDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  const imageSource = plan.productImage.source ?? (plan.productImage.uri ? { uri: plan.productImage.uri } : null);
  const progressRatio = plan.totalInstallments > 0 ? plan.paidInstallments / plan.totalInstallments : 0;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Back to EMI Dues">
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>EMI Plan Details</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* 1. Product Summary Card */}
      <View style={styles.card}>
        <View style={styles.productRow}>
          <View
            style={[
              styles.imageFrame,
              { backgroundColor: plan.productImage.backgroundColor ?? '#F8F8FA' },
            ]}
          >
            {imageSource ? (
              <Image source={imageSource} style={styles.productThumb} resizeMode="contain" />
            ) : (
              <Ionicons name="cube-outline" size={28} color={colors.primary} />
            )}
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {plan.productName}
            </Text>
            <Text style={styles.variantBadge}>{plan.variant}</Text>
            <Text style={styles.orderIdText}>Order Ref: {plan.orderId}</Text>
          </View>
        </View>

        <View style={styles.emiHighlightRow}>
          <View style={styles.emiHighlightLeft}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.emiPlanName}>{plan.totalInstallments} Months Plan</Text>
          </View>
          <Text style={styles.emiMonthlyAmount}>
            {formatINR(plan.monthlyEmi)} <Text style={styles.perMonth}>/ month</Text>
          </Text>
        </View>
      </View>

      {/* 2. Repayment Progress Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="stats-chart-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Repayment Progress</Text>
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {plan.paidInstallments} of {plan.totalInstallments} installments paid
            </Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.progressGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Amount Paid</Text>
            <Text style={styles.gridValueGreen}>{formatINR(plan.amountPaid)}</Text>
          </View>
          <View style={styles.gridDivider} />
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Amount Remaining</Text>
            <Text style={styles.gridValuePrimary}>{formatINR(plan.remainingAmount)}</Text>
          </View>
        </View>
      </View>

      {/* 3. Financial Breakdown Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Financial Breakdown</Text>
        </View>

        <View style={styles.breakdownWrap}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Purchase Price</Text>
            <Text style={styles.breakdownValue}>{formatINR(plan.purchasePrice)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Interest</Text>
            <Text style={[styles.breakdownValue, plan.interestAmount === 0 && styles.noCostGreen]}>
              {plan.interestAmount === 0 ? '₹0 (No-Cost EMI)' : formatINR(plan.interestAmount)}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Processing Fee</Text>
            <Text style={styles.breakdownValue}>
              {plan.processingFee > 0 ? formatINR(plan.processingFee) : 'FREE'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{formatINR(plan.totalPayable)}</Text>
          </View>

          <View style={styles.datesRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateVal}>{plan.startDate}</Text>
            </View>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateVal}>{plan.endDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 4. Complete Installment Schedule */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="list-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Installment Schedule</Text>
        </View>

        <View style={styles.scheduleList}>
          {plan.schedule.map((inst: Installment) => {
            const isPaid = inst.status === 'Paid';
            const isDueSoon = inst.status === 'Due Soon';

            return (
              <View
                key={inst.installmentNumber}
                style={[
                  styles.scheduleItem,
                  isPaid && styles.scheduleItemPaid,
                  isDueSoon && styles.scheduleItemDueSoon,
                ]}
              >
                <View style={styles.instLeft}>
                  <View
                    style={[
                      styles.instCircle,
                      isPaid && styles.circlePaid,
                      isDueSoon && styles.circleDueSoon,
                    ]}
                  >
                    <Ionicons
                      name={isPaid ? 'checkmark' : isDueSoon ? 'alert' : 'time-outline'}
                      size={14}
                      color={isPaid ? colors.white : isDueSoon ? '#B45309' : colors.textTertiary}
                    />
                  </View>

                  <View style={styles.instMeta}>
                    <Text style={[styles.instTitle, isPaid && styles.instTitlePaid]}>
                      Installment {inst.installmentNumber}
                    </Text>
                    <Text style={styles.instDueDate}>
                      {isPaid ? `Paid on ${inst.dueDate}` : `Due: ${inst.dueDate}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.instRight}>
                  <Text style={styles.instAmount}>{formatINR(inst.amount)}</Text>

                  {isPaid ? (
                    <View style={styles.paidTag}>
                      <Text style={styles.paidTagText}>Paid</Text>
                    </View>
                  ) : (
                    <Pressable
                      style={[styles.payInstBtn, isDueSoon && styles.payInstBtnDueSoon]}
                      onPress={() => onPayInstallment(plan, inst.installmentNumber)}
                      accessibilityRole="button"
                      accessibilityLabel={`Pay installment ${inst.installmentNumber}`}
                    >
                      <Text
                        style={[
                          styles.payInstBtnText,
                          isDueSoon && styles.payInstBtnTextDueSoon,
                        ]}
                      >
                        {isDueSoon ? 'Pay Now' : 'Prepay'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Floating navigation clearance */}
      <View style={{ height: bottomClearance }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 50,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
    textAlign: 'center',
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  productRow: {
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
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  variantBadge: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  orderIdText: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
  },
  emiHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  emiHighlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emiPlanName: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  emiMonthlyAmount: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  perMonth: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  progressWrap: {
    gap: spacing.xs,
  },
  progressRow: {
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
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  progressGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginTop: spacing.xs,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  gridLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  gridValueGreen: {
    color: '#059669',
    fontSize: 18,
    fontWeight: '800',
  },
  gridValuePrimary: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '800',
  },
  gridDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderSoft,
  },
  breakdownWrap: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  noCostGreen: {
    color: '#059669',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  totalValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  dateCol: {
    gap: 1,
  },
  dateLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
  },
  dateVal: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  scheduleList: {
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: '#FAFAFC',
  },
  scheduleItemPaid: {
    borderColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
  },
  scheduleItemDueSoon: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  instLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  instCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePaid: {
    backgroundColor: '#10B981',
  },
  circleDueSoon: {
    backgroundColor: '#FDE68A',
  },
  instMeta: {
    gap: 1,
  },
  instTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  instTitlePaid: {
    color: '#065F46',
  },
  instDueDate: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  instRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  instAmount: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  paidTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  paidTagText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
  payInstBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  payInstBtnDueSoon: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  payInstBtnText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  payInstBtnTextDueSoon: {
    color: colors.white,
  },
});
