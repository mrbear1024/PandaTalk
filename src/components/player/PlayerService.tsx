import React, { useEffect } from 'react';
import TrackPlayer, { 
  useTrackPlayerEvents, 
  Event, 
  State,
} from 'react-native-track-player';
import { usePlayer } from '../../contexts/PlayerContext';

type PlayerServiceProps = {
  audioUrl: string;
  title: string;
  artist: string;
  artwork: any;
  onPlaybackStateChange: (isPlaying: boolean) => void;
};

export default function PlayerService({
  audioUrl,
  title,
  artist,
  artwork,
  onPlaybackStateChange,
}: PlayerServiceProps) {
  const { currentTrack } = usePlayer();

  // 只在当前音频 URL 与正在播放的音频 URL 不同时才设置新的音频
  useEffect(() => {
    const setupTrack = async () => {
      try {
        // 检查当前是否有音频在播放，且 URL 相同
        if (currentTrack && currentTrack.url === audioUrl) {
          // 如果是同一个音频，不需要重新设置
          const state = await TrackPlayer.getState();
          onPlaybackStateChange(state === State.Playing);
          return;
        }
      } catch (error) {
        console.error('Failed to setup track:', error);
      }
    };

    setupTrack();
  }, [audioUrl, title, artist, artwork]);

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackState) {
      onPlaybackStateChange(event.state === State.Playing);
    }
    if (event.type === Event.PlaybackQueueEnded) {
      await TrackPlayer.seekTo(0);
      onPlaybackStateChange(false);
    }
  });

  return null; // 这是一个服务组件，不渲染任何UI
} 