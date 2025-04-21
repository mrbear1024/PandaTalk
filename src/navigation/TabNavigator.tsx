import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import PlayerToolbar, { PLAYER_TOOLBAR_HEIGHT } from '../components/PlayerToolbar';
import { usePlayer } from '../contexts/PlayerContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const theme = useTheme();
  const { isPlayerVisible } = usePlayer();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1E1E2D',
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            height: 60,
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#9E9E9E',
          headerStyle: {
            backgroundColor: '#1E1E2D',
          },
          headerTintColor: '#FFFFFF',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="library" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
      {isPlayerVisible && <PlayerToolbar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 