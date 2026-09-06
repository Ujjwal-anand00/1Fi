import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ProductImage } from '../types/marketplace';
import { formatINR } from '../utils/formatters';

type OrderSummaryCardProps = {
  productName: string;
  productImage: ProductImage;
  variantLabel: string;
  price: number;
  quantity?: number;
  emiPlanTitle: string;
  monthlyEmi: number;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function OrderSummaryCard({
  productName,
  productImage,
  variantLabel,
  price,
  quantity = 1,
  emiPlanTitle,
  monthlyEmi,
  title = 'Order Summary',
  icon = 'bag-check-outline',
}: OrderSummaryCardProps) {
  const imageSource =
    productImage.source ?? (productImage.uri ? { uri: productImage.uri } : null);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <View style={styles.productRow}>
        <View
          style={[
            styles.imageFrame,
            { backgroundColor: productImage.backgroundColor ?? '#F8F8FA' },
          ]}
        >
          {imageSource ? (
            <Image source={imageSource} style={styles.productThumb} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={28} color={colors.primary} />
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
          <Text style={styles.variantBadge}>{variantLabel}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.quantityLabel}>Qty: {quantity}</Text>
            <Text style={styles.productPrice}>{formatINR(price)}</Text>
          </View>
        </View>
      </View>

      {/* Selected EMI Highlight */}
      <View style={styles.emiHighlightRow}>
        <View style={styles.emiHighlightLeft}>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={styles.emiPlanName}>{emiPlanTitle}</Text>
        </View>
        <Text style={styles.emiMonthlyAmount}>
          {formatINR(monthlyEmi)} <Text style={styles.emiPerMonth}>/ mo</Text>
        </Text>
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
});
