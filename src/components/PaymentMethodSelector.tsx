import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { PaymentMethod } from '../types/order';

type PaymentMethodSelectorProps = {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
};

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'upi',
    title: 'UPI (Instant Verification)',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM UPI',
    icon: 'flash-outline',
  },
  {
    id: 'card',
    title: 'Debit / Credit Card',
    subtitle: 'Visa, MasterCard, RuPay, Maestro',
    icon: 'card-outline',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: 'HDFC, ICICI, SBI, Axis & all major banks',
    icon: 'business-outline',
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Ionicons name="wallet-outline" size={20} color={colors.primary} />
          <Text style={styles.title}>Payment Method</Text>
        </View>
        <Text style={styles.subtitle}>Choose how you want to mandate your EMI</Text>
      </View>

      <View style={styles.optionsList}>
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelectMethod(option.id)}
              style={({ pressed }) => [
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                pressed && styles.optionCardPressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${option.title}, ${option.subtitle}`}
            >
              <View style={styles.optionLeft}>
                <View style={styles.radio}>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  ) : (
                    <View style={styles.radioUnselected} />
                  )}
                </View>

                <View style={styles.iconWrap}>
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                </View>

                <View style={styles.textWrap}>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                    {option.title}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  header: {
    gap: 2,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.cardTitle,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
  },
  optionsList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionCardPressed: {
    opacity: 0.85,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioUnselected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.inactive,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: '#F7F6FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  optionTitleSelected: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  optionSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },
});
