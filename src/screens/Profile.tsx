import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, List, Switch, Divider, Avatar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import type { NavigationProp } from '../types/navigation';

export default function Profile() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut, updateUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [downloadOverWifi, setDownloadOverWifi] = React.useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // 错误已经在 context 中处理
    }
  };

  return (
    <ProtectedRoute>
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
                source={user?.avatar || require('../../assets/podcast-cover.png')} 
                style={styles.avatar}
              />
            </View>
            <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onBackground }]}>
              {user?.name}
            </Text>
            <Text variant="bodyMedium" style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
              {user?.email}
            </Text>
          </View>

          {/* Stats Section */}
          <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                {user?.stats?.podcasts}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Podcasts
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                {user?.stats?.episodes}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Episodes
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                {user?.stats?.listeningTime}
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
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
          >
            Logout
          </Button>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
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
    marginHorizontal: 16,
    marginBottom: 24,
  },
}); 