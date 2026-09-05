import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const icons = {
  Home: 'home-outline',
  Shop: 'bag-handle-outline',
  'EMI Dues': 'card-outline',
  Limit: 'speedometer-outline',
  Profile: 'person-outline',
} as const;

export function BottomNavigation({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.nav}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key].options;
          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={styles.item}
            >
              <View style={[styles.activeIndicator, !isFocused && styles.hiddenIndicator]} />
              <Ionicons
                name={icons[route.name as keyof typeof icons]}
                size={21}
                color={isFocused ? colors.primary : colors.inactive}
              />
              <Text style={[styles.label, isFocused && styles.activeLabel]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  nav: {
    minHeight: 74,
    borderRadius: radius.nav,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8,
  },
  item: {
    flex: 1,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 24,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginBottom: spacing.xs,
  },
  hiddenIndicator: {
    backgroundColor: 'transparent',
  },
  label: {
    color: colors.inactive,
    fontSize: typography.navLabel,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
});
