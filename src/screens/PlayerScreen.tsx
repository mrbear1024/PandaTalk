import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { usePlayer } from '../contexts/PlayerContext';
import TrackPlayer from 'react-native-track-player';
import Video, { VideoRef } from 'react-native-video';

// 导入播放器组件
import {
  PlayerHeader,
  PlayerContent,
  PlaybackSpeedModal,
  PlayerService,
  PLAYBACK_SPEEDS,
  changePlaybackSpeed
} from '../components/player';
import VideoPlayer, { VideoPlayerRef } from '../components/player/VideoPlayer';
import AudioPlayer from '../components/player/AudioPlayer';

type PlayerScreenParams = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      description: string;
      image: any;
      audioUrl: string;
      videoUrl?: string;
      subtitleUrl?: string;
      currentTime?: number;
      isPlaying?: boolean;
    };
  };
};

export default function PlayerScreen() {
  const route = useRoute<RouteProp<PlayerScreenParams, 'Player'>>();
  const { podcast } = route.params;
  
  console.log('PlayerScreen mounted with podcast:', podcast);
  
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showVideo, setShowVideo] = useState(!!podcast.videoUrl);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<VideoPlayerRef>(null);
  const { setIsPlayerVisible, currentTrack } = usePlayer();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('PlayerScreen useEffect - podcast.videoUrl:', podcast.videoUrl);
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

  // 当视频开始播放时，暂停音频
  useEffect(() => {
    console.log('isVideoPlaying changed:', isVideoPlaying);
    if (isVideoPlaying) {
      console.log('Pausing audio track');
      TrackPlayer.pause();
    }
  }, [isVideoPlaying]);

  const handleVideoPlaybackStateChange = (playing: boolean) => {
    console.log('Video playback state changed:', playing);
    setIsVideoPlaying(playing);
  };

  const handleVideoProgress = (data: any) => {
    if (data.currentTime && data.seekableDuration) {
      setVideoProgress(data.currentTime);
      setVideoDuration(data.seekableDuration);
    }
  };

  const handleVideoLoad = (data: any) => {
    if (data.duration) {
      setVideoDuration(data.duration);
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    const success = await changePlaybackSpeed(newSpeed);
    if (success) {
      setSpeed(newSpeed);
      setShowSpeedModal(false);
    }
  };

  const toggleVideoDisplay = () => {
    setShowVideo(!showVideo);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#1E1E2D' }]} edges={['top']}>
      <PlayerService
        audioUrl={podcast.audioUrl}
        title={podcast.title}
        artist={podcast.podcast}
        artwork={podcast.image}
        onPlaybackStateChange={() => {}}
      />
      
      <ScrollView style={styles.scrollView}>
        <PlayerHeader podcastTitle={podcast.podcast} />
        
        {podcast.videoUrl && showVideo ? (
          <VideoPlayer
            videoUrl={podcast.videoUrl}
            poster={podcast.image}
            subtitleUrl={podcast.subtitleUrl}
            onPlaybackStateChange={handleVideoPlaybackStateChange}
            onProgress={handleVideoProgress}
            onLoad={handleVideoLoad}
            ref={videoRef}
          />
        ) : null}
        
        <PlayerContent
          image={podcast.image}
          title={podcast.title}
          subtitle={podcast.podcast}
          description={podcast.description}
        />
        
        {!showVideo && (
          <AudioPlayer
            audioUrl={podcast.audioUrl}
            title={podcast.title}
            artist={podcast.podcast}
            artwork={podcast.image}
            onPlaybackStateChange={() => {}}
          />
        )}
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
