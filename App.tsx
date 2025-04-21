// App.tsx
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MD3DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PodcastHome from './src/screens/PodcastHome';
import PodcastDetail from './src/screens/PodcastDetail';
import AllEpisodes from './src/screens/AllEpisodes';
import PlayerScreen from './src/screens/PlayerScreen';
import SearchScreen from './src/screens/SearchScreen';
import Library from './src/screens/Library';
import Profile from './src/screens/Profile';
import EditProfile from './src/screens/EditProfile';
import Login from './src/screens/Login';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import TrackPlayer from 'react-native-track-player';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#1E1E2D',
    surface: '#2A2A3F',
    surfaceVariant: '#262735',
    onSurface: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurfaceVariant: '#A1A1AA',
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'LibraryTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={PodcastHome} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="LibraryTab" component={Library} options={{ title: 'Library' }} />
      <Tab.Screen name="ProfileTab" component={Profile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="PodcastDetail" component={PodcastDetail} />
          <Stack.Screen name="AllEpisodes" component={AllEpisodes} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const setup = async () => {
      await TrackPlayer.setupPlayer();
    };
    setup();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}