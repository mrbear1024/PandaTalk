import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, List, Switch, Divider, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import BottomNav from '../components/BottomNav';
import MainLayout from '../components/MainLayout';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: require('../../assets/podcast-cover.png'),
  stats: {
    podcasts: 12,
    episodes: 156,
    listeningTime: '48h 30m'
  }
};

type RootStackParamList = {
  EditProfile: undefined;
};

type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  LibraryTab: undefined;
  ProfileTab: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

export default function Profile() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const tabNavigation = useNavigation<TabNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);

  const handleTabSelect = (tab: string) => {
    switch (tab) {
      case 'Home':
        tabNavigation.navigate('HomeTab');
        break;
      case 'Search':
        tabNavigation.navigate('SearchTab');
        break;
      case 'Library':
        tabNavigation.navigate('LibraryTab');
        break;
      case 'Profile':
        tabNavigation.navigate('ProfileTab');
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Image 
              size={80} 
              source={userData.avatar} 
              style={styles.avatar}
            />
          </View>
          <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onBackground }]}>
            {userData.name}
          </Text>
          <Text variant="bodyMedium" style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
            {userData.email}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
              {userData.stats.podcasts}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Podcasts
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
              {userData.stats.episodes}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Episodes
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
              {userData.stats.listeningTime}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Listening Time
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={[styles.settingsContainer, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Settings
          </Text>
          
          <List.Section>
            <List.Item
              title="Notifications"
              left={props => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Download over WiFi only"
              left={props => <List.Icon {...props} icon="wifi" />}
              right={() => (
                <Switch
                  value={downloadOverWifi}
                  onValueChange={setDownloadOverWifi}
                  color={theme.colors.primary}
                />
              )}
            />
          </List.Section>
        </View>

        {/* Account Section */}
        <View style={[styles.settingsContainer, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Account
          </Text>
          
          <List.Section>
            <List.Item
              title="Edit Profile"
              left={props => <List.Icon {...props} icon="account-edit" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('EditProfile')}
            />
            <Divider />
            <List.Item
              title="Subscription"
              left={props => <List.Icon {...props} icon="star" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Payment Methods"
              left={props => <List.Icon {...props} icon="credit-card" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </List.Section>
        </View>

        {/* Support Section */}
        <View style={[styles.settingsContainer, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Support
          </Text>
          
          <List.Section>
            <List.Item
              title="Help Center"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              left={props => <List.Icon {...props} icon="shield-check" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Terms of Service"
              left={props => <List.Icon {...props} icon="file-document" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </List.Section>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => {}}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#FF5252" />
          <Text style={[styles.logoutText, { color: '#FF5252' }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
  },
  settingsContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
}); 