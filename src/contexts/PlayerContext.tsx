import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import TrackPlayer, {
  State,
  Event,
  Capability,
  AppKilledPlaybackBehavior
} from 'react-native-track-player';

export type Track = {
  id: string;
  title: string;
  artist: string;
  artwork: any;
  duration: number;
  url: string;
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlayerVisible: boolean;
  isPlaying: boolean;
  progress: number;
  volume: number;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlayerVisible: (visible: boolean) => void;
  togglePlay: () => void;
  seekTo: (position: number) => void;
  setVolume: (level: number) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  minimizePlayer: () => void;
  playTrack: (track: Track) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

let isPlayerInitialized = false;

// 初始化 TrackPlayer
const setupPlayer = async () => {
  try {
    // 检查播放器是否已经初始化
    const setupResult = await TrackPlayer.getState()
      .then(() => true)
      .catch(() => false);

    if (setupResult) {
      isPlayerInitialized = true;
      return;
    }

    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
    
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      progressUpdateEventInterval: 1,
    });

    isPlayerInitialized = true;
  } catch (error) {
    console.error('Error setting up player:', error);
  }
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  // 初始化播放器
  useEffect(() => {
    setupPlayer();
    return () => {
      if (isPlayerInitialized) {
        TrackPlayer.reset();
      }
    };
  }, []);

  // 监听播放状态变化
  useEffect(() => {
    const listener = TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
      setIsPlaying(event.state === State.Playing);
      // 如果有音频加载，就显示 MiniPlayer
      if (event.state !== State.None && event.state !== State.Stopped) {
        setIsPlayerVisible(true);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  const playTrack = async (track: Track) => {
    try {
      if (!isPlayerInitialized) {
        await setupPlayer();
      }

      // 重置播放器，清除之前的音频
      await TrackPlayer.reset();
      
      // 添加新的音频
      await TrackPlayer.add(track);
      
      // 更新当前播放的音频信息
      setCurrentTrack(track);
      
      // 开始播放
      await TrackPlayer.play();
      
      // 显示播放器
      setIsPlayerVisible(true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const togglePlay = async () => {
    if (!currentTrack) return;
    
    try {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
      setProgress(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  const minimizePlayer = useCallback(() => {
    setIsPlayerVisible(true);
  }, []);

  const value = {
    currentTrack,
    isPlayerVisible,
    isPlaying,
    progress,
    volume,
    setCurrentTrack,
    setIsPlayerVisible,
    togglePlay,
    seekTo,
    setVolume,
    skipToNext,
    skipToPrevious,
    minimizePlayer,
    playTrack
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
} 