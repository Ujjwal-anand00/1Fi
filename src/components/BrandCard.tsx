import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { Brand } from '../types/shop';

type BrandCardProps = {
  brand: Brand;
};

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>{brand.initials}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1}>
          {brand.name}
        </Text>
        <Text style={styles.offer} numberOfLines={2}>
          {brand.offer}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.045,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#E4D8FF',
    marginRight: spacing.md,
  },
  logoText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  offer: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
