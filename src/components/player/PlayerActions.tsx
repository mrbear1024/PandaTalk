import TrackPlayer, { State } from 'react-native-track-player';

export const togglePlayPause = async () => {
  const state = await TrackPlayer.getState();
  if (state === State.Playing) {
    await TrackPlayer.pause();
  } else {
    await TrackPlayer.play();
  }
};

export const skipForward = async (seconds: number = 15) => {
  const position = await TrackPlayer.getPosition();
  await TrackPlayer.seekTo(position + seconds);
};

export const skipBackward = async (seconds: number = 15) => {
  const position = await TrackPlayer.getPosition();
  await TrackPlayer.seekTo(position - seconds);
};

export const seekTo = async (value: number, duration: number) => {
  await TrackPlayer.seekTo(value * duration);
};

export const changePlaybackSpeed = async (newSpeed: number) => {
  try {
    await TrackPlayer.setRate(newSpeed);
    return true;
  } catch (error) {
    console.log('Error changing playback speed:', error);
    return false;
  }
}; 