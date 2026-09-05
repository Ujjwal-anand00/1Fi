import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { ShopTab, ShopTabKey } from '../types/shop';

type ShopTabsProps = {
  tabs: ShopTab[];
  activeTab: ShopTabKey;
  onChange: (tab: ShopTabKey) => void;
};

export function ShopTabs({ tabs, activeTab, onChange }: ShopTabsProps) {
  return (
    <View style={styles.shell}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={1}>
                {tab.label}
              </Text>
              <View style={[styles.indicator, isActive && styles.activeIndicator]} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.xs,
  },
  container: {
    gap: spacing.xs,
  },
  tab: {
    minWidth: 118,
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  activeTab: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    color: colors.inactive,
    fontSize: typography.label,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.primary,
  },
  indicator: {
    width: 28,
    height: 3,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    backgroundColor: colors.primary,
  },
});
