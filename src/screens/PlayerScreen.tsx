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
import VideoPlayer, { VideoPlayerRef } from '../components/player/VideoPlayer';

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
  
  const [isPlaying, setIsPlaying] = useState(podcast.isPlaying ?? false);
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
      setIsPlaying(false);
    }
  }, [isVideoPlaying]);

  // 当音频开始播放时，暂停视频
  useEffect(() => {
    console.log('isPlaying changed:', isPlaying);
    if (isPlaying && !isVideoPlaying) {
      console.log('Pausing video');
      setIsVideoPlaying(false);
    }
  }, [isPlaying]);

  const handlePlaybackStateChange = (playing: boolean) => {
    console.log('Audio playback state changed:', playing);
    setIsPlaying(playing);
  };

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

  const handlePlayPause = async () => {
    console.log('Play/Pause pressed, showVideo:', showVideo, 'isVideoPlaying:', isVideoPlaying);
    if (showVideo && podcast.videoUrl) {
      // 如果视频正在播放，则暂停视频
      console.log('Toggling video playback');
      setIsVideoPlaying(!isVideoPlaying);
    } else {
      // 否则，播放/暂停音频
      console.log('Toggling audio playback');
      await togglePlayPause();
    }
  };

  const handleSkipForward = async () => {
    if (showVideo && podcast.videoUrl && videoRef.current) {
      // 视频快进 10 秒
      const newTime = Math.min(videoProgress + 10, videoDuration);
      videoRef.current.seek(newTime);
    } else {
      await skipForward();
    }
  };

  const handleSkipBackward = async () => {
    if (showVideo && podcast.videoUrl && videoRef.current) {
      // 视频快退 10 秒
      const newTime = Math.max(videoProgress - 10, 0);
      videoRef.current.seek(newTime);
    } else {
      await skipBackward();
    }
  };

  const handleSeek = async (value: number) => {
    if (showVideo && podcast.videoUrl && videoRef.current) {
      // 视频跳转到指定位置
      videoRef.current.seek(value);
      // 确保视频继续播放
      if (!isVideoPlaying) {
        setIsVideoPlaying(true);
      }
    } else {
      const duration = await TrackPlayer.getDuration();
      await seekTo(value, duration || 0);
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

  // 获取当前播放进度
  const getCurrentProgress = () => {
    if (showVideo && podcast.videoUrl) {
      return videoProgress;
    } else {
      return currentTrack?.duration ? (currentTrack.duration * 0.5) : 0; // 假设进度为总时长的一半
    }
  };

  // 获取当前总时长
  const getCurrentDuration = () => {
    if (showVideo && podcast.videoUrl) {
      return videoDuration;
    } else {
      return currentTrack?.duration || 0;
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
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSkipForward={handleSkipForward}
            onSkipBackward={handleSkipBackward}
            onSeek={handleSeek}
            progress={getCurrentProgress()}
            duration={getCurrentDuration()}
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
