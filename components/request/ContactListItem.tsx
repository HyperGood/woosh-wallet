import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, Pressable, TextInput, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/global-styles';

type ContactListItemProps = {
  name: string;
  phoneNumber: string;
  onDelete?: () => void;
  onEdit?: () => void;
  editableAmount?: boolean;
  amount?: string;
  onAmountChange?: (amount: string) => void;
};

const ContactListItem: React.FC<ContactListItemProps> = ({
  name,
  phoneNumber,
  onDelete,
  onEdit,
  editableAmount,
  amount,
  onAmountChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View style={styles.contact}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Image
          source={require('../../assets/images/profile.png')}
          style={{ width: 40, height: 40, borderRadius: 100 }}
        />
        <View>
          <Text style={styles.contactName}>{name}</Text>
          <Text style={styles.contactNumber}>{phoneNumber}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {editableAmount ? (
          isEditing ? (
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={onAmountChange}
              keyboardType="numeric"
              onEndEditing={() => setIsEditing(false)}
            />
          ) : (
            <Text style={styles.amountText} onPress={() => setIsEditing(true)}>
              {amount}
            </Text>
          )
        ) : (
          <Pressable style={styles.contactIcon} onPress={onDelete}>
            <Feather name="trash-2" size={16} color={COLORS.light} />
          </Pressable>
        )}
        {onEdit && (
          <Pressable style={styles.contactIcon} onPress={onEdit}>
            <Feather name="edit-3" size={16} color={COLORS.light} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({
  contact: {
    gap: 10,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 24,
  },
  contactName: {
    color: COLORS.light,
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
  contactNumber: {
    color: COLORS.light,
    fontSize: 14,
    opacity: 0.4,
  },
  contactIcon: {
    backgroundColor: COLORS.gray[600],
    padding: 8,
    borderRadius: 100,
  },
  amountInput: {
    backgroundColor: COLORS.light,
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: COLORS.dark,
  },
  amountText: {
    color: COLORS.primary[400],
    fontSize: 16,
  },
});
