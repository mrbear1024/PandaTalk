import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useProgress } from 'react-native-track-player';

type PlayerControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onSeek: (value: number) => void;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onSeek,
}: PlayerControlsProps) {
  const progress = useProgress();

  return (
    <View style={styles.controls}>
      <Slider
        value={progress.position / (progress.duration || 1)}
        onValueChange={onSeek}
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#4A90E2"
        maximumTrackTintColor="#4A4A4A"
        thumbTintColor="#4A90E2"
      />
      
      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
        <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.skipButton} onPress={onSkipBackward}>
          <Text style={styles.skipButtonText}>15</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            size={32}
            iconColor="#1E1E2D"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={onSkipForward}>
          <Text style={styles.skipButtonText}>30</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -16,
    marginBottom: 24,
  },
  timeText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 