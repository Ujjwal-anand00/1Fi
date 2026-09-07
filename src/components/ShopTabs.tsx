import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={[styles.tab, isActive && styles.activeTab]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Text
                style={[styles.label, isActive && styles.activeLabel]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {tab.label}
              </Text>
              <View style={[styles.indicator, isActive && styles.activeIndicator]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
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
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
  },
  indicator: {
    width: 24,
    height: 3,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    backgroundColor: colors.primary,
  },
});

