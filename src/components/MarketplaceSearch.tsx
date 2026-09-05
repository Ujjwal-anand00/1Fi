import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type MarketplaceSearchProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function MarketplaceSearch({
  value,
  onChangeText,
  placeholder = 'Search products...',
}: MarketplaceSearchProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={19} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    paddingVertical: spacing.md,
  },
  clearButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
