import React from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface FeaturedItem {
  id: string;
  title: string;
  podcast: string;
  description: string;
  duration: string;
  icon: string;
  image: any;
}

interface Props {
  items: FeaturedItem[];
  onPress?: (item: FeaturedItem) => void;
}

export default function FeaturedList({ items, onPress }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => onPress?.(item)}
        >
          <Image source={item.image} style={styles.image} />
          <Text
            variant="bodyMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  item: {
    width: 140,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
});
