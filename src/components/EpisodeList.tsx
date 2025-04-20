import React from "react";
import { FlatList, StyleSheet, Image, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";

interface Episode {
  id: string;
  title: string;
  podcast: string;
  duration: string;
  icon: string;
  image?: string;
}

interface Props {
  episodes: Episode[];
}

const EpisodeList: React.FC<Props> = ({ episodes }) => {
  const theme = useTheme();

  return (
    <FlatList
      data={episodes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={item.title}
          titleStyle={styles.title}
          description={item.podcast} 
          descriptionStyle={styles.description}
          left={(props) => (
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image 
                  source={{uri: item.image}}
                  style={styles.image}
                />
              ) : (
                <List.Icon {...props} icon={item.icon} />
              )}
            </View>
          )}
          right={() => <Text style={styles.duration}>{item.duration}</Text>}
          style={[styles.item, {backgroundColor: theme.colors.surface}]}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  item: {
    marginVertical: 4,
    borderRadius: 8,
  },
  imageContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  duration: {
    alignSelf: "center",
    marginRight: 16,
    fontSize: 14,
    opacity: 0.7,
  },
});

export default EpisodeList;
