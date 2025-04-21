import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePlayer } from '../contexts/PlayerContext';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';

type RootStackParamList = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      image: any;
      audioUrl: string;
    };
  };
};

export const PLAYER_TOOLBAR_HEIGHT = 60;

export default function PlayerToolbar() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentTrack, isPlayerVisible } = usePlayer();
  const playbackState = usePlaybackState();

  if (!currentTrack || !isPlayerVisible) {
    return null;
  }

  const isPlaying = playbackState?.state === State.Playing;

  const handlePress = () => {
    navigation.navigate('Player', {
      podcast: {
        title: currentTrack.title,
        podcast: currentTrack.artist,
        image: currentTrack.artwork,
        audioUrl: currentTrack.url,
      },
    });
  };

  const togglePlayPause = async (event: any) => {
    event.stopPropagation();
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={currentTrack.artwork} 
          style={styles.artwork}
        />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {currentTrack.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {currentTrack.artist}
          </Text>
        </View>
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={24}
          iconColor="#FFFFFF"
          onPress={togglePlayPause}
          style={styles.playButton}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: PLAYER_TOOLBAR_HEIGHT,
    backgroundColor: '#1E1E2D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#9E9E9E',
    fontSize: 12,
  },
  playButton: {
    margin: 0,
  },
}); 