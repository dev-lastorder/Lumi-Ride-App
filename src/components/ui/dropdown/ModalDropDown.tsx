import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ModalDropdownProps {
  label: string;
  value: string | null;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const ModalDropdown: React.FC<ModalDropdownProps> = ({
  label,
  value,
  items,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: value ? '#111' : '#888' }}>
          {value ? items.find((i) => i.value === value)?.label : placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalLabel}>{label}</Text>

            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item.label}</Text>
                </Pressable>
              )}
            />

            <Pressable
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '80%',
    padding: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalClose: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#3853A4',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default ModalDropdown;
