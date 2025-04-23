import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PodcastHome from '../screens/PodcastHome';
import SearchScreen from '../screens/SearchScreen';
import Library from '../screens/Library';
import Profile from '../screens/Profile';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../contexts/PlayerContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const theme = useTheme();
  const { isPlayerVisible } = usePlayer();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
            component={PodcastHome}
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
            component={Library}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="library" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={Profile}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
      <View style={styles.bottomContainer}>
        {isPlayerVisible && <MiniPlayer />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60, // 与 tabBar 的高度相同
    left: 0,
    right: 0,
  },
}); 