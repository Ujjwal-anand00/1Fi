import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ProductVariant } from '../types/marketplace';
import { formatINR } from '../utils/formatters';

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelectVariant: (variant: ProductVariant) => void;
};

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Variant</Text>
        <Text style={styles.subtitle}>Choose your preferred configuration</Text>
      </View>

      <View style={styles.variantList}>
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isAvailable = variant.available;

          return (
            <Pressable
              key={variant.id}
              onPress={() => {
                if (isAvailable) {
                  onSelectVariant(variant);
                }
              }}
              style={({ pressed }) => [
                styles.variantCard,
                isSelected && styles.variantCardSelected,
                !isAvailable && styles.variantCardDisabled,
                pressed && isAvailable && styles.variantCardPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
              accessibilityLabel={`${variant.label}, ${variant.value}, ${formatINR(variant.price)}${!isAvailable ? ', out of stock' : ''}`}
            >
              <View style={styles.variantLeft}>
                <View style={styles.radio}>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  ) : (
                    <View style={styles.radioUnselected} />
                  )}
                </View>

                <View style={styles.variantInfo}>
                  <View style={styles.typeLabelRow}>
                    <Text
                      style={[
                        styles.variantLabel,
                        isSelected && styles.variantLabelSelected,
                        !isAvailable && styles.textDisabled,
                      ]}
                    >
                      {variant.label}
                    </Text>
                    {variant.value ? (
                      <Text style={[styles.variantValue, !isAvailable && styles.textDisabled]}>
                        • {variant.value}
                      </Text>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.variantType,
                      isSelected && styles.variantTypeSelected,
                      !isAvailable && styles.textDisabled,
                    ]}
                  >
                    {variant.type}
                  </Text>
                </View>
              </View>

              <View style={styles.variantRight}>
                <Text
                  style={[
                    styles.variantPrice,
                    isSelected && styles.variantPriceSelected,
                    !isAvailable && styles.textDisabled,
                  ]}
                >
                  {formatINR(variant.price)}
                </Text>

                {!isAvailable ? (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of stock</Text>
                  </View>
                ) : isSelected ? (
                  <Text style={styles.selectedTag}>Selected</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    gap: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  variantList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  variantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  variantCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  variantCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F7F7F9',
    borderColor: colors.borderSoft,
  },
  variantCardPressed: {
    opacity: 0.85,
  },
  variantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioUnselected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.inactive,
  },
  variantInfo: {
    gap: 2,
  },
  typeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  variantLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  variantLabelSelected: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  variantValue: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  variantType: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  variantTypeSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  variantRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  variantPrice: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  variantPriceSelected: {
    color: colors.primaryDark,
  },
  selectedTag: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  outOfStockBadge: {
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  outOfStockText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
  },
  textDisabled: {
    color: colors.inactive,
  },
});
