import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { EmiPaymentSuccessCard } from '../components/EmiPaymentSuccessCard';
import { EmiPaymentSummary } from '../components/EmiPaymentSummary';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { payEmiInstallment } from '../services/emiDuesService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ActiveEmiPlan, EmiPaymentReceipt, Installment } from '../types/emi';
import type { PaymentMethod } from '../types/order';
import { formatINR } from '../utils/formatters';

type EmiPaymentScreenProps = {
  plan: ActiveEmiPlan;
  installmentNumber: number;
  onBack: () => void;
  onPaymentSuccess: (receipt: EmiPaymentReceipt) => void;
};

export function EmiPaymentScreen({
  plan,
  installmentNumber,
  onBack,
  onPaymentSuccess,
}: EmiPaymentScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [authorized, setAuthorized] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<EmiPaymentReceipt | null>(null);

  const targetInstallment: Installment | undefined = plan.schedule.find(
    (i) => i.installmentNumber === installmentNumber
  );

  const isAlreadyPaid = targetInstallment?.status === 'Paid';
  const isAdvancePrepay = targetInstallment ? targetInstallment.status === 'Upcoming' : false;

  const handleProcessPayment = async (simulateFailure = false) => {
    if (!targetInstallment || isAlreadyPaid || !authorized || isProcessing) return;

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 850));

      const result = await payEmiInstallment(plan.planId, installmentNumber, selectedMethod, {
        shouldFail: simulateFailure,
      });

      setPaymentReceipt(result.receipt);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment could not be completed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If payment succeeded, show the complete success receipt
  if (paymentReceipt) {
    return (
      <View style={styles.wrapper}>
        <EmiPaymentSuccessCard
          receipt={paymentReceipt}
          onReturnToDues={() => onPaymentSuccess(paymentReceipt)}
        />
        <View style={{ height: bottomClearance }} />
      </View>
    );
  }

  if (!targetInstallment) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Pay EMI</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={36} color={colors.danger} />
          <Text style={styles.errorTitle}>Installment Not Found</Text>
          <Text style={styles.errorText}>
            Installment #{installmentNumber} could not be located on this plan.
          </Text>
          <Pressable style={styles.retryBtn} onPress={onBack}>
            <Text style={styles.retryBtnText}>Back to EMI Dues</Text>
          </Pressable>
        </View>
        <View style={{ height: bottomClearance }} />
      </View>
    );
  }

  const canPay = Boolean(authorized && !isAlreadyPaid && !isProcessing);

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Back to EMI Dues">
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pay EMI</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* 1. Product & Installment Summary */}
      <EmiPaymentSummary
        plan={plan}
        installment={targetInstallment}
        isAdvancePrepay={isAdvancePrepay}
      />

      {/* 2. Payment Method Selector */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onSelectMethod={(method) => {
          setSelectedMethod(method);
          setErrorMessage(null);
        }}
      />

      {/* 3. Consent / Authorization Section */}
      <View style={styles.consentCard}>
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAuthorized((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: authorized }}
        >
          <View style={[styles.checkbox, authorized && styles.checkboxChecked]}>
            {authorized ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
          </View>
          <Text style={styles.checkboxLabel}>
            I authorize 1Fi to process this payment of{' '}
            <Text style={styles.boldText}>{formatINR(targetInstallment.amount)}</Text> for Installment #
            {installmentNumber}.
          </Text>
        </Pressable>
      </View>

      {/* 4. Error / Failure Banner with Retry */}
      {errorMessage ? (
        <View style={styles.failureBanner}>
          <View style={styles.failureHeader}>
            <Ionicons name="close-circle" size={20} color={colors.danger} />
            <Text style={styles.failureTitle}>Payment Failed</Text>
          </View>
          <Text style={styles.failureText}>{errorMessage}</Text>
          <Pressable style={styles.tryAgainBtn} onPress={() => handleProcessPayment(false)}>
            <Ionicons name="refresh" size={15} color={colors.white} />
            <Text style={styles.tryAgainBtnText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}

      {/* 5. Already Paid Warning Banner */}
      {isAlreadyPaid ? (
        <View style={styles.alreadyPaidBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
          <Text style={styles.alreadyPaidText}>
            This installment has already been paid and verified.
          </Text>
        </View>
      ) : null}

      {/* 6. Primary Payment CTA Card */}
      <View style={styles.ctaCard}>
        <View style={styles.ctaInfoRow}>
          <Text style={styles.ctaAmountLabel}>Total Payable</Text>
          <Text style={styles.ctaAmountValue}>{formatINR(targetInstallment.amount)}</Text>
        </View>

        <Pressable
          style={[styles.primaryPayBtn, (!canPay || isProcessing) && styles.primaryPayBtnDisabled]}
          onPress={() => handleProcessPayment(false)}
          disabled={!canPay || isProcessing}
          accessibilityRole="button"
          accessibilityLabel={`Pay ${formatINR(targetInstallment.amount)}`}
        >
          {isProcessing ? (
            <View style={styles.btnLoadingRow}>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.primaryPayBtnText}>Processing payment securely...</Text>
            </View>
          ) : (
            <Text style={styles.primaryPayBtnText}>
              Pay {formatINR(targetInstallment.amount)} →
            </Text>
          )}
        </Pressable>
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
  consentCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md + 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.inactive,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.secondary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  failureBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  failureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  failureTitle: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '800',
  },
  failureText: {
    color: colors.danger,
    fontSize: typography.small,
    lineHeight: 18,
  },
  tryAgainBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  tryAgainBtnText: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: '800',
  },
  alreadyPaidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radius.card,
    padding: spacing.md,
  },
  alreadyPaidText: {
    color: '#047857',
    fontSize: typography.body,
    fontWeight: '700',
    flex: 1,
  },
  ctaCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ctaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaAmountLabel: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  ctaAmountValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  primaryPayBtn: {
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryPayBtnDisabled: {
    backgroundColor: colors.inactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryPayBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  errorCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderRadius: radius.button,
  },
  retryBtnText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
