import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { usePlayer } from '../contexts/PlayerContext';
import TrackPlayer from 'react-native-track-player';

// 导入播放器组件
import {
  PlayerHeader,
  PlayerContent,
  PlayerControls,
  PlaybackSpeedModal,
  PlayerService,
  PLAYBACK_SPEEDS,
  togglePlayPause,
  skipForward,
  skipBackward,
  seekTo,
  changePlaybackSpeed
} from '../components/player';

type PlayerScreenParams = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      description: string;
      image: any;
      audioUrl: string;
      currentTime?: number;
      isPlaying?: boolean;
    };
  };
};

export default function PlayerScreen() {
  const route = useRoute<RouteProp<PlayerScreenParams, 'Player'>>();
  const { podcast } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(podcast.isPlaying ?? false);
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const { setIsPlayerVisible, currentTrack } = usePlayer();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (podcast.currentTime && podcast.currentTime > 0) {
      TrackPlayer.seekTo(podcast.currentTime);
    }
  }, []);

  // 只在页面聚焦时隐藏 MiniPlayer，失去焦点时显示
  useEffect(() => {
    if (isFocused) {
      setIsPlayerVisible(false);
    } else {
      setIsPlayerVisible(true);
    }
  }, [isFocused]);

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
    const duration = await TrackPlayer.getDuration();
    await seekTo(value, duration || 0);
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
          subtitle={podcast.podcast}
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
