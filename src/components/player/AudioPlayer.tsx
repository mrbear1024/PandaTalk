import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TrackPlayer, { usePlaybackState, State, useProgress } from 'react-native-track-player';
import { usePlayer } from '../../contexts/PlayerContext';
import PlayerControls from './PlayerControls';
import { togglePlayPause, skipForward, skipBackward, seekTo } from '../player';

type AudioPlayerProps = {
  audioUrl: string;
  title: string;
  artist: string;
  artwork: any;
  onPlaybackStateChange: (isPlaying: boolean) => void;
};

export default function AudioPlayer({
  audioUrl,
  title,
  artist,
  artwork,
  onPlaybackStateChange,
}: AudioPlayerProps) {
  const { currentTrack } = usePlayer();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const state = playbackState?.state === State.Playing;
    setIsPlaying(state);
    onPlaybackStateChange(state);
  }, [playbackState]);

  const handlePlayPause = async () => {
    await togglePlayPause();
  };

  const handleSkipForward = async () => {
    await skipForward();
  };

  const handleSkipBackward = async () => {
    await skipBackward();
  };

  const handleSeek = async (value: number) => {
    const duration = await TrackPlayer.getDuration();
    await seekTo(value, duration || 0);
  };

  return (
    <View style={styles.container}>
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onSkipForward={handleSkipForward}
        onSkipBackward={handleSkipBackward}
        onSeek={handleSeek}
        progress={progress.position || 0}
        duration={progress.duration || 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
}); 