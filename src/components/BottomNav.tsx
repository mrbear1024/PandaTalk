// components/BottomNav.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const tabs = [
  { key: 'Home',    icon: 'home' as IconName },
  { key: 'Search',  icon: 'magnify' as IconName },
  { key: 'Library', icon: 'library-shelves' as IconName },
  { key: 'Profile', icon: 'account' as IconName },
];

export default function BottomNav({ selected, onSelect }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>  
      {tabs.map(tab => {
        const active = selected === tab.key;
        const color = active ? theme.colors.primary : theme.colors.onSurfaceVariant;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name={tab.icon} size={28} color={color} />
            <Text style={[styles.label, { color }]}>{tab.key}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
