import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandCard } from '../components/BrandCard';
import { PromoBanner } from '../components/PromoBanner';
import { SearchBar } from '../components/SearchBar';
import { ShopTabs } from '../components/ShopTabs';
import { StoreCard } from '../components/StoreCard';
import { featuredBrands, nearbyStores, shopTabs } from '../data/shopData';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ShopTabKey } from '../types/shop';
import { MarketplaceScreen } from './MarketplaceScreen';

export function ShopScreen() {
  const [activeTab, setActiveTab] = useState<ShopTabKey>('top-brands');
  const [searchQuery, setSearchQuery] = useState('');

  const searchPlaceholder = activeTab === 'nearby-stores' ? 'Search stores...' : 'Search online stores...';
  const sectionTitle = activeTab === 'nearby-stores' ? 'Nearby Stores' : 'Top Brands';
  const showSearch = activeTab !== 'marketplace';

  const content = useMemo(() => {
    if (activeTab === 'marketplace') {
      return <MarketplaceScreen />;
    }

    if (activeTab === 'nearby-stores') {
      return nearbyStores.map((store) => <StoreCard key={store.id} store={store} />);
    }

    return featuredBrands.map((brand) => <BrandCard key={brand.id} brand={brand} />);
  }, [activeTab]);

  const handleTabChange = (tab: ShopTabKey) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.header}>Shop</Text>
          <PromoBanner />
          <ShopTabs tabs={shopTabs} activeTab={activeTab} onChange={handleTabChange} />
          {showSearch ? (
            <SearchBar placeholder={searchPlaceholder} value={searchQuery} onChangeText={setSearchQuery} />
          ) : null}

          {activeTab !== 'marketplace' ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            </View>
          ) : null}

          <View style={styles.cardList}>{content}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    // Keep content clear of the floating navigation
    paddingBottom: 160,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  header: {
    color: colors.textPrimary,
    fontSize: typography.screenTitle,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 31,
  },
  sectionHeader: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
    lineHeight: 24,
  },
  cardList: {
    gap: spacing.md,
  },
});
