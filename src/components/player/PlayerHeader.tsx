import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type PlayerHeaderProps = {
  podcastTitle: string;
};

export default function PlayerHeader({ podcastTitle }: PlayerHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <IconButton
        icon="chevron-down"
        size={24}
        iconColor="#FFFFFF"
        onPress={() => navigation.goBack()}
      />
      <Text variant="titleMedium" style={styles.headerTitle}>
        {podcastTitle}
      </Text>
      <IconButton
        icon="dots-vertical"
        size={24}
        iconColor="#FFFFFF"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 