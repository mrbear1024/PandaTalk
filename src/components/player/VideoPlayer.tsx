import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Platform, Dimensions, TouchableOpacity } from 'react-native';
import Video, { VideoRef, TextTracks, SelectedTrackType, SelectedVideoTrackType, TextTrackType } from 'react-native-video';
import { usePlayer } from '../../contexts/PlayerContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';
import Slider from '@react-native-community/slider';

type VideoPlayerProps = {
  videoUrl: string;
  poster?: string;
  subtitleUrl?: string;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  onProgress?: (data: any) => void;
  onLoad?: (data: any) => void;
};

export type VideoPlayerRef = {
  seek: (time: number) => void;
};

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  videoUrl,
  poster,
  subtitleUrl,
  onPlaybackStateChange,
  onProgress,
  onLoad,
}, ref) => {
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currentTrack } = usePlayer();
  const [bufferProgress, setBufferProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // 预加载配置
  const bufferConfig = {
    minBufferMs: 15000, // 最小缓冲时间（毫秒）
    maxBufferMs: 50000, // 最大缓冲时间（毫秒）
    bufferForPlaybackMs: 2500, // 开始播放所需的最小缓冲时间
    bufferForPlaybackAfterRebufferMs: 5000, // 重新缓冲后开始播放所需的最小缓冲时间
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.seek(time);
        // 确保视频继续播放
        if (!isPlaying) {
          setIsPlaying(true);
          onPlaybackStateChange?.(true);
        }
      }
    }
  }));

  useEffect(() => {
    console.log('VideoPlayer mounted with URL:', videoUrl);
    if (videoRef.current) {
      setIsPlaying(true);
      onPlaybackStateChange?.(true);
    }

    // 监听屏幕方向变化
    Orientation.addOrientationListener((orientation: string) => {
      if (orientation === 'LANDSCAPE') {
        setIsFullscreen(true);
        // 锁定为横屏
        Orientation.lockToLandscape();
      } else if (orientation === 'PORTRAIT') {
        setIsFullscreen(false);
        // 解锁方向
        Orientation.unlockAllOrientations();
      }
    });

    // 监听屏幕尺寸变化
    const dimensionListener = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => {
      // 移除屏幕尺寸监听
      dimensionListener.remove();
      // 恢复默认方向
      Orientation.unlockAllOrientations();
      // 清除定时器
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [videoUrl]);

  const handlePlaybackStateChanged = (state: any) => {
    console.log('Playback state changed:', state);
    const playing = state.isPlaying;
    setIsPlaying(playing);
    onPlaybackStateChange?.(playing);
  };

  const handleLoad = (data: any) => {
    console.log('Video loaded:', data);
    setIsLoading(false);
    if (data.duration) {
      setDuration(data.duration);
    }
    onLoad?.(data);
  };

  const handleError = (error: any) => {
    console.error('Video error:', error);
    let errorMessage = '视频加载错误';
    
    // 处理 WebM 格式特定的错误
    if (videoUrl.toLowerCase().endsWith('.webm')) {
      if (Platform.OS === 'ios') {
        errorMessage = 'iOS 设备可能不支持 WebM 格式，请尝试使用 MP4 格式';
      } else if (error.error?.errorString?.includes('codec')) {
        errorMessage = '设备可能不支持 WebM 编码，请尝试使用 MP4 格式';
      }
    }
    
    setError(`${errorMessage}: ${error.error?.errorString || '未知错误'}`);
    setIsLoading(false);
  };

  const handleProgress = (data: any) => {
    // 可以在这里处理播放进度
    if (!isSliding) {
      setCurrentTime(data.currentTime);
    }
    onProgress?.(data);
  };

  const handleEnd = () => {
    console.log('Video ended');
    setIsPlaying(false);
    onPlaybackStateChange?.(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      // 退出全屏
      Orientation.lockToPortrait();
      setIsFullscreen(false);
    } else {
      // 进入全屏
      Orientation.lockToLandscape();
      setIsFullscreen(true);
    }
  };

  const handleSliderValueChange = (value: number) => {
    setCurrentTime(value);
  };

  const handleSliderSlidingStart = () => {
    setIsSliding(true);
    // 显示控制条
    setShowControls(true);
    // 重置定时器
    resetControlsTimeout();
  };

  const handleSliderSlidingComplete = (value: number) => {
    setIsSliding(false);
    if (videoRef.current) {
      // 先暂停视频
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        setIsPlaying(false);
        onPlaybackStateChange?.(false);
      }
      
      // 设置新的位置
      videoRef.current.seek(value);
      
      // 短暂延迟后恢复播放状态
      setTimeout(() => {
        if (wasPlaying) {
          setIsPlaying(true);
          onPlaybackStateChange?.(true);
        }
      }, 100);
    }
    // 重置定时器
    resetControlsTimeout();
  };

  // 格式化时间为 mm:ss 格式
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 重置控制条隐藏定时器
  const resetControlsTimeout = () => {
    // 清除现有定时器
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // 设置新定时器，5秒后隐藏控制条
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  // 处理视频区域点击
  const handleVideoPress = () => {
    // 切换控制条显示状态
    setShowControls(!showControls);
    
    // 如果显示控制条，则重置定时器
    if (!showControls) {
      resetControlsTimeout();
    }
  };

  const handleBuffer = (data: any) => {
    if (data.isBuffering) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    // 更新缓冲进度
    if (data.bufferProgress) {
      setBufferProgress(data.bufferProgress);
    }
  };

  return (
    <View style={[
      styles.container, 
      isFullscreen && styles.fullscreenContainer
    ]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.videoWrapper}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.videoTouchable}
            onPress={handleVideoPress}
          >
            <Video
              ref={videoRef}
              source={{ 
                uri: videoUrl,
                type: videoUrl.toLowerCase().endsWith('.webm') ? 'webm' : undefined
              }}
              poster={poster}
              posterResizeMode="cover"
              style={[
                styles.video,
                isFullscreen && styles.fullscreenVideo
              ]}
              resizeMode="contain"
              onPlaybackRateChange={() => {}}
              onLoad={handleLoad}
              onProgress={handleProgress}
              onEnd={handleEnd}
              onError={handleError}
              onBuffer={handleBuffer}
              onReadyForDisplay={() => {
                console.log('Video ready for display');
                setIsLoading(false);
              }}
              onPlaybackStateChanged={handlePlaybackStateChanged}
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
              paused={!isPlaying}
              repeat={false}
              bufferConfig={bufferConfig}
              selectedTextTrack={{
                type: 'language' as SelectedTrackType,
                value: 'zh'
              }}
              selectedVideoTrack={{
                type: 'resolution' as SelectedVideoTrackType,
                value: 0
              }}
              textTracks={subtitleUrl ? [
                {
                  title: '中文字幕',
                  language: 'zh',
                  type: 'text/vtt' as TextTrackType,
                  uri: subtitleUrl
                }
              ] : undefined}
            />
          </TouchableOpacity>
          
          {/* 进度条和控制按钮 */}
          {showControls && (
            <View style={styles.controlsOverlay}>
              {/* 进度条 */}
              <View 
                style={styles.progressContainer}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={() => {
                  setIsHovering(true);
                  // 显示控制条
                  setShowControls(true);
                  // 重置定时器
                  resetControlsTimeout();
                }}
                onResponderRelease={() => {
                  setIsHovering(false);
                  resetControlsTimeout();
                }}
              >
                {/* 进度条背景 */}
                <View style={styles.progressBackground} />
                {/* 播放进度条 - 放在底层 */}
                <View 
                  style={[
                    styles.progressBar, 
                    styles.playProgress, 
                    { width: `${(currentTime / (duration || 1)) * 100}%` }
                  ]} 
                />
                {/* 缓冲进度条 - 覆盖在播放进度条上 */}
                <View 
                  style={[
                    styles.progressBar, 
                    styles.bufferProgress, 
                    { width: `${bufferProgress * 100}%` }
                  ]} 
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={currentTime}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor={isHovering ? "#FF0000" : "transparent"}
                  onValueChange={handleSliderValueChange}
                  onSlidingStart={handleSliderSlidingStart}
                  onSlidingComplete={handleSliderSlidingComplete}
                />

                {/* 预览时间 */}
                {isHovering && (
                  <View style={[
                    styles.timePreview, 
                    { 
                      left: `${(currentTime / (duration || 1)) * 100}%`,
                      transform: [{ translateX: -25 }]
                    }
                  ]}>
                    <Text style={styles.timePreviewText}>
                      {formatTime(currentTime)}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* 全屏按钮 */}
              <TouchableOpacity 
                style={styles.fullscreenButton}
                onPress={toggleFullscreen}
              >
                {/* @ts-ignore */}
                <Icon 
                  name={isFullscreen ? "fullscreen-exit" : "fullscreen"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {isLoading && !error && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中... {Math.round(bufferProgress * 100)}%</Text>
        </View>
      )}
    </View>
  );
});

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  videoTouchable: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  controlsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  progressContainer: {
    width: '100%',
    position: 'relative',
    height: 36,
    marginBottom: -10,
  },
  slider: {
    width: '100%',
    height: 36,
    position: 'absolute',
    top: 0,
    zIndex: 3,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    height: 3,
    bottom: 18,
    borderRadius: 1.5,
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    bottom: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
  },
  bufferProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 2,
  },
  playProgress: {
    backgroundColor: '#FF0000', // YouTube 红色
    zIndex: 1,
  },
  timePreview: {
    position: 'absolute',
    bottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 4,
  },
  timePreviewText: {
    color: 'white',
    fontSize: 12,
  },
  fullscreenButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
}); 