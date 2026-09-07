import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPlan, Product } from '../types/marketplace';
import { formatINR } from '../utils/formatters';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

// Derive subtle category icon as fallback
function getCategoryIcon(category: string): keyof typeof Ionicons.glyphMap {
  const cat = category.toLowerCase();
  if (cat.includes('phone')) return 'phone-portrait-outline';
  if (cat.includes('laptop')) return 'laptop-outline';
  if (cat.includes('headphone') || cat.includes('audio')) return 'headset-outline';
  if (cat.includes('watch')) return 'watch-outline';
  if (cat.includes('tablet')) return 'tablet-portrait-outline';
  if (cat.includes('tv') || cat.includes('television')) return 'tv-outline';
  if (cat.includes('appliance') || cat.includes('home')) return 'cafe-outline';
  return 'cube-outline';
}

// Derive clean EMI hint without hardcoding
function getEmiHint(emiPlans: EmiPlan[]): string | null {
  if (!emiPlans || emiPlans.length === 0) return null;

  const available = emiPlans.filter((plan) => plan.available);
  if (available.length === 0) return null;

  const hasNoCost = available.some((plan) => plan.interestRate === 0);
  if (hasNoCost) {
    return 'No-cost EMI available';
  }

  const lowestMonthly = Math.min(...available.map((plan) => plan.monthlyAmount));
  return `EMI from ${formatINR(lowestMonthly)}/mo`;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const emiHint = getEmiHint(product.emiPlans);
  const iconName = getCategoryIcon(product.category);

  // Support local asset source and remote uri
  const imageSource = product.image.source ?? (product.image.uri ? { uri: product.image.uri } : null);
  const hasValidImage = Boolean(imageSource) && !imageError;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatINR(product.price)}`}
    >
      {/* Product visual container - LEFT */}
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: product.image.backgroundColor ?? '#F8F8FA' },
        ]}
      >
        {hasValidImage && imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.placeholderWrap}>
            <Ionicons name={iconName} size={32} color={colors.primary} />
          </View>
        )}
      </View>

      {/* Product info section - RIGHT */}
      <View style={styles.info}>
        {/* Title row with Category badge */}
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        {/* Price */}
        <Text style={styles.price}>{formatINR(product.price)}</Text>

        {/* Bottom row: No-cost EMI badge and chevron navigation icon */}
        <View style={styles.bottomRow}>
          {emiHint ? (
            <View style={styles.emiBadge}>
              <Ionicons name="flash" size={11} color={colors.primary} />
              <Text style={styles.emiText} numberOfLines={1}>
                {emiHint}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: spacing.xs,
    flexShrink: 0,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  placeholderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  name: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
    lineHeight: 20,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    flexShrink: 0,
    marginTop: 1,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  emiBadge: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  emiText: {
    color: colors.primary,
    fontSize: typography.secondary,
    fontWeight: '700',
    lineHeight: 16,
  },
});
