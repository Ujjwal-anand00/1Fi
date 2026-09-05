import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { EmiPlanCard } from '../components/EmiPlanCard';
import { VariantSelector } from '../components/VariantSelector';
import { getProductById } from '../services/marketplaceService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPlan, Product, ProductVariant } from '../types/marketplace';
import { calculateEmiDetails } from '../utils/emiCalculator';
import { formatINR } from '../utils/formatters';

type ProductDetailsScreenProps = {
  productId: string;
  onBack?: () => void;
  onProceedToCheckout?: (params: {
    product: Product;
    selectedVariant: ProductVariant;
    selectedEmiPlan: EmiPlan;
  }) => void;
};

export function ProductDetailsScreen({
  productId,
  onBack,
  onProceedToCheckout,
}: ProductDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedEmiPlanId, setSelectedEmiPlanId] = useState<string | null>(null);
  const [ctaConfirmed, setCtaConfirmed] = useState(false);

  // Clearance for floating bottom navigation
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setCtaConfirmed(false);
        const data = await getProductById(productId);

        if (!isMounted) return;

        if (data) {
          setProduct(data);
          // Default to first available variant
          const defaultVariant = data.variants.find((v) => v.available) ?? data.variants[0];
          setSelectedVariantId(defaultVariant ? defaultVariant.id : null);

          // Default to first available EMI plan
          const defaultPlan = data.emiPlans.find((p) => p.available) ?? data.emiPlans[0];
          setSelectedEmiPlanId(defaultPlan ? defaultPlan.id : null);
        } else {
          setProduct(null);
          setError('Product not found.');
        }
      } catch {
        if (isMounted) {
          setProduct(null);
          setError('Unable to load product details.');
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

  // Active variant & dynamic price calculation (SINGLE SOURCE OF TRUTH)
  const activeVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0] ?? null;
  }, [product?.variants, selectedVariantId]);

  const currentPrice = activeVariant ? activeVariant.price : (product?.price ?? 0);
  const isVariantAvailable = activeVariant ? activeVariant.available : true;
  const hasNoCostEmi = product?.emiPlans ? product.emiPlans.some((p) => p.available && p.interestRate === 0) : false;

  // Recalculate ALL EMI plans dynamically using currentPrice as the single source of truth
  const dynamicEmiPlans = useMemo(() => {
    if (!product?.emiPlans || currentPrice <= 0) return [];
    return product.emiPlans.map((rawPlan) => {
      const calc = calculateEmiDetails(currentPrice, rawPlan);
      return {
        ...rawPlan,
        monthlyAmount: calc.monthlyEmi,
        totalAmount: calc.principal + calc.interestAmount,
      };
    });
  }, [product?.emiPlans, currentPrice]);

  // Selected plan dynamically synced to the current variant price
  const selectedPlan = useMemo(() => {
    return dynamicEmiPlans.find((p) => p.id === selectedEmiPlanId) ?? dynamicEmiPlans[0] ?? null;
  }, [dynamicEmiPlans, selectedEmiPlanId]);

  // Dynamic EMI calculation for the currently selected plan
  const selectedPlanCalc = useMemo(() => {
    if (!selectedPlan || currentPrice <= 0) return null;
    return calculateEmiDetails(currentPrice, selectedPlan);
  }, [currentPrice, selectedPlan]);

  // Bottom Total Amount: variant price + interest + applicable fees
  const bottomTotalAmount = selectedPlanCalc ? selectedPlanCalc.totalPayable : currentPrice;

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id);
    setCtaConfirmed(false);
  };

  const handleSelectPlan = (plan: EmiPlan) => {
    setSelectedEmiPlanId(plan.id);
    setCtaConfirmed(false);
  };

  const handleProceedCta = () => {
    if (!isVariantAvailable || !activeVariant || !selectedPlan || !product) return;
    if (onProceedToCheckout) {
      onProceedToCheckout({
        product,
        selectedVariant: {
          ...activeVariant,
          price: currentPrice,
        },
        selectedEmiPlan: selectedPlan,
      });
    } else {
      setCtaConfirmed(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back to Marketplace">
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Back to Marketplace</Text>
          </Pressable>
        ) : null}
        <View style={styles.stateCard}>
          <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
          <Text style={styles.stateTitle}>Loading product details...</Text>
        </View>
        <View style={{ height: bottomClearance }} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.stateContainer}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back to Marketplace">
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Back to Marketplace</Text>
          </Pressable>
        ) : null}
        <View style={styles.stateCard}>
          <Ionicons name="alert-circle-outline" size={36} color={colors.danger} />
          <Text style={styles.stateTitle}>{error ?? 'Product not found'}</Text>
          {onBack ? (
            <Pressable style={styles.actionButton} onPress={onBack}>
              <Text style={styles.actionButtonText}>Back to Products</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={{ height: bottomClearance }} />
      </View>
    );
  }

  const imageSource =
    product.image.source ?? (product.image.uri ? { uri: product.image.uri } : null);

  return (
    <View style={styles.wrapper}>
      {/* Navigation Header */}
      <View style={styles.topNavRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back to Marketplace">
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Back to Marketplace</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Product Hero Image Card */}
      <View style={styles.heroCard}>
        <View
          style={[
            styles.imageFrame,
            { backgroundColor: product.image.backgroundColor ?? '#F8F8FA' },
          ]}
        >
          {imageSource ? (
            <Image source={imageSource} style={styles.heroImage} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={60} color={colors.primary} />
          )}

          {/* Category Tag */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>
      </View>

      {/* Product Title & Pricing Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{formatINR(currentPrice)}</Text>
          {hasNoCostEmi ? (
            <View style={styles.noCostBadge}>
              <Ionicons name="flash" size={12} color={colors.primary} />
              <Text style={styles.noCostText}>No-cost EMI available</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.descriptionText}>{product.description}</Text>

        {/* Feature Highlights */}
        {product.details && product.details.length > 0 ? (
          <View style={styles.featuresWrap}>
            {product.details.map((item, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.featureText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* Variant Selector Section */}
      {product.variants && product.variants.length > 0 ? (
        <View style={styles.sectionCard}>
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={handleSelectVariant}
          />
        </View>
      ) : null}

      {/* EMI Plans Section */}
      {dynamicEmiPlans.length > 0 ? (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available EMI Plans</Text>
            <Text style={styles.sectionSubtitle}>
              Select a flexible plan powered by your 1Fi credit limit
            </Text>
          </View>

          <View style={styles.emiList}>
            {dynamicEmiPlans.map((plan) => (
              <EmiPlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedEmiPlanId === plan.id}
                onSelect={handleSelectPlan}
              />
            ))}
          </View>
        </View>
      ) : null}

      {/* Confirmation Feedback */}
      {ctaConfirmed ? (
        <View style={styles.confirmedCard}>
          <View style={styles.confirmedHeader}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            <Text style={styles.confirmedTitle}>EMI Plan Ready</Text>
          </View>
          <Text style={styles.confirmedText}>
            Selected {activeVariant?.label ?? 'standard'} configuration ({formatINR(currentPrice)}) with{' '}
            {selectedPlan ? `${selectedPlan.durationMonths} Months EMI (${formatINR(selectedPlan.monthlyAmount)}/mo)` : 'flexible EMI'}.
          </Text>
          <Text style={styles.confirmedSubtext}>
            Ready for Step 8 — EMI Plan Selection &amp; Checkout.
          </Text>
        </View>
      ) : null}

      {/* Primary CTA Section */}
      <View style={styles.ctaCard}>
        <View style={styles.ctaPriceWrap}>
          <Text style={styles.ctaPriceLabel}>Total Amount</Text>
          <Text style={styles.ctaPrice}>{formatINR(bottomTotalAmount)}</Text>
          {selectedPlan ? (
            <Text style={styles.ctaEmiSummary}>
              EMI: {formatINR(selectedPlan.monthlyAmount)} × {selectedPlan.durationMonths} mos
            </Text>
          ) : null}
        </View>

        <Pressable
          style={[styles.primaryButton, !isVariantAvailable && styles.primaryButtonDisabled]}
          onPress={handleProceedCta}
          disabled={!isVariantAvailable}
          accessibilityRole="button"
          accessibilityLabel={isVariantAvailable ? 'Select EMI Plan' : 'Selected variant out of stock'}
        >
          <Text style={styles.primaryButtonText}>
            {isVariantAvailable ? 'Select EMI Plan →' : 'Out of Stock'}
          </Text>
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
  stateContainer: {
    gap: spacing.lg,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
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
  heroCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageFrame: {
    width: '100%',
    height: 190,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: spacing.sm,
  },
  heroImage: {
    width: '90%',
    height: '90%',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  detailsCard: {
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
  productName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priceText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  noCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  noCostText: {
    color: colors.primary,
    fontSize: typography.secondary,
    fontWeight: '800',
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 21,
    marginTop: 2,
  },
  featuresWrap: {
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  featureText: {
    color: colors.textPrimary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionHeader: {
    gap: 2,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  emiList: {
    gap: spacing.xs,
  },
  confirmedCard: {
    borderRadius: radius.card,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    padding: spacing.md,
    gap: spacing.xs,
  },
  confirmedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  confirmedTitle: {
    color: '#065F46',
    fontSize: typography.body,
    fontWeight: '800',
  },
  confirmedText: {
    color: '#047857',
    fontSize: typography.secondary,
    lineHeight: 18,
    fontWeight: '600',
  },
  confirmedSubtext: {
    color: '#059669',
    fontSize: typography.small,
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
  ctaPriceWrap: {
    gap: 2,
  },
  ctaPriceLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '600',
  },
  ctaPrice: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  ctaEmiSummary: {
    color: colors.primary,
    fontSize: typography.secondary,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.inactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  stateCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  spinner: {
    marginBottom: spacing.xs,
  },
  stateTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
    textAlign: 'center',
  },
  actionButton: {
    minHeight: 42,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.label,
    fontWeight: '800',
  },
});
