import React from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Pressable,
    Platform,
} from 'react-native';

const { height } = Dimensions.get("window");

interface ProfileModalProps {
    visible: boolean;
    onClose: () => void;
    userData: {
        name?: string;
        profile_image?: string;
        averageRating?: string | number;
        noOfReviewsReceived?: string | number;
    } | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
    visible,
    onClose,
    userData,
}) => {
    if (!userData) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>

                    <Image
                        source={{ 
                            uri: userData.profile_image || "https://avatar.iran.liara.run/public/48" 
                        }}
                        style={styles.profileImage}
                    />

                    <Text style={styles.userName}>{userData.name || 'Unknown User'}</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {userData.noOfReviewsReceived || '0'}
                            </Text>
                            <Text style={styles.statLabel}>Rides</Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.starIcon}>⭐</Text>
                                <Text style={styles.statNumber}>
                                    {userData.averageRating || '0'}
                                </Text>
                            </View>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ProfileModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        minHeight: height * 0.3,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 15,
        padding: 8,
    },
    closeIcon: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 15,
        marginTop: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starIcon: {
        fontSize: 20,
    },
});