import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ListRenderItem, Text as RNText, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, List as PaperList, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import CategoryChips from '../components/CategoryChips';
import Section from '../components/Section';
import BottomNav from '../components/BottomNav';
import MainLayout from '../components/MainLayout';

interface Podcast {
  id: string;
  title: string;
  author: string;
  description: string;
  image: any;
  episodesCount: number;
}

// Mock data for subscribed podcasts
const subscribedPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'The Design Podcast',
    author: 'Design Weekly',
    description: 'Insights and interviews with design experts',
    image: require('../../assets/podcast-cover.png'),
    episodesCount: 156
  },
  {
    id: '2',
    title: 'Tech Talks',
    author: 'Tech Weekly',
    description: 'Latest in technology and development',
    image: require('../../assets/history.png'),
    episodesCount: 89
  },
  {
    id: '3',
    title: 'Business Insider',
    author: 'Business Weekly',
    description: 'Business trends and insights',
    image: require('../../assets/insights.png'),
    episodesCount: 234
  }
];

const categories = ['All', 'Technology', 'Business', 'Design', 'News'];

type RootStackParamList = {
  PodcastDetail: {
    podcast: Podcast;
  };
};

type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  LibraryTab: undefined;
  ProfileTab: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

export default function Library() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const tabNavigation = useNavigation<TabNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Library');

  const handleTabSelect = (tab: string) => {
    switch (tab) {
      case 'Home':
        tabNavigation.navigate('HomeTab');
        break;
      case 'Search':
        tabNavigation.navigate('SearchTab');
        break;
      case 'Library':
        tabNavigation.navigate('LibraryTab');
        break;
      case 'Profile':
        tabNavigation.navigate('ProfileTab');
        break;
    }
  };

  const renderPodcast: ListRenderItem<Podcast> = ({ item }) => (
    <PaperList.Item
      title={item.title}
      description={`${item.author} • ${item.episodesCount} episodes`}
      left={props => (
        <View style={styles.podcastImageContainer}>
          <Image 
            source={item.image} 
            style={styles.podcastImage}
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        </View>
      )}
      style={{
        backgroundColor: theme.colors.surface,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 8,
      }}
      onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <FlatList
        data={subscribedPodcasts}
        keyExtractor={item => item.id}
        renderItem={renderPodcast}
        ListHeaderComponent={() => (
          <View>
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
              <Searchbar
                placeholder="Search your library"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{
                  backgroundColor: theme.colors.surface,
                  elevation: 0,
                }}
                inputStyle={{ color: theme.colors.onSurface }}
                iconColor={theme.colors.onSurfaceVariant}
              />
            </View>

            <CategoryChips
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <Section title="Your Subscriptions">
              {/* Podcast list will be rendered here */}
            </Section>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ backgroundColor: theme.colors.background }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  podcastImageContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podcastImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  }
}); 