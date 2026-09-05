import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPaymentReceipt } from '../types/emi';
import { formatINR } from '../utils/formatters';

type EmiPaymentSuccessCardProps = {
  receipt: EmiPaymentReceipt;
  onReturnToDues: () => void;
};

export function EmiPaymentSuccessCard({ receipt, onReturnToDues }: EmiPaymentSuccessCardProps) {
  const formattedDate = new Date(receipt.paymentDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'upi':
        return 'UPI Autopay (Instant)';
      case 'card':
        return 'Debit / Credit Card';
      case 'netbanking':
        return 'Net Banking Mandate';
      default:
        return 'Online Payment';
    }
  };

  return (
    <View style={styles.container}>
      {/* Success Hero Header */}
      <View style={styles.heroCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={44} color={colors.white} />
        </View>
        <Text style={styles.heading}>EMI Payment Successful</Text>
        <Text style={styles.amountText}>{formatINR(receipt.amountPaid)}</Text>
        <View style={styles.txnBadge}>
          <Text style={styles.txnText}>Txn ID: {receipt.transactionId}</Text>
        </View>
      </View>

      {/* Receipt Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Payment Receipt</Text>
        </View>

        <View style={styles.receiptGrid}>
          <View style={styles.receiptRow}>
            <Text style={styles.rowLabel}>Product</Text>
            <Text style={styles.rowValueBold} numberOfLines={1}>
              {receipt.productName}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.rowLabel}>Configuration</Text>
            <Text style={styles.rowValue}>{receipt.variant}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.rowLabel}>Installment Paid</Text>
            <View style={styles.installmentPill}>
              <Text style={styles.installmentPillText}>
                Installment {receipt.installmentNumber} of {receipt.totalInstallments}
              </Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.rowLabel}>Payment Date &amp; Time</Text>
            <Text style={styles.rowValue}>{formattedDate}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.rowLabel}>Payment Method</Text>
            <Text style={styles.rowValue}>{getPaymentMethodLabel(receipt.paymentMethod)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.rowLabel}>Previous Outstanding</Text>
            <Text style={styles.rowValueMuted}>{formatINR(receipt.previousOutstanding)}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.outstandingLabel}>Updated Outstanding</Text>
            <Text style={styles.outstandingValue}>{formatINR(receipt.updatedOutstanding)}</Text>
          </View>

          {receipt.updatedOutstanding > 0 ? (
            <View style={styles.nextDueBox}>
              <Ionicons name="calendar-outline" size={15} color={colors.primaryDark} />
              <Text style={styles.nextDueText}>
                Next EMI due on <Text style={styles.nextDueBold}>{receipt.nextDueDate}</Text> ({formatINR(receipt.nextDueAmount)})
              </Text>
            </View>
          ) : (
            <View style={styles.completedBox}>
              <Ionicons name="shield-checkmark" size={16} color="#059669" />
              <Text style={styles.completedBoxText}>All installments for this plan are fully paid!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Return to EMI Dues CTA */}
      <View style={styles.ctaWrap}>
        <Pressable
          style={styles.returnBtn}
          onPress={onReturnToDues}
          accessibilityRole="button"
          accessibilityLabel="Return to EMI Dues"
        >
          <Text style={styles.returnBtnText}>Return to EMI Dues →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  heroCard: {
    borderRadius: radius.card,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: '#10B981',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  amountText: {
    color: '#065F46',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  txnBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: spacing.xs,
  },
  txnText: {
    color: '#047857',
    fontSize: typography.small,
    fontWeight: '700',
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
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
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  receiptGrid: {
    gap: spacing.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  rowValue: {
    color: colors.textPrimary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  rowValueBold: {
    color: colors.textPrimary,
    fontSize: typography.secondary,
    fontWeight: '800',
    maxWidth: '65%',
  },
  rowValueMuted: {
    color: colors.textTertiary,
    fontSize: typography.secondary,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  installmentPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  installmentPillText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: spacing.xs,
  },
  outstandingLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  outstandingValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
  },
  nextDueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  nextDueText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '600',
  },
  nextDueBold: {
    fontWeight: '800',
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#ECFDF5',
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  completedBoxText: {
    color: '#059669',
    fontSize: typography.small,
    fontWeight: '800',
  },
  ctaWrap: {
    marginTop: spacing.xs,
  },
  returnBtn: {
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  returnBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
