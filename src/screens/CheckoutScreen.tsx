import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DeliveryAddressCard } from '../components/DeliveryAddressCard';
import { EmiTermsSection } from '../components/EmiTermsSection';
import { OrderSummaryCard } from '../components/OrderSummaryCard';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { PriceSummary } from '../components/PriceSummary';
import { createOrder, defaultDeliveryAddress } from '../services/orderService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPlan, Product, ProductVariant } from '../types/marketplace';
import type { DeliveryAddress, Order, PaymentMethod } from '../types/order';
import { calculateEmiDetails } from '../utils/emiCalculator';
import { formatINR } from '../utils/formatters';

type CheckoutScreenProps = {
  product: Product;
  selectedVariant: ProductVariant;
  selectedEmiPlan: EmiPlan;
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
};

export function CheckoutScreen({
  product,
  selectedVariant,
  selectedEmiPlan,
  onBack,
  onOrderPlaced,
}: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(defaultDeliveryAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clearance for floating bottom navigation
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  // Single Source of Truth EMI calculation (same formula used in Product Details)
  const emiCalc = calculateEmiDetails(selectedVariant.price, selectedEmiPlan);

  const canPlaceOrder = Boolean(deliveryAddress && paymentMethod && termsAgreed && !isProcessing);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      setValidationError('Please provide a valid delivery address');
      return;
    }
    if (!paymentMethod) {
      setValidationError('Please select a payment method');
      return;
    }
    if (!termsAgreed) {
      setValidationError('Please accept the EMI terms and conditions');
      return;
    }

    setValidationError(null);
    setIsProcessing(true);

    try {
      // Simulate real gateway processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const order = await createOrder({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        variant: `${selectedVariant.label}${selectedVariant.value ? ` • ${selectedVariant.value}` : ''}`,
        color: selectedVariant.type.toLowerCase().includes('color') ? selectedVariant.label : undefined,
        storage: selectedVariant.type.toLowerCase().includes('storage') ? selectedVariant.label : undefined,
        quantity: 1,
        productPrice: emiCalc.principal,
        productAmount: emiCalc.principal,
        emiPlan: `${emiCalc.months} Months ${emiCalc.isNoCost ? 'No Cost ' : ''}EMI`,
        emiMonths: emiCalc.months,
        monthlyEmi: emiCalc.monthlyEmi,
        interestAmount: emiCalc.interestAmount,
        processingFee: emiCalc.processingFee,
        totalPayable: emiCalc.totalPayable,
        deliveryAddress,
        paymentMethod,
      });

      onOrderPlaced(order);
    } catch {
      setValidationError('Unable to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const imageSource = product.image.source ?? (product.image.uri ? { uri: product.image.uri } : null);

  return (
    <View style={styles.wrapper}>
      {/* Checkout Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Go back to Product Details">
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 50 }} />
      </View>
      {/* 1. Order Summary Card */}
      <OrderSummaryCard
        productName={product.name}
        productImage={product.image}
        variantLabel={`${selectedVariant.label}${selectedVariant.value ? ` • ${selectedVariant.value}` : ''}`}
        price={selectedVariant.price}
        quantity={1}
        emiPlanTitle={`${emiCalc.months} Months ${emiCalc.isNoCost ? 'No Cost ' : ''}EMI`}
        monthlyEmi={emiCalc.monthlyEmi}
      />

      {/* 2. Price Summary Card */}
      <PriceSummary
        productPrice={emiCalc.principal}
        interestAmount={emiCalc.interestAmount}
        processingFee={emiCalc.processingFee}
        totalPayable={emiCalc.totalPayable}
        isNoCost={emiCalc.isNoCost}
        monthlyEmi={emiCalc.monthlyEmi}
        months={emiCalc.months}
      />

      {/* 3. Delivery Address Section */}
      <DeliveryAddressCard
        address={deliveryAddress}
        onUpdateAddress={(newAddr) => {
          setDeliveryAddress(newAddr);
          setValidationError(null);
        }}
      />

      {/* 4. Payment Method Section */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onSelectMethod={(method) => {
          setPaymentMethod(method);
          setValidationError(null);
        }}
      />

      {/* 5. EMI Terms & Conditions */}
      <EmiTermsSection
        agreed={termsAgreed}
        onToggleAgreement={() => {
          setTermsAgreed((prev) => !prev);
          setValidationError(null);
        }}
      />

      {/* Validation Error Message */}
      {validationError ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={colors.danger} />
          <Text style={styles.errorBannerText}>{validationError}</Text>
        </View>
      ) : null}

      {/* 6. Bottom Order Summary & CTA */}
      <View style={styles.ctaCard}>
        <View style={styles.bottomSummaryRow}>
          <View style={styles.bottomSummaryLeft}>
            <Text style={styles.bottomTotalLabel}>Total Payable</Text>
            <Text style={styles.bottomTotalValue}>{formatINR(emiCalc.totalPayable)}</Text>
          </View>
          <View style={styles.bottomSummaryRight}>
            <Text style={styles.bottomEmiText}>
              EMI: <Text style={styles.bottomEmiBold}>{formatINR(emiCalc.monthlyEmi)}</Text> × {emiCalc.months} months
            </Text>
            <Text style={styles.bottomFeeText}>
              Processing Fee: {emiCalc.processingFee > 0 ? formatINR(emiCalc.processingFee) : '₹0 (FREE)'}
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.placeOrderBtn, (!canPlaceOrder || isProcessing) && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={!canPlaceOrder || isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Place Order"
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.placeOrderBtnText}>Processing your order...</Text>
            </>
          ) : (
            <Text style={styles.placeOrderBtnText}>Place Order →</Text>
          )}
        </Pressable>
      </View>

      {/* Clearance above floating bottom nav */}
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
  productRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  imageFrame: {
    width: 68,
    height: 68,
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
    lineHeight: 20,
  },
  variantBadge: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  quantityLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  productPrice: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
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
  emiPerMonth: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '600',
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '600',
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
  bottomSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  bottomSummaryLeft: {
    gap: 2,
  },
  bottomTotalLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  bottomTotalValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  bottomSummaryRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  bottomEmiText: {
    color: colors.textPrimary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  bottomEmiBold: {
    color: colors.primary,
    fontWeight: '800',
  },
  bottomFeeText: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  placeOrderBtn: {
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: colors.inactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  placeOrderBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
