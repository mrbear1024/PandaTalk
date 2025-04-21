import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats?: {
    podcasts: number;
    episodes: number;
    listeningTime: string;
  };
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // 模拟验证 token 并获取用户信息
        const user = await mockValidateToken(token);
        setState(prev => ({ ...prev, user, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '认证检查失败',
        isLoading: false 
      }));
    }
  };

  const signIn = async (credentials: Credentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // 模拟登录 API 调用
      const { token, user } = await mockLoginAPI(credentials);
      await AsyncStorage.setItem('authToken', token);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '登录失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await AsyncStorage.removeItem('authToken');
      setState({ user: null, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '登出失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // 模拟更新用户信息 API 调用
      const updatedUser = await mockUpdateUserAPI(userData);
      setState(prev => ({ 
        ...prev, 
        user: updatedUser, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '更新用户信息失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // 模拟 Google 登录
      const { token, user } = await mockSocialLoginAPI('google');
      await AsyncStorage.setItem('authToken', token);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Google 登录失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // 模拟 Apple 登录
      const { token, user } = await mockSocialLoginAPI('apple');
      await AsyncStorage.setItem('authToken', token);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Apple 登录失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // 模拟访客登录
      const { token, user } = await mockGuestLoginAPI();
      await AsyncStorage.setItem('authToken', token);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '访客登录失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // 模拟注册 API 调用
      const { token, user } = await mockSignUpAPI({ name, email, password });
      await AsyncStorage.setItem('authToken', token);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '注册失败',
        isLoading: false 
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      signIn, 
      signOut, 
      updateUser,
      signInWithGoogle,
      signInWithApple,
      signInAsGuest,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Mock API functions
const mockLoginAPI = async (credentials: Credentials) => {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (credentials.email === 'test@example.com' && credentials.password === 'password') {
    return {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'test@example.com',
        avatar: require('../../assets/podcast-cover.png'),
        stats: {
          podcasts: 12,
          episodes: 156,
          listeningTime: '48h 30m'
        }
      }
    };
  }
  throw new Error('Invalid credentials');
};

const mockValidateToken = async (token: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: '1',
    name: 'John Doe',
    email: 'test@example.com',
    avatar: require('../../assets/podcast-cover.png'),
    stats: {
      podcasts: 12,
      episodes: 156,
      listeningTime: '48h 30m'
    }
  };
};

const mockUpdateUserAPI = async (userData: Partial<User>) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: '1',
    name: userData.name || 'John Doe',
    email: userData.email || 'test@example.com',
    avatar: userData.avatar || require('../../assets/podcast-cover.png'),
    stats: {
      podcasts: 12,
      episodes: 156,
      listeningTime: '48h 30m'
    }
  };
};

const mockSocialLoginAPI = async (provider: 'google' | 'apple') => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    token: `mock-${provider}-token`,
    user: {
      id: '1',
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `${provider}@example.com`,
      avatar: require('../../assets/podcast-cover.png'),
      stats: {
        podcasts: 12,
        episodes: 156,
        listeningTime: '48h 30m'
      }
    }
  };
};

const mockGuestLoginAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    token: 'mock-guest-token',
    user: {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: require('../../assets/podcast-cover.png'),
      stats: {
        podcasts: 0,
        episodes: 0,
        listeningTime: '0h 0m'
      }
    }
  };
};

const mockSignUpAPI = async (data: { name: string; email: string; password: string }) => {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟注册成功
  return {
    token: 'mock-token',
    user: {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      avatar: require('../../assets/podcast-cover.png'),
      stats: {
        podcasts: 0,
        episodes: 0,
        listeningTime: '0h 0m'
      }
    }
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 