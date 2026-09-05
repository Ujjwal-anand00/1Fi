import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { Store } from '../types/shop';

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>{store.initials}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1}>
          {store.name}
        </Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={15} color={colors.textTertiary} />
          <Text style={styles.address} numberOfLines={2}>
            {store.address}
          </Text>
        </View>
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
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  logoText: {
    color: colors.textPrimary,
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
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  address: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.secondary,
    lineHeight: 18,
  },
});
