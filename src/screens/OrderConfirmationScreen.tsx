import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { Order } from '../types/order';
import { formatINR } from '../utils/formatters';

type OrderConfirmationScreenProps = {
  order: Order;
  onContinueShopping: () => void;
  onViewOrderDetails?: (order: Order) => void;
};

export function OrderConfirmationScreen({
  order,
  onContinueShopping,
  onViewOrderDetails,
}: OrderConfirmationScreenProps) {
  const insets = useSafeAreaInsets();
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Clearance for floating bottom navigation
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  const imageSource = order.productImage.source ?? (order.productImage.uri ? { uri: order.productImage.uri } : null);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'upi':
        return 'UPI Autopay';
      case 'card':
        return 'Debit / Credit Card';
      case 'netbanking':
        return 'Net Banking e-Mandate';
      default:
        return 'Online Mandate';
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Success Hero Badge */}
      <View style={styles.heroCard}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={36} color={colors.white} />
        </View>
        <Text style={styles.successHeading}>Order Placed Successfully!</Text>
        <Text style={styles.orderIdBadge}>Order ID: {order.orderId}</Text>
        <Text style={styles.deliveryEstimate}>
          Expected Delivery: <Text style={styles.deliveryBold}>{order.expectedDelivery}</Text>
        </Text>
      </View>

      {/* Item Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bag-check-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Item Details</Text>
        </View>

        <View style={styles.productRow}>
          <View style={[styles.imageFrame, { backgroundColor: order.productImage.backgroundColor ?? '#F8F8FA' }]}>
            {imageSource ? (
              <Image source={imageSource} style={styles.productThumb} resizeMode="contain" />
            ) : (
              <Ionicons name="cube-outline" size={28} color={colors.primary} />
            )}
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {order.productName}
            </Text>
            <Text style={styles.variantBadge}>{order.variant}</Text>
            <Text style={styles.productPrice}>{formatINR(order.productAmount)}</Text>
          </View>
        </View>

        <View style={styles.emiHighlightRow}>
          <View style={styles.emiHighlightLeft}>
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.emiPlanName}>{order.emiPlan}</Text>
          </View>
          <Text style={styles.emiMonthlyAmount}>
            {formatINR(order.monthlyEmi)} <Text style={styles.emiPerMonth}>/ month</Text>
          </Text>
        </View>
      </View>

      {/* Delivery & Payment Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Delivery &amp; Payment</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Deliver to:</Text>
          <Text style={styles.infoValueBold}>{order.deliveryAddress.fullName}</Text>
        </View>
        <Text style={styles.addressLineText}>
          {order.deliveryAddress.addressLine}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pinCode}
        </Text>
        <Text style={styles.phoneText}>Mobile: +91 {order.deliveryAddress.mobileNumber}</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Mandate:</Text>
          <Text style={styles.infoValueBold}>{getPaymentMethodLabel(order.paymentMethod)}</Text>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Payment Summary</Text>
        </View>

        <View style={styles.breakdownWrap}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Product Amount</Text>
            <Text style={styles.breakdownValue}>{formatINR(order.productAmount)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Interest</Text>
            <Text style={[styles.breakdownValue, order.interestAmount === 0 && styles.noCostGreen]}>
              {order.interestAmount === 0 ? '₹0 (No-Cost EMI)' : formatINR(order.interestAmount)}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Processing Fee</Text>
            <Text style={styles.breakdownValue}>
              {order.processingFee > 0 ? formatINR(order.processingFee) : 'FREE'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{formatINR(order.totalPayable)}</Text>
          </View>
        </View>
      </View>

      {/* Expanded Order Inspector if "View Order" clicked */}
      {showFullDetails ? (
        <View style={styles.fullOrderCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Order Verification Details</Text>
          </View>
          <View style={styles.jsonWrap}>
            <Text style={styles.specLine}>Status: <Text style={styles.bold}>{order.orderStatus}</Text></Text>
            <Text style={styles.specLine}>Placed at: <Text style={styles.bold}>{new Date(order.createdAt).toLocaleString('en-IN')}</Text></Text>
            <Text style={styles.specLine}>Mandate: <Text style={styles.bold}>{order.paymentMethod.toUpperCase()}</Text></Text>
            <Text style={styles.specLine}>Schedule: <Text style={styles.bold}>{formatINR(order.monthlyEmi)} / month for {order.emiMonths} months</Text></Text>
          </View>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => {
            setShowFullDetails((prev) => !prev);
            onViewOrderDetails?.(order);
          }}
          accessibilityRole="button"
          accessibilityLabel="View Order"
        >
          <Text style={styles.primaryBtnText}>
            {showFullDetails ? 'Hide Order Details' : 'View Order →'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={onContinueShopping}
          accessibilityRole="button"
          accessibilityLabel="Continue Shopping"
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
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
  heroCard: {
    borderRadius: radius.card,
    backgroundColor: '#FAF5FF',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs + 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  successHeading: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  orderIdBadge: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  deliveryEstimate: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: 4,
  },
  deliveryBold: {
    color: colors.textPrimary,
    fontWeight: '800',
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
  productPrice: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: 2,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  infoValueBold: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  addressLineText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  phoneText: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: spacing.xs,
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
  fullOrderCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: '#F9FAFB',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  jsonWrap: {
    gap: 4,
  },
  specLine: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  bold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  actionsCard: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  primaryBtn: {
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
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    minHeight: 48,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
});
