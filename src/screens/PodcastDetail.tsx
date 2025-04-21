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

interface Episode {
  id: string;
  title: string;
  date: string;
  duration: string;
  audioUrl: string;
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
    audioUrl: 'https://audio.owlsay.com/jayflac.flac'
  },
  {
    id: '9',
    title: 'Episode 9',
    date: 'Mar 17, 2023',
    duration: '42:30',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac'
  },
  {
    id: '8',
    title: 'Episode 8',
    date: 'Mar 10, 2023',
    duration: '38:15',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac'
  },
  {
    id: '7',
    title: 'Episode 7',
    date: 'Mar 3, 2023',
    duration: '41:20',
    audioUrl: 'https://audio.owlsay.com/jayflac.flac'
  },
];

export default function PodcastDetail() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { podcast } = route.params as RouteParams;
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
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
            onPress={() => navigation.navigate('Player', { 
              podcast: {
                ...episode,
                podcast: podcast.title,
                description: `Episode ${episode.title}`,
                image: podcast.image,
                audioUrl: episode.audioUrl
              }
            })}
          >
            <View style={styles.episodeContent}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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