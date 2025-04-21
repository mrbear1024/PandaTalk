// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  MD3DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import PodcastHome from './src/screens/PodcastHome';
import PodcastDetail from './src/screens/PodcastDetail';
import AllEpisodes from './src/screens/AllEpisodes';
import PlayerScreen from './src/screens/PlayerScreen';

const Stack = createNativeStackNavigator();

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

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={PodcastHome} />
            <Stack.Screen name="PodcastDetail" component={PodcastDetail} />
            <Stack.Screen name="AllEpisodes" component={AllEpisodes} />
            <Stack.Screen name="Player" component={PlayerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}