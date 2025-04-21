import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, IconButton, useTheme, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { 
  useTrackPlayerEvents, 
  Event, 
  State,
  usePlaybackState,
  Capability,
  AppKilledPlaybackBehavior,
  useProgress
} from 'react-native-track-player';
import { usePlayer } from '../contexts/PlayerContext';

type PlayerScreenParams = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      description: string;
      duration: string;
      image: any;
      audioUrl: string;
    };
  };
};

const { width } = Dimensions.get('window');

const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const mockTrack = {
  id: '1',
  title: 'Episode 10',
  artist: 'Design Matters',
  artwork: require('../../assets/podcast-cover.png'),
  duration: 258, // 4:18 in seconds
  url: 'https://example.com/episode10.mp3'
};

export default function PlayerScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<PlayerScreenParams, 'Player'>>();
  const { podcast } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const { setCurrentTrack, setIsPlayerVisible, currentTrack, minimizePlayer } = usePlayer();
  const isFocused = useIsFocused();

  useEffect(() => {
    setupPlayer();
    setCurrentTrack(mockTrack);
    setIsPlayerVisible(false);

    return () => {
      if (isPlaying) {
        setIsPlayerVisible(true);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFocused && currentTrack) {
      setIsPlayerVisible(true);
    } else if (isFocused) {
      setIsPlayerVisible(false);
    }
  }, [isFocused, currentTrack]);

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
        url: podcast.audioUrl,
        title: podcast.title,
        artist: podcast.podcast,
        artwork: podcast.image,
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error('Failed to setup player:', error);
    }
  };

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackState) {
      setIsPlaying(event.state === State.Playing);
    }
    if (event.type === Event.PlaybackQueueEnded) {
      await TrackPlayer.seekTo(0);
      setIsPlaying(false);
    }
  });

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipForward = async () => {
    await TrackPlayer.seekTo(progress.position + 15);
  };

  const skipBackward = async () => {
    await TrackPlayer.seekTo(progress.position - 15);
  };

  const onSeek = async (value: number) => {
    await TrackPlayer.seekTo(value * progress.duration);
  };

  const changePlaybackSpeed = async (newSpeed: number) => {
    try {
      await TrackPlayer.setRate(newSpeed);
      setSpeed(newSpeed);
      setShowSpeedModal(false);
    } catch (error) {
      console.log('Error changing playback speed:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#1E1E2D' }]} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <IconButton
            icon="chevron-down"
            size={24}
            iconColor="#FFFFFF"
            onPress={() => navigation.goBack()}
          />
          <Text variant="titleMedium" style={styles.headerTitle}>
            {podcast.podcast}
          </Text>
          <IconButton
            icon="dots-vertical"
            size={24}
            iconColor="#FFFFFF"
            onPress={() => {}}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image 
              source={podcast.image} 
              style={styles.coverArt}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.info}>
            <Text variant="headlineMedium" style={styles.title}>
              {podcast.title}
            </Text>
            <Text variant="titleMedium" style={styles.subtitle}>
              DESIGN MATTERS
            </Text>
          </View>

          <View style={styles.controls}>
            <Slider
              value={progress.position / (progress.duration || 1)}
              onValueChange={onSeek}
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#4A90E2"
              maximumTrackTintColor="#4A4A4A"
              thumbTintColor="#4A90E2"
            />
            
            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
              <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.skipButton} onPress={skipBackward}>
                <Text style={styles.skipButtonText}>15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                <IconButton
                  icon={isPlaying ? 'pause' : 'play'}
                  size={32}
                  iconColor="#1E1E2D"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipButton} onPress={skipForward}>
                <Text style={styles.skipButtonText}>30</Text>
              </TouchableOpacity>
            </View>

            {/* 
            hidden speed button
            <TouchableOpacity 
              style={styles.speedButton} 
              onPress={() => setShowSpeedModal(true)}
            >
              <Text style={styles.speedButtonText}>{speed}x</Text>
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>SUBSCRIBE</Text>
          </TouchableOpacity>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {podcast.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showSpeedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSpeedModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Playback Speed
            </Text>
            <View style={styles.speedOptions}>
              {PLAYBACK_SPEEDS.map((speedOption) => (
                <TouchableOpacity
                  key={speedOption}
                  style={[
                    styles.speedOption,
                    speed === speedOption && styles.selectedSpeed,
                  ]}
                  onPress={() => changePlaybackSpeed(speedOption)}
                >
                  <Text style={[
                    styles.speedOptionText,
                    speed === speedOption && styles.selectedSpeedText,
                  ]}>
                    {speedOption}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              mode="contained"
              onPress={() => setShowSpeedModal(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width - 200,
    height: width - 200,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverArt: {
    width: '100%',
    height: '100%',
  },
  info: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9E9E9E',
    textAlign: 'center',
    letterSpacing: 2,
    fontSize: 16,
  },
  controls: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -16,
    marginBottom: 24,
  },
  timeText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  subscribeButton: {
    width: '60%',
    paddingVertical: 16,
    marginTop: 40,
    marginBottom: 32,
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 30,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  descriptionText: {
    color: '#9E9E9E',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  scrollView: {
    flex: 1,
  },
  speedButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 16,
  },
  speedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  speedOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedSpeed: {
    backgroundColor: '#4A90E2',
  },
  speedOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedSpeedText: {
    color: '#FFFFFF',
  },
  closeButton: {
    marginTop: 16,
  },
}); 
