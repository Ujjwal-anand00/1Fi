import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { MarketplaceSearch } from '../components/MarketplaceSearch';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { useProducts } from '../hooks/useProducts';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { EmiPlan, Product, ProductVariant } from '../types/marketplace';
import type { Order } from '../types/order';
import { CheckoutScreen } from './CheckoutScreen';
import { OrderConfirmationScreen } from './OrderConfirmationScreen';
import { OrderDetailsScreen } from './OrderDetailsScreen';
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

  // Navigation flow state with selection preservation
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedEmiPlanId, setSelectedEmiPlanId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

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

  // 1. Order Details Screen (View Order)
  if (viewingOrder) {
    return (
      <OrderDetailsScreen
        order={viewingOrder}
        onBack={() => setViewingOrder(null)}
        onContinueShopping={() => {
          setViewingOrder(null);
          setConfirmedOrder(null);
          setCheckoutData(null);
          setSelectedProductId(null);
          setSelectedVariantId(null);
          setSelectedEmiPlanId(null);
          setSearchQuery('');
        }}
      />
    );
  }

  // 2. Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <OrderConfirmationScreen
        order={confirmedOrder}
        onViewOrder={() => setViewingOrder(confirmedOrder)}
        onContinueShopping={() => {
          setConfirmedOrder(null);
          setCheckoutData(null);
          setSelectedProductId(null);
          setSelectedVariantId(null);
          setSelectedEmiPlanId(null);
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

  // 3. Product Details Screen (preserves selected variant and EMI plan on back navigation)
  if (selectedProductId) {
    return (
      <ProductDetailsScreen
        productId={selectedProductId}
        initialVariantId={selectedVariantId}
        initialEmiPlanId={selectedEmiPlanId}
        onBack={() => {
          setSelectedProductId(null);
          setSelectedVariantId(null);
          setSelectedEmiPlanId(null);
        }}
        onProceedToCheckout={(data) => {
          setSelectedVariantId(data.selectedVariant.id);
          setSelectedEmiPlanId(data.selectedEmiPlan.id);
          setCheckoutData(data);
        }}
      />
    );
  }

  const handleProductPress = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedVariantId(null);
    setSelectedEmiPlanId(null);
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
        <LoadingState message="Loading products..." />
      ) : error ? (
        /* Error State */
        <ErrorState
          title="Unable to load products."
          message={error}
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : products.length === 0 ? (
        /* Initial Empty State */
        <EmptyState
          icon="cube-outline"
          title="No products available."
          subtitle="Please check back later for Marketplace products."
        />
      ) : filteredProducts.length === 0 ? (
        /* Search Empty State */
        <EmptyState
          icon="search-outline"
          title="No products found."
          subtitle="Try another search."
          actionLabel="Clear search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        /* Product List */
        <View style={styles.productListSection}>
          <SectionHeader
            title={searchQuery.trim() ? 'Search Results' : 'All Products'}
            badge={filteredProducts.length}
          />

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
  productListSection: {
    gap: spacing.sm,
  },
  cardList: {
    // Keep cards stacked vertically with consistent spacing
  },
});
