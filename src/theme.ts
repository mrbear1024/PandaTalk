import { MD3DarkTheme } from 'react-native-paper';
import { Theme } from './types';

export const theme: Theme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#1E1E2D',
    surface: '#2A2A3F',
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    border: 'rgba(255, 255, 255, 0.1)',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: '700',
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
}; 