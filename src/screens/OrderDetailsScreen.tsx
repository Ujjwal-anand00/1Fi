import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { Order } from '../types/order';
import { formatINR } from '../utils/formatters';

type OrderDetailsScreenProps = {
  order: Order;
  onBack: () => void;
  onContinueShopping: () => void;
};

type TimelineStep = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isCompleted: boolean;
  isCurrent: boolean;
};

export function OrderDetailsScreen({
  order,
  onBack,
  onContinueShopping,
}: OrderDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  const imageSource = order.productImage.source ?? (order.productImage.uri ? { uri: order.productImage.uri } : null);

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'upi':
        return 'UPI Autopay Mandate';
      case 'card':
        return 'Debit / Credit Card';
      case 'netbanking':
        return 'Net Banking e-Mandate';
      default:
        return 'Online Mandate';
    }
  };

  const timelineSteps: TimelineStep[] = [
    {
      id: 'placed',
      label: 'Order Placed',
      icon: 'checkmark',
      isCompleted: true,
      isCurrent: false,
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      icon: 'shield-checkmark',
      isCompleted: true,
      isCurrent: true,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      icon: 'airplane-outline',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: 'home-outline',
      isCompleted: false,
      isCurrent: false,
    },
  ];

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const addressLine = order.deliveryAddress.addressLine1 || order.deliveryAddress.addressLine;

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Back to Order Confirmation">
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Order Status Timeline Card */}
      <View style={styles.card}>
        <View style={styles.statusHeader}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusTitle}>Status: <Text style={styles.statusBold}>{order.orderStatus}</Text></Text>
            <Text style={styles.orderIdText}>Order ID: {order.orderId}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Active</Text>
          </View>
        </View>

        {/* Timeline Visualization */}
        <View style={styles.timelineWrapper}>
          {timelineSteps.map((step, idx) => {
            const isLast = idx === timelineSteps.length - 1;

            return (
              <View key={step.id} style={styles.timelineStepWrap}>
                <View style={styles.stepNodeRow}>
                  <View
                    style={[
                      styles.stepCircle,
                      step.isCompleted && styles.stepCircleCompleted,
                      step.isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={14}
                      color={step.isCompleted || step.isCurrent ? colors.white : colors.textTertiary}
                    />
                  </View>

                  {!isLast ? (
                    <View
                      style={[
                        styles.connectorLine,
                        timelineSteps[idx + 1].isCompleted && styles.connectorLineActive,
                      ]}
                    />
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.stepLabel,
                    step.isCurrent && styles.stepLabelCurrent,
                    step.isCompleted && !step.isCurrent && styles.stepLabelCompleted,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.expectedBox}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={styles.expectedText}>
            Expected Delivery by <Text style={styles.expectedBold}>{order.expectedDelivery}</Text>
          </Text>
        </View>
      </View>

      {/* Product Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bag-check-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Purchased Item</Text>
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
            <View style={styles.metaRow}>
              <Text style={styles.quantityText}>Qty: {order.quantity}</Text>
              <Text style={styles.productPrice}>{formatINR(order.productPrice || order.productAmount)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* EMI & Payment Breakdown */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>EMI &amp; Payment Breakdown</Text>
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

        <View style={styles.breakdownWrap}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Product Price</Text>
            <Text style={styles.breakdownValue}>{formatINR(order.productPrice || order.productAmount)}</Text>
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

      {/* Delivery Address Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Delivery Address</Text>
        </View>

        <View style={styles.addressWrap}>
          <Text style={styles.recipientName}>{order.deliveryAddress.fullName}</Text>
          <Text style={styles.addressLineText}>{addressLine}</Text>
          {order.deliveryAddress.addressLine2 ? (
            <Text style={styles.addressLineText}>{order.deliveryAddress.addressLine2}</Text>
          ) : null}
          <Text style={styles.cityPinText}>
            {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pinCode}
          </Text>
          <Text style={styles.phoneText}>Mobile: +91 {order.deliveryAddress.mobileNumber}</Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="wallet-outline" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Payment Information</Text>
        </View>

        <View style={styles.metaList}>
          <View style={styles.metaItem}>
            <Text style={styles.metaItemLabel}>Payment Mandate</Text>
            <Text style={styles.metaItemValue}>{getPaymentLabel(order.paymentMethod)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaItemLabel}>Order Date</Text>
            <Text style={styles.metaItemValue}>{formattedDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaItemLabel}>Mandate Status</Text>
            <Text style={styles.activeMandateText}>Active &amp; Verified</Text>
          </View>
        </View>
      </View>

      {/* Action CTA */}
      <View style={styles.ctaCard}>
        <Pressable
          style={styles.continueBtn}
          onPress={onContinueShopping}
          accessibilityRole="button"
          accessibilityLabel="Continue Shopping"
        >
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  statusLeft: {
    gap: 2,
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '700',
  },
  statusBold: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  orderIdText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusBadgeText: {
    color: '#047857',
    fontSize: typography.small,
    fontWeight: '800',
  },
  timelineWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: spacing.sm,
    paddingHorizontal: 4,
  },
  timelineStepWrap: {
    alignItems: 'center',
    flex: 1,
  },
  stepNodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepCircleCompleted: {
    backgroundColor: colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.primarySoft,
  },
  connectorLine: {
    position: 'absolute',
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  connectorLineActive: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  stepLabelCompleted: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  expectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  expectedText: {
    color: colors.primaryDark,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  expectedBold: {
    fontWeight: '800',
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  quantityText: {
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
  addressWrap: {
    gap: 2,
    marginTop: spacing.xs,
  },
  recipientName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
    marginBottom: 2,
  },
  addressLineText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  cityPinText: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  phoneText: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  metaList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItemLabel: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  metaItemValue: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  activeMandateText: {
    color: '#059669',
    fontSize: typography.body,
    fontWeight: '800',
  },
  ctaCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  continueBtn: {
    minHeight: 50,
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
  continueBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
