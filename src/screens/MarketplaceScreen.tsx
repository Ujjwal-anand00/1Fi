import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { MarketplaceSearch } from '../components/MarketplaceSearch';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPlan, Product, ProductVariant } from '../types/marketplace';
import type { Order } from '../types/order';
import { CheckoutScreen } from './CheckoutScreen';
import { OrderConfirmationScreen } from './OrderConfirmationScreen';
import { ProductDetailsScreen } from './ProductDetailsScreen';

type CheckoutData = {
  product: Product;
  selectedVariant: ProductVariant;
  selectedEmiPlan: EmiPlan;
};

export function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const { products, loading, error, refetch } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation flow state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Floating bottom navigation clearance
  const bottomClearance = 74 + Math.max(insets.bottom, spacing.md) + spacing.lg;

  // Case-insensitive name filter
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return products;
    }
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, searchQuery]);

  // 1. Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <OrderConfirmationScreen
        order={confirmedOrder}
        onContinueShopping={() => {
          setConfirmedOrder(null);
          setCheckoutData(null);
          setSelectedProductId(null);
          setSearchQuery('');
        }}
      />
    );
  }

  // 2. Checkout Screen
  if (checkoutData) {
    return (
      <CheckoutScreen
        product={checkoutData.product}
        selectedVariant={checkoutData.selectedVariant}
        selectedEmiPlan={checkoutData.selectedEmiPlan}
        onBack={() => setCheckoutData(null)}
        onOrderPlaced={(order) => {
          setConfirmedOrder(order);
          setCheckoutData(null);
        }}
      />
    );
  }

  // 3. Product Details Screen
  if (selectedProductId) {
    return (
      <ProductDetailsScreen
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
        onProceedToCheckout={(data) => setCheckoutData(data)}
      />
    );
  }

  const handleProductPress = (product: Product) => {
    setSelectedProductId(product.id);
  };

  return (
    <View style={styles.wrapper}>
      {/* Marketplace Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="storefront-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>1Fi Marketplace</Text>
          <Text style={styles.subtitle}>Explore products with flexible EMI options.</Text>
        </View>
      </View>

      {/* Search Bar */}
      <MarketplaceSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products..."
      />

      {/* Loading State */}
      {loading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
          <Text style={styles.stateTitle}>Loading products...</Text>
        </View>
      ) : error ? (
        /* Error State */
        <View style={styles.stateCard}>
          <View style={[styles.stateIcon, styles.errorIcon]}>
            <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
          </View>
          <Text style={styles.stateTitle}>Unable to load products.</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <Pressable style={styles.actionButton} onPress={refetch}>
            <Text style={styles.actionButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : products.length === 0 ? (
        /* Initial Empty State */
        <View style={styles.stateCard}>
          <View style={styles.stateIcon}>
            <Ionicons name="cube-outline" size={28} color={colors.textSecondary} />
          </View>
          <Text style={styles.stateTitle}>No products available.</Text>
          <Text style={styles.stateSubtitle}>Please check back later for Marketplace products.</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        /* Search Empty State */
        <View style={styles.stateCard}>
          <View style={styles.stateIcon}>
            <Ionicons name="search-outline" size={28} color={colors.textSecondary} />
          </View>
          <Text style={styles.stateTitle}>No products found.</Text>
          <Text style={styles.stateSubtitle}>Try another search.</Text>
          <Pressable style={styles.secondaryButton} onPress={() => setSearchQuery('')}>
            <Text style={styles.secondaryButtonText}>Clear search</Text>
          </Pressable>
        </View>
      ) : (
        /* Product List */
        <View style={styles.productListSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim() ? `Search Results (${filteredProducts.length})` : 'All Products'}
            </Text>
          </View>

          <View style={styles.cardList}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))}
          </View>

          {/* Guaranteed clearance above floating bottom navigation */}
          <View style={{ height: bottomClearance }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#E4D8FF',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
    lineHeight: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
    lineHeight: 24,
  },
  productListSection: {
    gap: spacing.sm,
  },
  cardList: {
    // Keep cards stacked vertically with consistent spacing
  },
  stateCard: {
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
  stateIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    marginBottom: spacing.md,
  },
  errorIcon: {
    backgroundColor: colors.dangerSoft,
  },
  spinner: {
    marginBottom: spacing.md,
  },
  stateTitle: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actionButton: {
    minHeight: 42,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.label,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 38,
    borderRadius: radius.button,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.secondary,
    fontWeight: '700',
  },
});
