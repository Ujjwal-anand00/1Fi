import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { PaymentMethod } from '../types/order';
import { formatINR } from '../utils/formatters';

type EmiRepaymentModalProps = {
  visible: boolean;
  productName: string;
  installmentNumber: number;
  totalInstallments: number;
  amountDue: number;
  onClose: () => void;
  onConfirmPayment: (paymentMethod: PaymentMethod) => Promise<void>;
};

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'upi',
    title: 'UPI (Instant)',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: 'flash-outline',
  },
  {
    id: 'card',
    title: 'Debit / Credit Card',
    subtitle: 'Visa, MasterCard, RuPay',
    icon: 'card-outline',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: 'HDFC, ICICI, SBI, Axis & all major banks',
    icon: 'business-outline',
  },
];

export function EmiRepaymentModal({
  visible,
  productName,
  installmentNumber,
  totalInstallments,
  amountDue,
  onClose,
  onConfirmPayment,
}: EmiRepaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Simulate realistic payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 800));
      await onConfirmPayment(selectedMethod);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsProcessing(false);
        onClose();
      }, 1100);
    } catch {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleModalClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Ionicons name="card-outline" size={22} color={colors.primary} />
              <Text style={styles.headerTitle}>Pay EMI Installment</Text>
            </View>
            <Pressable onPress={handleModalClose} disabled={isProcessing} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          {isSuccess ? (
            <View style={styles.successState}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={36} color={colors.white} />
              </View>
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successSubtext}>
                Installment {installmentNumber} of {totalInstallments} marked as paid.
              </Text>
            </View>
          ) : (
            <>
              {/* Product & Installment Info */}
              <View style={styles.productBanner}>
                <Text style={styles.productName} numberOfLines={1}>
                  {productName}
                </Text>
                <Text style={styles.installmentBadge}>
                  Installment {installmentNumber} of {totalInstallments}
                </Text>
              </View>

              {/* Amount Due Card */}
              <View style={styles.amountCard}>
                <Text style={styles.amountLabel}>EMI Due</Text>
                <Text style={styles.amountValue}>{formatINR(amountDue)}</Text>
                <Text style={styles.secureText}>
                  <Ionicons name="shield-checkmark" size={13} color="#059669" /> 100% Secure 1Fi Payment
                </Text>
              </View>

              {/* Payment Method Selector */}
              <View style={styles.methodsWrap}>
                <Text style={styles.sectionTitle}>Select Payment Method</Text>

                <View style={styles.methodList}>
                  {PAYMENT_OPTIONS.map((opt) => {
                    const isSelected = selectedMethod === opt.id;
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => setSelectedMethod(opt.id)}
                        style={[styles.methodItem, isSelected && styles.methodItemSelected]}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <View style={styles.radio}>
                          {isSelected ? (
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                          ) : (
                            <View style={styles.radioUnselected} />
                          )}
                        </View>

                        <View style={styles.methodInfo}>
                          <Text style={[styles.methodTitle, isSelected && styles.methodTitleSelected]}>
                            {opt.title}
                          </Text>
                          <Text style={styles.methodSubtitle}>{opt.subtitle}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Pay Button */}
              <Pressable
                style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                onPress={handlePay}
                disabled={isProcessing}
                accessibilityRole="button"
                accessibilityLabel={`Pay ${formatINR(amountDue)}`}
              >
                {isProcessing ? (
                  <View style={styles.btnContent}>
                    <ActivityIndicator size="small" color={colors.white} />
                    <Text style={styles.payButtonText}>Processing repayment...</Text>
                  </View>
                ) : (
                  <Text style={styles.payButtonText}>Pay {formatINR(amountDue)}</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
    maxHeight: '90%',
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  productBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  productName: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
    flex: 1,
  },
  installmentBadge: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  amountCard: {
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 3,
  },
  amountLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  secureText: {
    color: '#059669',
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: 2,
  },
  methodsWrap: {
    gap: spacing.xs + 2,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  methodList: {
    gap: spacing.xs,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  methodItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
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
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  methodTitleSelected: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  methodSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  payButton: {
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  payButtonDisabled: {
    opacity: 0.8,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  payButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: '#10B981',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  successTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  successSubtext: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
  },
});
