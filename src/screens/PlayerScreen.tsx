import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { usePlayer } from '../contexts/PlayerContext';

// 导入播放器组件
import {
  PlayerHeader,
  PlayerContent,
  PlayerControls,
  PlaybackSpeedModal,
  PlayerService,
  PLAYBACK_SPEEDS,
  mockTrack,
  PlayerScreenParams,
  togglePlayPause,
  skipForward,
  skipBackward,
  seekTo,
  changePlaybackSpeed
} from '../components/player';

export default function PlayerScreen() {
  const route = useRoute<RouteProp<PlayerScreenParams, 'Player'>>();
  const { podcast } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const { setCurrentTrack, setIsPlayerVisible, currentTrack } = usePlayer();
  const isFocused = useIsFocused();

  useEffect(() => {
    setCurrentTrack(mockTrack);
    setIsPlayerVisible(false);

    return () => {
      if (isPlaying) {
        setIsPlayerVisible(true);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFocused && currentTrack) {
      setIsPlayerVisible(true);
    } else if (isFocused) {
      setIsPlayerVisible(false);
    }
  }, [isFocused, currentTrack]);

  const handlePlaybackStateChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

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
    await seekTo(value, podcast.duration ? parseInt(podcast.duration) : 0);
  };

  const handleSpeedChange = async (newSpeed: number) => {
    const success = await changePlaybackSpeed(newSpeed);
    if (success) {
      setSpeed(newSpeed);
      setShowSpeedModal(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#1E1E2D' }]} edges={['top']}>
      <PlayerService
        audioUrl={podcast.audioUrl}
        title={podcast.title}
        artist={podcast.podcast}
        artwork={podcast.image}
        onPlaybackStateChange={handlePlaybackStateChange}
      />
      
      <ScrollView style={styles.scrollView}>
        <PlayerHeader podcastTitle={podcast.podcast} />
        
        <PlayerContent
          image={podcast.image}
          title={podcast.title}
          subtitle="DESIGN MATTERS"
          description={podcast.description}
        />
        
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSkipForward={handleSkipForward}
          onSkipBackward={handleSkipBackward}
          onSeek={handleSeek}
        />
      </ScrollView>

      <PlaybackSpeedModal
        visible={showSpeedModal}
        onClose={() => setShowSpeedModal(false)}
        currentSpeed={speed}
        onSpeedChange={handleSpeedChange}
        speedOptions={PLAYBACK_SPEEDS}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}); 
