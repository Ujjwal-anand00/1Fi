import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { InstallmentStatus, UpcomingPayment } from '../types/emi';
import { formatINR } from '../utils/formatters';

type UpcomingPaymentCardProps = {
  payment: UpcomingPayment;
  onPayNow: (payment: UpcomingPayment) => void;
};

export function UpcomingPaymentCard({ payment, onPayNow }: UpcomingPaymentCardProps) {
  const imageSource =
    payment.productImage.source ?? (payment.productImage.uri ? { uri: payment.productImage.uri } : null);

  const getStatusConfig = (status: InstallmentStatus) => {
    switch (status) {
      case 'Due Soon':
        return {
          bg: '#FEF3C7',
          border: '#FCD34D',
          text: '#B45309',
          icon: 'alert-circle-outline' as const,
        };
      case 'Upcoming':
        return {
          bg: '#F3E8FF',
          border: '#E9D5FF',
          text: '#7E22CE',
          icon: 'calendar-outline' as const,
        };
      case 'Paid':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#047857',
          icon: 'checkmark-circle-outline' as const,
        };
      case 'Overdue':
        return {
          bg: '#FEE2E2',
          border: '#FCA5A5',
          text: '#B91C1C',
          icon: 'warning-outline' as const,
        };
      default:
        return {
          bg: colors.surfaceSoft,
          border: colors.borderSoft,
          text: colors.textSecondary,
          icon: 'time-outline' as const,
        };
    }
  };

  const statusConfig = getStatusConfig(payment.status);

  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        <View style={[styles.imageFrame, { backgroundColor: payment.productImage.backgroundColor ?? '#F8F8FA' }]}>
          {imageSource ? (
            <Image source={imageSource} style={styles.productThumb} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
          )}
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.productName} numberOfLines={1}>
            {payment.productName}
          </Text>
          <Text style={styles.installmentMeta}>
            Installment {payment.installmentNumber} of {payment.totalInstallments}
          </Text>
          <View style={styles.dueDateRow}>
            <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.dueDateText}>Due: {payment.dueDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.amountText}>{formatINR(payment.amount)}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.bg, borderColor: statusConfig.border },
          ]}
        >
          <Ionicons name={statusConfig.icon} size={11} color={statusConfig.text} />
          <Text style={[styles.statusText, { color: statusConfig.text }]}>{payment.status}</Text>
        </View>

        {payment.status !== 'Paid' ? (
          <Pressable
            style={[styles.payNowBtn, payment.status === 'Due Soon' && styles.payNowBtnDueSoon]}
            onPress={() => onPayNow(payment)}
            accessibilityRole="button"
            accessibilityLabel={`${payment.status === 'Due Soon' ? 'Pay EMI' : 'Prepay'} ${formatINR(payment.amount)} for ${payment.productName}`}
          >
            <Text
              style={[
                styles.payNowText,
                payment.status === 'Due Soon' && styles.payNowTextDueSoon,
              ]}
            >
              {payment.status === 'Due Soon' ? 'Pay EMI' : 'Prepay'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    flex: 1,
  },
  imageFrame: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  productThumb: {
    width: '90%',
    height: '90%',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  installmentMeta: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  dueDateText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amountText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  payNowBtn: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  payNowBtnDueSoon: {
    backgroundColor: colors.primary,
  },
  payNowText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  payNowTextDueSoon: {
    color: colors.white,
  },
});
