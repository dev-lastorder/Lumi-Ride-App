import React from "react";
import { Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ReviewSubmittedModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../../../assets/images/check.png')} // replace with your image path
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Review Submitted!</Text>
                    <Text style={styles.message}>
                        Thank you for sharing your feedback. Your review has been successfully submitted.
                    </Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default ReviewSubmittedModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        width: "80%",
        alignItems: "center",
    },
    iconContainer: {
        marginBottom: 10,


        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 14,
        color: "#71717A", // gray-500
        textAlign: "center",
        marginBottom: 24,
    },
    closeButton: {
        backgroundColor: "#1E2B66",
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "600",
        textAlign: "center",
    },
});
