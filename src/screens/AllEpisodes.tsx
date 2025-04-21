import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Episode {
  id: string;
  title: string;
  podcast: string;
  description: string;
  duration: string;
  icon: string;
  image: any;
}

interface RouteParams {
  title: string;
  episodes: Episode[];
}

type RootStackParamList = {
  PodcastDetail: {
    podcast: Episode;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AllEpisodes() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { title, episodes } = route.params as RouteParams;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {title}
        </Text>
      </View>

      <FlatList
        data={episodes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.episodeItem, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
          >
            <Image source={item.image} style={styles.episodeImage} />
            <View style={styles.episodeInfo}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.podcast}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.duration}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  episodeItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  episodeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
}); 