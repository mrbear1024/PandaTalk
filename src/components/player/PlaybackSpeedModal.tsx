import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

type PlaybackSpeedModalProps = {
  visible: boolean;
  onClose: () => void;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  speedOptions: number[];
};

export default function PlaybackSpeedModal({
  visible,
  onClose,
  currentSpeed,
  onSpeedChange,
  speedOptions,
}: PlaybackSpeedModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
            Playback Speed
          </Text>
          <View style={styles.speedOptions}>
            {speedOptions.map((speedOption) => (
              <TouchableOpacity
                key={speedOption}
                style={[
                  styles.speedOption,
                  currentSpeed === speedOption && styles.selectedSpeed,
                ]}
                onPress={() => onSpeedChange(speedOption)}
              >
                <Text style={[
                  styles.speedOptionText,
                  currentSpeed === speedOption && styles.selectedSpeedText,
                ]}>
                  {speedOption}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            mode="contained"
            onPress={onClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  speedOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedSpeed: {
    backgroundColor: '#4A90E2',
  },
  speedOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedSpeedText: {
    color: '#FFFFFF',
  },
  closeButton: {
    marginTop: 16,
  },
}); 