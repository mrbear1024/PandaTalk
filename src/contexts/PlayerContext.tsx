import React, { createContext, useContext, useState, useCallback } from 'react';
import TrackPlayer from 'react-native-track-player';

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
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
    // TODO: 实际的音频播放/暂停逻辑
  };

  const seekTo = (position: number) => {
    setProgress(position);
    // TODO: 实际的音频跳转逻辑
  };

  const skipToNext = () => {
    // TODO: 实现下一曲逻辑
    console.log('Skip to next track');
  };

  const skipToPrevious = () => {
    // TODO: 实现上一曲逻辑
    console.log('Skip to previous track');
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
    minimizePlayer
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