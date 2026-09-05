import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type EmiTermsSectionProps = {
  agreed: boolean;
  onToggleAgreement: () => void;
};

type PolicyType = 'terms' | 'cancellation' | 'privacy';

const POLICY_DETAILS: Record<PolicyType, { title: string; content: string }> = {
  terms: {
    title: '1Fi EMI Terms & Conditions',
    content:
      'By selecting 1Fi flexible EMI, you agree to automatic monthly debit on the specified date. No-cost EMI products incur zero interest. Pre-closure of EMI carries no prepayment penalties. Defaults in payments may impact your credit score and credit limit.',
  },
  cancellation: {
    title: 'Cancellation & Refund Policy',
    content:
      'Orders can be cancelled before dispatch for an immediate 100% refund. For delivered products, 7-day hassle-free replacement or return is available for verified defects or transit damages. Refunds reflect within 2-4 business days.',
  },
  privacy: {
    title: 'Privacy & Data Policy',
    content:
      'Your financial and personal details are encrypted using 256-bit bank-grade encryption. 1Fi never shares your financial records with unverified third parties without explicit consent.',
  },
};

export function EmiTermsSection({ agreed, onToggleAgreement }: EmiTermsSectionProps) {
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  return (
    <View style={styles.container}>
      {/* Checkbox Agreement */}
      <Pressable
        style={styles.checkboxRow}
        onPress={onToggleAgreement}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}
        accessibilityLabel="I agree to the EMI terms and conditions"
      >
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
        </View>

        <Text style={styles.checkboxLabel}>
          I agree to the <Text style={styles.linkText}>EMI terms and conditions</Text>.
        </Text>
      </Pressable>

      {/* Policy Links */}
      <View style={styles.linksRow}>
        <Pressable onPress={() => setActivePolicy('terms')} hitSlop={6}>
          <Text style={styles.policyLink}>EMI Terms</Text>
        </Pressable>
        <Text style={styles.dotSeparator}>•</Text>
        <Pressable onPress={() => setActivePolicy('cancellation')} hitSlop={6}>
          <Text style={styles.policyLink}>Cancellation & Refund</Text>
        </Pressable>
        <Text style={styles.dotSeparator}>•</Text>
        <Pressable onPress={() => setActivePolicy('privacy')} hitSlop={6}>
          <Text style={styles.policyLink}>Privacy Policy</Text>
        </Pressable>
      </View>

      {/* Terms & Policies Modal */}
      <Modal
        visible={Boolean(activePolicy)}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setActivePolicy(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activePolicy ? POLICY_DETAILS[activePolicy].title : ''}
              </Text>
              <Pressable onPress={() => setActivePolicy(null)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalBody}>
              {activePolicy ? POLICY_DETAILS[activePolicy].content : ''}
            </Text>

            <Pressable style={styles.modalCloseBtn} onPress={() => setActivePolicy(null)}>
              <Text style={styles.modalCloseText}>Got It</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.inactive,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.secondary,
    lineHeight: 18,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingLeft: 30,
  },
  policyLink: {
    color: colors.textSecondary,
    fontSize: typography.small,
    textDecorationLine: 'underline',
  },
  dotSeparator: {
    color: colors.textTertiary,
    fontSize: typography.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
    flex: 1,
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  modalCloseBtn: {
    minHeight: 44,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  modalCloseText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
