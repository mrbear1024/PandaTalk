import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual login logic
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        avatar: null,
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // TODO: Implement actual registration logic
      const mockUser: User = {
        id: '1',
        email,
        name,
        avatar: null,
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      setError(null);
      await login(credentials.email, credentials.password);
    } catch (error) {
      setError('登录失败，请检查邮箱和密码');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      // 模拟 Google 登录
      const mockUser: User = {
        id: 'google-user',
        email: 'google@example.com',
        name: 'Google User',
        avatar: null,
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      setError('Google 登录失败');
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      setError(null);
      // 模拟 Apple 登录
      const mockUser: User = {
        id: 'apple-user',
        email: 'apple@example.com',
        name: 'Apple User',
        avatar: null,
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      setError('Apple 登录失败');
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      setError(null);
      // 模拟访客登录
      const mockUser: User = {
        id: 'guest-user',
        email: 'guest@example.com',
        name: '访客用户',
        avatar: null,
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      setError('访客登录失败');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        logout,
        register,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signInAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 