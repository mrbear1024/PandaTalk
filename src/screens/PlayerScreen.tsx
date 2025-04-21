import React, { useState } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

type PlayerScreenParams = {
  Player: {
    podcast: {
      title: string;
      podcast: string;
      description: string;
      duration: string;
      image: any;
    };
  };
};

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<PlayerScreenParams, 'Player'>>();
  const { podcast } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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
              value={progress}
              onValueChange={setProgress}
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#4A90E2"
              maximumTrackTintColor="#4A4A4A"
              thumbTintColor="#4A90E2"
            />
            
            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>6:27</Text>
              <Text style={styles.timeText}>12:45</Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.skipButton}>
                <Text style={styles.skipButtonText}>15</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={togglePlayPause}
              >
                <IconButton
                  icon={isPlaying ? 'pause' : 'play'}
                  size={32}
                  iconColor="#1E1E2D"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipButton}>
                <Text style={styles.skipButtonText}>30</Text>
              </TouchableOpacity>
            </View>
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
    </SafeAreaView>
  );
}

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
}); 
