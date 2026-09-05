import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ActiveEmiPlan, Installment } from '../types/emi';
import { formatINR } from '../utils/formatters';

type EmiPaymentSummaryProps = {
  plan: ActiveEmiPlan;
  installment: Installment;
  isAdvancePrepay: boolean;
};

export function EmiPaymentSummary({
  plan,
  installment,
  isAdvancePrepay,
}: EmiPaymentSummaryProps) {
  const imageSource =
    plan.productImage.source ?? (plan.productImage.uri ? { uri: plan.productImage.uri } : null);

  return (
    <View style={styles.container}>
      {/* Product Summary Card */}
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
              <Ionicons name="cube-outline" size={26} color={colors.primary} />
            )}
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {plan.productName}
            </Text>
            <Text style={styles.variantBadge}>{plan.variant}</Text>
            <View style={styles.installmentBadgeRow}>
              <View style={styles.installmentBadge}>
                <Text style={styles.installmentBadgeText}>
                  Installment {installment.installmentNumber} of {plan.totalInstallments}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Advance Prepay Advisory Banner */}
        {isAdvancePrepay ? (
          <View style={styles.advanceBanner}>
            <Ionicons name="information-circle" size={18} color="#0284C7" />
            <View style={styles.advanceBannerContent}>
              <Text style={styles.advanceBannerTitle}>Advance Installment Payment</Text>
              <Text style={styles.advanceBannerText}>
                This installment is scheduled for {installment.dueDate}. Prepaying now will immediately
                reduce your total outstanding balance.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.dueSoonBanner}>
            <Ionicons name="alert-circle" size={18} color="#D97706" />
            <View style={styles.dueSoonContent}>
              <Text style={styles.dueSoonTitle}>Current Due Installment</Text>
              <Text style={styles.dueSoonText}>
                Scheduled for payment on {installment.dueDate}.
              </Text>
            </View>
          </View>
        )}

        {/* Financial Details Box */}
        <View style={styles.detailsGrid}>
          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>EMI Payable Amount</Text>
            <Text style={styles.gridAmountValue}>{formatINR(installment.amount)}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>Due Date</Text>
            <Text style={styles.gridValueBold}>{installment.dueDate}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>Payment Processing Fee</Text>
            <Text style={styles.freeBadge}>FREE (₹0)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>Current Outstanding</Text>
            <Text style={styles.gridValue}>{formatINR(plan.remainingAmount)}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.gridLabel}>Balance After Payment</Text>
            <Text style={styles.remainingAfterValue}>
              {formatINR(Math.max(0, Math.round((plan.remainingAmount - installment.amount) * 100) / 100))}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
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
  installmentBadgeRow: {
    marginTop: 2,
  },
  installmentBadge: {
    backgroundColor: colors.primarySoft,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  installmentBadgeText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  advanceBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  advanceBannerContent: {
    flex: 1,
    gap: 2,
  },
  advanceBannerTitle: {
    color: '#0369A1',
    fontSize: typography.small,
    fontWeight: '800',
  },
  advanceBannerText: {
    color: '#0284C7',
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: '600',
  },
  dueSoonBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  dueSoonContent: {
    flex: 1,
    gap: 2,
  },
  dueSoonTitle: {
    color: '#92400E',
    fontSize: typography.small,
    fontWeight: '800',
  },
  dueSoonText: {
    color: '#B45309',
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: '600',
  },
  detailsGrid: {
    gap: spacing.sm,
    backgroundColor: '#FAFAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridLabel: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  gridAmountValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  gridValueBold: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  freeBadge: {
    color: '#059669',
    fontSize: typography.body,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 2,
  },
  gridValue: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  remainingAfterValue: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
