import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { usePlaybackState, State, useProgress } from 'react-native-track-player';
import { usePlayer } from '../contexts/PlayerContext';

export default function MiniPlayer() {
  const theme = useTheme();
  const navigation = useNavigation();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const { currentTrack, isPlayerVisible } = usePlayer();
  const isPlaying = playbackState?.state === State.Playing;

  if (!isPlayerVisible || !currentTrack) {
    return null;
  }

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Player');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={handlePress}
    >
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { 
              backgroundColor: theme.colors.primary,
              width: `${(progress.position / (progress.duration || 1)) * 100}%`
            }
          ]} 
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.trackInfo}>
          <Image 
            source={currentTrack.artwork} 
            style={styles.artwork}
          />
          <View style={styles.textContainer}>
            <Text 
              numberOfLines={1} 
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              {currentTrack.title}
            </Text>
            <Text 
              numberOfLines={1} 
              style={[styles.artist, { color: theme.colors.onSurfaceVariant }]}
            >
              {currentTrack.artist}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            size={24}
            iconColor={theme.colors.primary}
            onPress={togglePlayPause}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progress: {
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 