import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { DeliveryAddress } from '../types/order';

type DeliveryAddressCardProps = {
  address: DeliveryAddress | null;
  onUpdateAddress: (address: DeliveryAddress) => void;
};

type FormErrors = Partial<Record<keyof DeliveryAddress, string>>;

export function DeliveryAddressCard({ address, onUpdateAddress }: DeliveryAddressCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<DeliveryAddress>(
    address ?? {
      fullName: '',
      mobileNumber: '',
      addressLine: '',
      city: '',
      state: '',
      pinCode: '',
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const handleOpenModal = () => {
    if (address) {
      setForm(address);
    }
    setErrors({});
    setModalVisible(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid name';
    }

    const cleanMobile = form.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!form.addressLine.trim()) {
      newErrors.addressLine = 'Address line is required';
    } else if (form.addressLine.trim().length < 5) {
      newErrors.addressLine = 'Please enter complete address details';
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required';
    }

    const cleanPin = form.pinCode.replace(/\D/g, '');
    if (!cleanPin) {
      newErrors.pinCode = 'PIN code is required';
    } else if (cleanPin.length !== 6) {
      newErrors.pinCode = 'Enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onUpdateAddress(form);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.title}>Delivery Address</Text>
        </View>

        <Pressable
          onPress={handleOpenModal}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={address ? 'Change address' : 'Add delivery address'}
        >
          <Text style={styles.actionLink}>{address ? 'Change' : 'Add Address'}</Text>
        </Pressable>
      </View>

      {address ? (
        <View style={styles.contentWrap}>
          <View style={styles.recipientRow}>
            <Text style={styles.recipientName}>{address.fullName}</Text>
            <View style={styles.phoneBadge}>
              <Text style={styles.recipientPhone}>+91 {address.mobileNumber}</Text>
            </View>
          </View>

          <Text style={styles.addressLine}>{address.addressLine}</Text>
          <Text style={styles.cityStatePin}>
            {address.city}, {address.state} - {address.pinCode}
          </Text>
        </View>
      ) : (
        <Pressable style={styles.emptyPrompt} onPress={handleOpenModal}>
          <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
          <Text style={styles.emptyPromptText}>Add a delivery address to proceed</Text>
        </Pressable>
      )}

      {/* Address Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {address ? 'Edit Delivery Address' : 'Add Delivery Address'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Form Fields */}
            <View style={styles.formWrap}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  value={form.fullName}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, fullName: val }))}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, errors.fullName && styles.inputError]}
                />
                {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <TextInput
                  value={form.mobileNumber}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, mobileNumber: val }))}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={[styles.input, errors.mobileNumber && styles.inputError]}
                />
                {errors.mobileNumber ? (
                  <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address Line</Text>
                <TextInput
                  value={form.addressLine}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, addressLine: val }))}
                  placeholder="Flat, building, street, area"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, errors.addressLine && styles.inputError]}
                />
                {errors.addressLine ? (
                  <Text style={styles.errorText}>{errors.addressLine}</Text>
                ) : null}
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    value={form.city}
                    onChangeText={(val) => setForm((prev) => ({ ...prev, city: val }))}
                    placeholder="City"
                    placeholderTextColor={colors.textTertiary}
                    style={[styles.input, errors.city && styles.inputError]}
                  />
                  {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>PIN Code</Text>
                  <TextInput
                    value={form.pinCode}
                    onChangeText={(val) => setForm((prev) => ({ ...prev, pinCode: val }))}
                    placeholder="6 digits"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={[styles.input, errors.pinCode && styles.inputError]}
                  />
                  {errors.pinCode ? <Text style={styles.errorText}>{errors.pinCode}</Text> : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  value={form.state}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, state: val }))}
                  placeholder="State"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, errors.state && styles.inputError]}
                />
                {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
              </View>
            </View>

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Address</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  actionLink: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  contentWrap: {
    gap: 3,
    marginTop: spacing.xs,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  recipientName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  phoneBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  recipientPhone: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  addressLine: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  cityStatePin: {
    color: colors.textSecondary,
    fontSize: typography.secondary,
    fontWeight: '600',
  },
  emptyPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    marginTop: spacing.xs,
  },
  emptyPromptText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: typography.sectionTitle,
    fontWeight: '800',
  },
  formWrap: {
    gap: spacing.sm,
  },
  inputGroup: {
    gap: 3,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    minHeight: 44,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '600',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
