import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPlan } from '../types/marketplace';
import { formatINR } from '../utils/formatters';

type EmiPlanCardProps = {
  plan: EmiPlan;
  isSelected?: boolean;
  onSelect?: (plan: EmiPlan) => void;
};

export function EmiPlanCard({ plan, isSelected = false, onSelect }: EmiPlanCardProps) {
  const isNoCost = plan.interestRate === 0;
  const isAvailable = plan.available;

  return (
    <Pressable
      onPress={() => isAvailable && onSelect?.(plan)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        !isAvailable && styles.cardDisabled,
        pressed && isAvailable && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
      accessibilityLabel={`${plan.durationMonths} months EMI, ${formatINR(plan.monthlyAmount)} per month, total ${formatINR(plan.totalAmount)}`}
    >
      <View style={styles.topRow}>
        <View style={styles.leftHeader}>
          <View style={styles.radio}>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            ) : (
              <View style={styles.radioUnselected} />
            )}
          </View>
          <Text style={[styles.duration, isSelected && styles.durationSelected]}>
            {plan.durationMonths} Months Plan
          </Text>
        </View>

        {isNoCost ? (
          <View style={styles.noCostBadge}>
            <Ionicons name="flash" size={11} color={colors.primary} />
            <Text style={styles.noCostText}>No Cost EMI</Text>
          </View>
        ) : (
          <Text style={styles.interestRateText}>{plan.interestRate}% interest p.a.</Text>
        )}
      </View>

      <View style={styles.amountRow}>
        <View style={styles.monthlyWrap}>
          <Text style={[styles.monthlyAmount, isSelected && styles.monthlyAmountSelected]}>
            {formatINR(plan.monthlyAmount)}
          </Text>
          <Text style={styles.perMonthLabel}>/ month</Text>
        </View>

        <Text style={styles.totalAmount}>Total: {formatINR(plan.totalAmount)}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.feeText}>
          {plan.processingFee > 0
            ? `Processing fee: ${formatINR(plan.processingFee)}`
            : 'Zero processing fee'}
        </Text>

        {!isAvailable ? (
          <Text style={styles.unavailableText}>Currently unavailable</Text>
        ) : isSelected ? (
          <Text style={styles.selectedPlanTag}>Selected Plan</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  cardDisabled: {
    opacity: 0.55,
    backgroundColor: '#F7F7F9',
  },
  cardPressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioUnselected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.inactive,
  },
  duration: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  durationSelected: {
    color: colors.primaryDark,
  },
  noCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EADFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  noCostText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  interestRateText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  monthlyWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  monthlyAmount: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  monthlyAmountSelected: {
    color: colors.primaryDark,
  },
  perMonthLabel: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  totalAmount: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  feeText: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  unavailableText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
  },
  selectedPlanTag: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '800',
  },
});
