import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScrollControlProps {
  isAtBottom: boolean;
  onScrollToBottom: () => void;
  onScrollToTop: () => void;
}

export default function ScrollControl({ 
  isAtBottom, 
  onScrollToBottom, 
  onScrollToTop 
}: ScrollControlProps) {
  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['bottom']}
    >
      {!isAtBottom ? (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={styles.scrollBottomButton} 
            onPress={onScrollToBottom}
          >
            <Text style={styles.scrollBottomText}>
              Scroll to Bottom
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonWrapperWithBg}>
          <TouchableOpacity 
            style={styles.scrollTopButton} 
            onPress={onScrollToTop}
          >
            <Text style={styles.scrollTopText}>
              Scroll to Top
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  buttonWrapper: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonWrapperWithBg: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  scrollBottomButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#383699',
    width: 240,
  },
  scrollBottomText: {
    color: '#383699',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollTopButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  scrollTopText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});