import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatINR } from '../utils/formatters';

type PriceSummaryProps = {
  productPrice: number;
  interestAmount: number;
  processingFee: number;
  totalPayable: number;
  isNoCost?: boolean;
  monthlyEmi?: number;
  months?: number;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function PriceSummary({
  productPrice,
  interestAmount,
  processingFee,
  totalPayable,
  isNoCost = false,
  monthlyEmi,
  months,
  title = 'Price Summary',
  icon = 'receipt-outline',
}: PriceSummaryProps) {
  const noCost = isNoCost || interestAmount === 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <View style={styles.breakdownWrap}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Product Price</Text>
          <Text style={styles.breakdownValue}>{formatINR(productPrice)}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Interest</Text>
          <Text style={[styles.breakdownValue, noCost && styles.noCostGreen]}>
            {noCost ? '₹0 (No-Cost EMI)' : formatINR(interestAmount)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Processing Fee</Text>
          <Text style={styles.breakdownValue}>
            {processingFee > 0 ? formatINR(processingFee) : 'FREE'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>{formatINR(totalPayable)}</Text>
        </View>

        {monthlyEmi && months ? (
          <View style={styles.emiScheduleBox}>
            <Ionicons name="flash" size={14} color={colors.primary} />
            <Text style={styles.emiScheduleText}>
              EMI: <Text style={styles.emiScheduleBold}>{formatINR(monthlyEmi)}</Text> × {months} months
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  emiScheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F6FF',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  emiScheduleText: {
    color: colors.primary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  emiScheduleBold: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
});
