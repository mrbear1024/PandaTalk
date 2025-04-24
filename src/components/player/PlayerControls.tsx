import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

type PlayerControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onSeek: (value: number) => void;
  progress?: number;
  duration?: number;
};

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onSeek,
  progress = 0,
  duration = 0,
}: PlayerControlsProps) {
  const theme = useTheme();
  const [sliderValue, setSliderValue] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  // 当进度或时长变化时更新滑块值
  useEffect(() => {
    if (!isSliding && duration > 0) {
      setSliderValue(progress);
    }
  }, [progress, duration, isSliding]);

  const handleSliderValueChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSliderSlidingStart = () => {
    setIsSliding(true);
  };

  const handleSliderSlidingComplete = (value: number) => {
    setIsSliding(false);
    onSeek(value);
  };

  // 格式化时间为 mm:ss 格式
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration || 100}
        value={sliderValue}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.surfaceVariant}
        thumbTintColor={theme.colors.primary}
        onValueChange={handleSliderValueChange}
        onSlidingStart={handleSliderSlidingStart}
        onSlidingComplete={handleSliderSlidingComplete}
      />
      
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
          {formatTime(sliderValue)}
        </Text>
        <Text style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
          {formatTime(duration)}
        </Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onSkipBackward} style={styles.controlButton}>
          {/* @ts-ignore */}
          <Icon name="rewind-10" size={32} color={theme.colors.onSurface} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
          {/* @ts-ignore */}
          <Icon 
            name={isPlaying ? "pause-circle" : "play-circle"} 
            size={64} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onSkipForward} style={styles.controlButton}>
          {/* @ts-ignore */}
          <Icon name="fast-forward-10" size={32} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    padding: 8,
  },
}); 