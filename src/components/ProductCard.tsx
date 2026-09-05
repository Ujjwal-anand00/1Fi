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
      {/* Product visual container */}
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
            <Ionicons name={iconName} size={36} color={colors.primary} />
          </View>
        )}

        {/* Category tag */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
      </View>

      {/* Product info section with consistent vertical rhythm */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatINR(product.price)}</Text>
          <Ionicons name="chevron-forward" size={17} color={colors.textTertiary} />
        </View>

        {emiHint ? (
          <View style={styles.emiBadge}>
            <Ionicons name="flash" size={11} color={colors.primary} />
            <Text style={styles.emiText}>{emiHint}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.md,
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
    width: '100%',
    height: 124,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: spacing.xs,
  },
  image: {
    width: '88%',
    height: '88%',
  },
  placeholderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.xs + 2,
    right: spacing.xs + 2,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  info: {
    marginTop: spacing.sm,
    gap: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  emiBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginTop: 2,
  },
  emiText: {
    color: colors.primary,
    fontSize: typography.secondary,
    fontWeight: '700',
    lineHeight: 16,
  },
});
