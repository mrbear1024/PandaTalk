import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme, Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../contexts/PlayerContext';
import type { Track } from '../contexts/PlayerContext';

interface Episode {
  id: string;
  title: string;
  date: string;
  duration: string;
  audioUrl: string;
  
  videoUrl?: string;
  subtitleUrl?: string;
}

interface RouteParams {
  podcast: {
    title: string;
    description: string;
    image: any;
    duration: string;
  };
}

type RootStackParamList = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      description: string;
      duration: string;
      image: any;
      audioUrl: string;
      videoUrl?: string;
      subtitleUrl?: string;
    };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const episodes: Episode[] = [
  {
    id: '10',
    title: 'Episode 10',
    date: 'Mar 25, 2023',
    duration: '45:00',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    // videoUrl: 'https://videos.owlsay.com/principles.mp4',
    subtitleUrl: 'https://subtitles.owlsay.com/principles.vtt'
  },
  {
    id: '9',
    title: 'Episode 9',
    date: 'Mar 17, 2023',
    duration: '42:30',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    // videoUrl: 'https://videos.owlsay.com/principles.mp4',
    subtitleUrl: 'https://subtitles.owlsay.com/principles.vtt'
  },
  {
    id: '8',
    title: 'Episode 8',
    date: 'Mar 10, 2023',
    duration: '38:15',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  },
  {
    id: '7',
    title: 'Episode 7',
    date: 'Mar 3, 2023',
    duration: '41:20',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  },
  {
    id: '6',
    title: 'Episode 6',
    date: 'Feb 24, 2023', 
    duration: '35:45',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  },
  {
    id: '5', 
    title: 'Episode 5',
    date: 'Feb 17, 2023',
    duration: '44:20',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  },
  {
    id: '4',
    title: 'Episode 4', 
    date: 'Feb 10, 2023',
    duration: '39:15',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  },
  {
    id: '3',
    title: 'Episode 3',
    date: 'Feb 3, 2023',
    duration: '42:30',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  },
  {
    id: '2',
    title: 'Episode 2',
    date: 'Jan 27, 2023',
    duration: '37:50',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac',
    videoUrl: 'https://videos.owlsay.com/principles.mp4'
  }
];

export default function PodcastDetail() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { podcast } = route.params as RouteParams;
  const { isPlayerVisible, playTrack } = usePlayer();

  const handlePlayEpisode = async (episode: Episode) => {
    // 创建 Track 对象
    const track: Track = {
      id: episode.id,
      title: episode.title,
      artist: podcast.title,
      artwork: podcast.image,
      duration: parseInt(episode.duration.split(':')[0]) * 60 + parseInt(episode.duration.split(':')[1]),
      url: episode.audioUrl
    };

    // 播放音频
    await playTrack(track);
    
    // 导航到播放器页面
    navigation.navigate('Player', {
      podcast: {
        title: episode.title,
        podcast: podcast.title,
        description: podcast.description,
        duration: episode.duration,
        image: podcast.image,
        audioUrl: episode.audioUrl,
        videoUrl: episode.videoUrl,
        subtitleUrl: episode.subtitleUrl,
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isPlayerVisible ? 120 : 60 }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          {/* @ts-ignore */}
          <Icon name="arrow-left" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Image
            source={podcast.image}
            style={styles.coverImage}
          />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            {podcast.title}
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {podcast.description}
          </Text>
          <Button
            mode="contained"
            style={styles.subscribeButton}
            labelStyle={{ fontSize: 16 }}
            onPress={() => {}}
          >
            SUBSCRIBE
          </Button>
        </View>

        <View style={styles.episodesSection}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Episodes
          </Text>
          {episodes.map((episode) => (
            <TouchableOpacity
              key={episode.id}
              style={[styles.episodeItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => handlePlayEpisode(episode)}
            >
              <View style={styles.episodeContent}>
                {/* @ts-ignore */}
                <Icon name="play-circle" size={32} color={theme.colors.primary} />
                <View style={styles.episodeInfo}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                    {episode.title}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {episode.date}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={[styles.duration, { color: theme.colors.onSurfaceVariant }]}>
                  {episode.duration}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {isPlayerVisible && <MiniPlayer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  coverImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  subscribeButton: {
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  episodesSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  episodeItem: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
  },
  episodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  duration: {
    marginLeft: 16,
  },
}); 