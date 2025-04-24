// 导出组件
export { default as PlayerHeader } from './PlayerHeader';
export { default as PlayerContent } from './PlayerContent';
export { default as PlayerControls } from './PlayerControls';
export { default as PlayerService } from './PlayerService';
export { default as PlaybackSpeedModal } from './PlaybackSpeedModal';
export { default as AudioPlayer } from './AudioPlayer';
export { default as VideoPlayer } from './VideoPlayer';

// 导出操作函数
export * from './PlayerActions';

// 导出常量和类型
export * from './PlayerConstants';
export * from './PlayerTypes';

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

import TrackPlayer, { State } from 'react-native-track-player';

export const togglePlayPause = async () => {
  const state = await TrackPlayer.getState();
  if (state === State.Playing) {
    await TrackPlayer.pause();
  } else {
    await TrackPlayer.play();
  }
};

export const skipForward = async () => {
  await TrackPlayer.skipToNext();
};

export const skipBackward = async () => {
  await TrackPlayer.skipToPrevious();
};

export const seekTo = async (position: number, duration: number) => {
  await TrackPlayer.seekTo(position);
};

export const changePlaybackSpeed = async (speed: number) => {
  try {
    await TrackPlayer.setRate(speed);
    return true;
  } catch (error) {
    console.error('Error changing playback speed:', error);
    return false;
  }
}; 