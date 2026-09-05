import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function PromoBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />

      <View style={styles.copy}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NO-COST EMIs</Text>
        </View>
        <Text style={styles.heading}>Shop smarter with 1Fi</Text>
        <Text style={styles.description}>Split your favourite purchases into simple monthly plans.</Text>
      </View>

      <View style={styles.visualWrap}>
        <View style={styles.receiptCard}>
          <View style={styles.iconBubble}>
            <Ionicons name="bag-handle" size={32} color={colors.primary} />
          </View>
          <View style={styles.visualLine} />
          <View style={[styles.visualLine, styles.visualLineShort]} />
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.smallCardText}>0%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 178,
    overflow: 'hidden',
    borderRadius: radius.banner,
    backgroundColor: colors.primary,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  glowLarge: {
    position: 'absolute',
    right: -34,
    top: -42,
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  glowSmall: {
    position: 'absolute',
    left: -18,
    bottom: -42,
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  copy: {
    flex: 1,
    paddingRight: spacing.md,
    zIndex: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  heading: {
    color: colors.white,
    fontSize: typography.bannerTitle,
    lineHeight: 32,
    fontWeight: '800',
    maxWidth: 190,
  },
  description: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: typography.secondary,
    lineHeight: 19,
    marginTop: spacing.sm,
    maxWidth: 210,
  },
  visualWrap: {
    width: 112,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  receiptCard: {
    width: 88,
    height: 108,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  visualLine: {
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.borderSoft,
    marginTop: spacing.md,
  },
  visualLineShort: {
    width: 28,
    marginTop: spacing.xs,
  },
  smallCard: {
    position: 'absolute',
    right: 2,
    bottom: 8,
    width: 42,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  smallCardText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
