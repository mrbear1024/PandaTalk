// App.tsx
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PlayerProvider } from './src/contexts/PlayerContext';
import TabNavigator from './src/navigation/TabNavigator';
import Login from './src/screens/Login';
import EditProfile from './src/screens/EditProfile';
import PodcastDetail from './src/screens/PodcastDetail';
import AllEpisodes from './src/screens/AllEpisodes';
import PlayerScreen from './src/screens/PlayerScreen';

const Stack = createNativeStackNavigator();

// 定义主题
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

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
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
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <PlayerProvider>
            <View style={{ flex: 1 }}>
              <NavigationContainer>
                <Navigation />
              </NavigationContainer>
            </View>
          </PlayerProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}