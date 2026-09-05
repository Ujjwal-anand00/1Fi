import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getProductById } from '../services/marketplaceService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { Product } from '../types/marketplace';
import { formatINR } from '../utils/formatters';

type ProductDetailsScreenProps = {
  productId: string;
  onBack?: () => void;
};

export function ProductDetailsScreen({ productId, onBack }: ProductDetailsScreenProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        if (isMounted) {
          setProduct(data);
        }
      } catch {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  return (
    <View style={styles.wrapper}>
      {/* Back button */}
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back to Marketplace">
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Back to Marketplace</Text>
        </Pressable>
      ) : null}

      <Text style={styles.screenTitle}>Product Details</Text>

      {loading ? (
        <View style={styles.placeholderCard}>
          <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
          <Text style={styles.statusText}>Loading product details...</Text>
        </View>
      ) : !product ? (
        <View style={styles.placeholderCard}>
          <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
          <Text style={styles.productName}>Product not found</Text>
        </View>
      ) : (
        <View style={styles.placeholderCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={32} color={colors.primary} />
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatINR(product.price)}</Text>
          <Text style={styles.productCategory}>{product.category}</Text>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Step 6 verification: Tapping a product successfully routed to this Product Details placeholder with product ID &quot;{productId}&quot;.
            </Text>
            <Text style={styles.noteSubtext}>
              Full product gallery, variant selectors, EMI options, and checkout CTA will be implemented in Step 7.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  backText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
    lineHeight: 24,
  },
  placeholderCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  spinner: {
    marginBottom: spacing.md,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  productName: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
    textAlign: 'center',
  },
  productPrice: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  productCategory: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    marginTop: 2,
  },
  noteBox: {
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    width: '100%',
  },
  noteText: {
    color: colors.textPrimary,
    fontSize: typography.secondary,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  noteSubtext: {
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
