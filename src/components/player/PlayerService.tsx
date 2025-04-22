import React, { useEffect } from 'react';
import TrackPlayer, { 
  useTrackPlayerEvents, 
  Event, 
  State,
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

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
  useEffect(() => {
    setupPlayer();

    return () => {
      // 清理工作
    };
  }, []);

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackState) {
      onPlaybackStateChange(event.state === State.Playing);
    }
    if (event.type === Event.PlaybackQueueEnded) {
      await TrackPlayer.seekTo(0);
      onPlaybackStateChange(false);
    }
  });

  const setupPlayer = async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state === undefined) {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
          waitForBuffer: true,
        });
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SeekTo,
            Capability.Skip,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
          progressUpdateEventInterval: 1,
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SeekTo,
          ],
          android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
          }
        });

        TrackPlayer.addEventListener(Event.RemotePlay, () => {
          TrackPlayer.play();
        });

        TrackPlayer.addEventListener(Event.RemotePause, () => {
          TrackPlayer.pause();
        });

        TrackPlayer.addEventListener(Event.RemoteStop, () => {
          TrackPlayer.stop();
        });

        TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
          const position = await TrackPlayer.getPosition();
          await TrackPlayer.seekTo(position);
        });
      }

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: '1',
        url: audioUrl,
        title: title,
        artist: artist,
        artwork: artwork,
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error('Failed to setup player:', error);
    }
  };

  return null; // 这是一个服务组件，不渲染任何UI
} 