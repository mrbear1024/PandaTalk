import React, { useEffect } from 'react';
import TrackPlayer, { 
  useTrackPlayerEvents, 
  Event, 
  State,
  Capability,
  AppKilledPlaybackBehavior,
  Track,
} from 'react-native-track-player';
import { usePlayer } from '../../contexts/PlayerContext';

type PlayerServiceProps = {
  audioUrl: string;
  title: string;
  artist: string;
  artwork: any;
  onPlaybackStateChange: (isPlaying: boolean) => void;
};

// 预加载配置
const preloadConfig = {
  bufferConfig: {
    minBufferMs: 15000, // 最小缓冲时间（毫秒）
    maxBufferMs: 50000, // 最大缓冲时间（毫秒）
    bufferForPlaybackMs: 2500, // 开始播放所需的最小缓冲时间
    bufferForPlaybackAfterRebufferMs: 5000, // 重新缓冲后开始播放所需的最小缓冲时间
  },
};

export default function PlayerService({
  audioUrl,
  title,
  artist,
  artwork,
  onPlaybackStateChange,
}: PlayerServiceProps) {
  const { currentTrack } = usePlayer();

  // 初始化 TrackPlayer
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        // 检查播放器是否已经初始化
        const state = await TrackPlayer.getState();
        if (state !== State.None) {
          console.log('Player already initialized.');
          return;
        }

        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
          waitForBuffer: true,
          ...preloadConfig.bufferConfig,
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
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
        });
      } catch (error) {
        // 仅当错误不是 "already initialized" 时才记录
        if (!String(error).includes('already been initialized')) {
          console.error('Failed to setup player:', error);
        }
      }
    };

    setupPlayer();
  }, []);

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

        // 预加载下一个音频
        const track: Track = {
          id: audioUrl,
          url: audioUrl,
          title: title,
          artist: artist,
          artwork: artwork,
        };

        await TrackPlayer.add(track);
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