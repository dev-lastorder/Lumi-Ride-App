import Button from '@/src/components/ui/Button /index';
import { useTheme } from '@/src/context/ThemeContext';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

interface FareInputModalProps {
  visible: boolean;
  onClose: () => void;
  onOffer: (fare: number) => void;
  passengerOffer?: number;
}

const FareInputModal: React.FC<FareInputModalProps> = ({
  visible,
  onClose,
  onOffer,
  passengerOffer = 150,
}) => {
  const { colors } = useTheme();
  const [fareInput, setFareInput] = useState('');
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight()+ insets.bottom+10;
const { currency } = useSelector((state: RootState) => state.appConfig);

  const handleOffer = () => {
    const fare = parseInt(fareInput);
    if (fare > 0) {
      onOffer(fare);
      setFareInput('');
      onClose();
    }
  };

  return (
    visible ? (
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.keyboardView, { paddingBottom: tabBarHeight }]}
        >
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Offer your fare</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.fareDisplay}>
                <Text style={[styles.currency, { color: colors.textSecondary }]}>{currency?.code}</Text>
                <TextInput
                  style={[styles.fareInput, { color: colors.text, borderBottomColor: colors.border }]}
                  value={fareInput}
                  onChangeText={setFareInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                />
              </View>

              <Text style={[styles.passengerOffer, { color: colors.textSecondary }]}>
                Passenger's offer: {currency?.code} {passengerOffer}
              </Text>

              <Button
                title="Offer"
                onPress={handleOffer}
                variant="primary"
                fullWidth
                disabled={!fareInput}
                style={[styles.offerButton, { backgroundColor: colors.primary }]}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    ) : null
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  fareDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currency: {
    fontSize: 32,
    fontWeight: '300',
    marginRight: 10,
  },
  fareInput: {
    fontSize: 32,
    fontWeight: '300',
    borderBottomWidth: 2,
    minWidth: 100,
    textAlign: 'center',
    paddingBottom: 8,
  },
  passengerOffer: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
  },
  offerButton: {
    marginBottom: 100,
  },
});

export default FareInputModal;