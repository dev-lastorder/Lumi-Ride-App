import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { height } = Dimensions.get("window");

interface RideScheduledModalProps {
    visible: boolean;
    onClose: () => void;
    onViewScheduledRides: () => void;
}

const RideScheduledModal: React.FC<RideScheduledModalProps> = ({
    visible,
    onClose,
    onViewScheduledRides,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.title}>Ride Scheduled!</Text>

                    <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmarkOuter}>
                            <View style={styles.checkmarkInner}>
                                <Ionicons name="checkmark" size={40} color="#fff" />
                            </View>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>See all scheduled rides</Text>

                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={onViewScheduledRides}
                    >
                        <Text style={styles.buttonText}>Scheduled Rides</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default RideScheduledModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        width: '85%',
        maxWidth: 350,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
    },
    checkmarkContainer: {
        marginBottom: 40,
    },
    checkmarkOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#22c55e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4f46e5',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});