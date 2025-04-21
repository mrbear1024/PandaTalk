import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabSelect: (tab: string) => void;
}

export default function MainLayout({ children, activeTab, onTabSelect }: MainLayoutProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {children}
      </View>
      <BottomNav selected={activeTab} onSelect={onTabSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 