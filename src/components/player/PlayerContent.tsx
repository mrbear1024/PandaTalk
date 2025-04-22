import React from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

type PlayerContentProps = {
  image: any;
  title: string;
  subtitle: string;
  description: string;
};

export default function PlayerContent({
  image,
  title,
  subtitle,
  description,
}: PlayerContentProps) {
  return (
    <View style={styles.content}>
      <View style={styles.imageContainer}>
        <Image 
          source={image} 
          style={styles.coverArt}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.info}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>SUBSCRIBE</Text>
      </TouchableOpacity>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 