import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  useTheme,
  Searchbar,
  Chip,
  SegmentedButtons,
  List,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 5;

const trendingSearches = [
  'Business',
  'True Crime',
  'Startups',
  'History',
];

// Mock data for podcasts
const mockPodcasts = [
  {
    id: '1',
    title: 'Tech Talk Daily',
    author: 'John Smith',
    subscribers: '50K',
    image: require('../../assets/podcast-cover.png'),
  },
  {
    id: '2',
    title: 'Startup Stories',
    author: 'Emma Johnson',
    subscribers: '25K',
    image: require('../../assets/daily.png'),
  },
  {
    id: '3',
    title: 'Business Insights',
    author: 'Michael Brown',
    subscribers: '100K',
    image: require('../../assets/insights.png'),
  },
  {
    id: '4',
    title: 'History Unveiled',
    author: 'Sarah Wilson',
    subscribers: '75K',
    image: require('../../assets/history.png'),
  },
];

// Mock data for episodes
const mockEpisodes = [
  {
    id: '1',
    title: 'The Future of AI',
    podcast: 'Tech Talk Daily',
    duration: '45:00',
    date: '2024-03-20',
    image: require('../../assets/podcast-cover.png'),
  },
  {
    id: '2',
    title: 'Building a Million Dollar Company',
    podcast: 'Startup Stories',
    duration: '32:15',
    date: '2024-03-19',
    image: require('../../assets/daily.png'),
  },
  {
    id: '3',
    title: 'Market Analysis 2024',
    podcast: 'Business Insights',
    duration: '28:30',
    date: '2024-03-18',
    image: require('../../assets/insights.png'),
  },
  {
    id: '4',
    title: 'Ancient Civilizations',
    podcast: 'History Unveiled',
    duration: '52:20',
    date: '2024-03-17',
    image: require('../../assets/history.png'),
  },
];

type RootStackParamList = {
  PodcastDetail: {
    podcast: any;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [segment, setSegment] = useState('podcasts');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Load recent searches on mount
  React.useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter(item => item !== query)
      ].slice(0, MAX_RECENT_SEARCHES);
      
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const handleSearch = debounce((text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    const query = text.toLowerCase();
    if (segment === 'podcasts') {
      const results = mockPodcasts.filter(podcast => 
        podcast.title.toLowerCase().includes(query) ||
        podcast.author.toLowerCase().includes(query)
      );
      setSearchResults(results);
    } else {
      const results = mockEpisodes.filter(episode =>
        episode.title.toLowerCase().includes(query) ||
        episode.podcast.toLowerCase().includes(query)
      );
      setSearchResults(results);
    }
  }, 300);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(!!query);
    handleSearch(query);
  };

  const handleCancel = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.searchContainer, { borderBottomColor: theme.colors.surfaceVariant }]}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          inputStyle={{ fontSize: 16, color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onSubmitEditing={() => saveRecentSearch(searchQuery)}
          right={() => (
            <TouchableOpacity onPress={handleCancel}>
              <Text style={[styles.cancelButton, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {!isSearching ? (
        <FlatList
          data={[null]}
          renderItem={() => null}
          ListHeaderComponent={() => (
            <>
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearRecentSearches}>
                      <Text style={[styles.clearButton, { color: theme.colors.primary }]}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((item, index) => (
                    <Pressable
                      key={index}
                      style={[styles.recentItem, { borderBottomColor: theme.colors.surfaceVariant }]}
                      onPress={() => {
                        setSearchQuery(item);
                        setIsSearching(true);
                        handleSearch(item);
                      }}
                    >
                      <Text style={{ color: theme.colors.onSurface }}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Trending Searches
                </Text>
                <View style={styles.tagsContainer}>
                  {trendingSearches.map((tag, index) => (
                    <Chip
                      key={index}
                      mode="outlined"
                      style={[styles.tag, { backgroundColor: theme.colors.surface }]}
                      textStyle={{ color: theme.colors.onSurface }}
                      onPress={() => {
                        setSearchQuery(tag);
                        setIsSearching(true);
                        handleSearch(tag);
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            </>
          )}
          ListEmptyComponent={() => null}
          style={{ backgroundColor: theme.colors.background }}
        />
      ) : (
        <View style={[styles.resultsContainer, { backgroundColor: theme.colors.background }]}>
          <SegmentedButtons
            value={segment}
            onValueChange={(value) => {
              setSegment(value);
              handleSearch(searchQuery);
            }}
            buttons={[
              { value: 'podcasts', label: 'Podcasts' },
              { value: 'episodes', label: 'Episodes' },
            ]}
            style={styles.segmentedControl}
          />
          {segment === 'podcasts' ? (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.title}
                  titleStyle={{ color: theme.colors.onSurface }}
                  description={`${item.author} • ${item.subscribers} subscribers`}
                  descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                  left={props => (
                    <Image 
                      source={item.image}
                      style={styles.resultImage}
                    />
                  )}
                  style={[styles.resultItem, { backgroundColor: theme.colors.surface }]}
                  onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
                />
              )}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.title}
                  titleStyle={{ color: theme.colors.onSurface }}
                  description={`${item.podcast} • ${item.duration}`}
                  descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                  left={props => (
                    <Image 
                      source={item.image}
                      style={styles.resultImage}
                    />
                  )}
                  right={props => (
                    <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>{item.date}</Text>
                  )}
                  style={[styles.resultItem, { backgroundColor: theme.colors.surface }]}
                  onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
                />
              )}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
  },
  cancelButton: {
    marginRight: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  clearButton: {
    fontWeight: '500',
  },
  recentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginBottom: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  segmentedControl: {
    margin: 16,
  },
  resultItem: {
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    alignSelf: 'center',
  },
}); 