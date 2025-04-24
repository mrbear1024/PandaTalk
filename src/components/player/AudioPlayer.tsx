import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TrackPlayer, { useProgress, State, usePlaybackState } from 'react-native-track-player';
import { usePlayer } from '../../contexts/PlayerContext';
import PlayerControls from './PlayerControls';

type AudioPlayerProps = {
  audioUrl: string;
  title: string;
  artist: string;
  artwork: any;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
};

export default function AudioPlayer({
  audioUrl,
  title,
  artist,
  artwork,
  onPlaybackStateChange,
}: AudioPlayerProps) {
  const { currentTrack } = usePlayer();
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const state = playbackState.state;
    const playing = state === State.Playing;
    setIsPlaying(playing);
    onPlaybackStateChange?.(playing);
  }, [playbackState]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSeek = async (value: number) => {
    try {
      await TrackPlayer.seekTo(value);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleSkipForward = async () => {
    try {
      const position = await TrackPlayer.getPosition();
      await TrackPlayer.seekTo(position + 10);
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  };

  const handleSkipBackward = async () => {
    try {
      const position = await TrackPlayer.getPosition();
      await TrackPlayer.seekTo(Math.max(0, position - 10));
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  };

  return (
    <View style={styles.container}>
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onSkipForward={handleSkipForward}
        onSkipBackward={handleSkipBackward}
        progress={progress.position}
        duration={progress.duration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
}); 