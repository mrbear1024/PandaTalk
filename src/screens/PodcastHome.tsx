// src/screens/PodcastHome.tsx
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  Text as RNText,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  Searchbar,
  useTheme,
  List as PaperList,
} from 'react-native-paper';
import { Asset } from 'expo-asset';

import CategoryChips from '../components/CategoryChips';
import FeaturedList from '../components/FeaturedList';
import Section from '../components/Section';
import BottomNav from '../components/BottomNav';

interface Episode {
  id: string;
  title: string;
  podcast: string;
  description: string;
  duration: string;
  icon: string;
  image: any;
}

const categories = ['All', 'Technology', 'Comedy', 'News', 'Business'];
const featuredPodcasts = [
  { 
    id: '1', 
    title: 'The Design Podcast', 
    podcast: "Design Weekly",
    description: 'Insights and interviews with design experts',
    duration: '45:00',
    icon: 'play-circle',
    image: require('../../assets/podcast-cover.png')
  },
  { 
    id: '2', 
    title: 'The Joe Rogan Experience', 
    podcast: "JRE",
    description: 'Long-form conversation with interesting people',
    duration: '180:00',
    icon: 'play-circle',
    image: require('../../assets/daily.png')
  },
  { 
    id: '3', 
    title: 'Stuff You Should Know', 
    podcast: "iHeartRadio",
    description: 'Educational podcast about everything',
    duration: '45:00',
    icon: 'play-circle',
    image: require('../../assets/insights.png')
  },
  { 
    id: '4', 
    title: 'Tech Talks', 
    podcast: "Tech Weekly",
    description: 'Latest in technology and development',
    duration: '60:00',
    icon: 'play-circle',
    image: require('../../assets/history.png')
  },
];
const trendingEpisodes: Episode[] = [
  { 
    id: '1', 
    title: 'The Daily', 
    podcast: "Essgay's top late",
    description: 'Audio and Richda/raplics',
    duration: '24:08', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '2', 
    title: 'The Joe Rogan Experience', 
    podcast: "Essgay's top later",
    description: 'Random auspdt authors',
    duration: '30:12', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '3', 
    title: 'Stuff You Should Know', 
    podcast: "Essgay's top later",
    description: 'Tech Talks',
    duration: '28:45', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '4', 
    title: 'Tech Talks', 
    podcast: "Essgay's top later",
    description: 'Tech discussions and news',
    duration: '28:45', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '5', 
    title: 'The Daily Tech', 
    podcast: "Tech Daily",
    description: 'Latest tech news and analysis',
    duration: '32:15', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '6', 
    title: 'Business Insider', 
    podcast: "Business Weekly",
    description: 'Business trends and insights',
    duration: '41:30', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '7', 
    title: 'Science Friday', 
    podcast: "NPR",
    description: 'Science news and discoveries',
    duration: '52:20', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '8', 
    title: 'Planet Money', 
    podcast: "NPR",
    description: 'Economics made simple',
    duration: '26:45', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '9', 
    title: 'TED Radio Hour', 
    podcast: "NPR",
    description: 'Ideas worth spreading',
    duration: '48:10', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  },
  { 
    id: '10', 
    title: 'Freakonomics Radio', 
    podcast: "Freakonomics",
    description: 'Exploring hidden economics',
    duration: '38:25', 
    icon: 'play-circle',
    image: require('../../assets/sysk.png')
  }
];

type RootStackParamList = {
  AllEpisodes: {
    title: string;
    episodes: Episode[];
  };
  PodcastDetail: {
    podcast: Episode;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PodcastHome() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Home');

  const renderEpisode: ListRenderItem<Episode> = ({ item }) => (
    <PaperList.Item
      title={item.title}
      description={item.podcast}
      left={props => (
        <View style={styles.episodeImageContainer}>
          <Image 
            source={item.image} 
            style={styles.episodeImage}
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        </View>
      )}
      right={() => (
        <RNText style={{ color: theme.colors.onSurface, marginRight: 16, fontSize: 16 }}>
          {item.duration}
        </RNText>
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
    <>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top','bottom']}>
        {/* 顶部 Appbar，不需要额外 SafeArea */}
        {/* <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
          <Appbar.BackAction color={theme.colors.onSurface} onPress={() => {}} />
          <Appbar.Content title="" />
          <Appbar.Action icon="dots-vertical" color={theme.colors.onSurface} onPress={() => {}} />
        </Appbar.Header> */}

        {/* 整页滚动使用 FlatList */}
        <FlatList
          data={trendingEpisodes}
          keyExtractor={item => item.id}
          renderItem={renderEpisode}
          ListHeaderComponent={() => (
            <View>
              <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <Searchbar
                  placeholder="Search"
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

              <Section title="Featured Podcasts">
                <FeaturedList 
                  items={featuredPodcasts} 
                  onPress={(item) => navigation.navigate('PodcastDetail', { podcast: item })}
                />
              </Section>

              <Section
                title="Trending Episodes"
                onPress={() => {
                  navigation.navigate('AllEpisodes', {
                    title: 'Trending Episodes',
                    episodes: trendingEpisodes
                  });
                }}
              >
               
              </Section>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ backgroundColor: theme.colors.background }}
        />

        {/* 底部导航 */}
        <BottomNav selected={activeTab} onSelect={setActiveTab} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  episodeImageContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0', // 添加背景色以便于查看图片加载状态
  }
});