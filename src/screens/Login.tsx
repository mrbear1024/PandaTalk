import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme, Text, TextInput, Button, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import type { NavigationProp } from '../types/navigation';

export default function Login() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { signIn, signInWithGoogle, signInWithApple, signInAsGuest, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [localError, setLocalError] = useState('');

  const handleLogin = async () => {
    try {
      setLocalError('');
      await signIn({ email, password });
    } catch (error) {
      setLocalError('登录失败，请检查邮箱和密码');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      setLocalError('Failed to login with Google');
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      console.error('Apple login error:', error);
      setLocalError('Failed to login with Apple');
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAsGuest();
    } catch (error) {
      console.error('Guest login error:', error);
      setLocalError('Failed to login as guest');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            欢迎回来
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            登录以继续使用播客应用
          </Text>

          <View style={styles.form}>
            <TextInput
              label="邮箱"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              style={styles.input}
            />

            {(error || localError) && (
              <HelperText type="error" visible={true}>
                {error || localError}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              登录
            </Button>

            <Button
              mode="text"
              onPress={() => {}}
              style={styles.button}
            >
              忘记密码？
            </Button>
          </View>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <Image
                source={require('../../assets/google.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
              onPress={handleAppleLogin}
              disabled={isLoading}
            >
              <Image
                source={require('../../assets/apple.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          <Button
            mode="outlined"
            onPress={handleGuestLogin}
            style={[styles.guestButton, { marginTop: 16 }]}
            disabled={isLoading}
          >
            Continue as Guest
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: theme.colors.primary }}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  guestButton: {
    marginTop: 16,
  },
}); 