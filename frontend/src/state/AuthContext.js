import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext(null);

const DEMO_USER = {
  fullName: 'Demo Student',
  email: 'student@demo.com',
  role: 'student',
  totalScore: 1280,
  totalQuizzes: 15,
  totalQuestions: 150,
  correctQuestions: 125
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (!mounted) return;

        if (storedToken) {
          setToken(storedToken);
          setUser(storedUser ? JSON.parse(storedUser) : DEMO_USER);
        }
      } finally {
        if (mounted) setBooting(false);
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const saveSession = async (nextToken, nextUser) => {
    const normalizedUser = nextUser || DEMO_USER;
    const normalizedToken = nextToken || 'demo-token';

    setToken(normalizedToken);
    setUser(normalizedUser);

    await AsyncStorage.setItem('token', normalizedToken);
    await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const updateUser = async patch => {
    const nextUser = { ...(user || DEMO_USER), ...patch };
    setUser(nextUser);
    await AsyncStorage.setItem('user', JSON.stringify(nextUser));
  };

  const login = async credentials => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      await saveSession(data?.token, data?.user);
      return { ok: true, demo: false };
    } catch (error) {
      if (error.response) {
        return { ok: false, error: error.response.data?.message || 'Login failed' };
      }
      await saveSession('demo-token', { ...DEMO_USER, email: credentials.email });
      return { ok: true, demo: true };
    }
  };

  const register = async payload => {
    try {
      const { data } = await api.post('/auth/register', payload);
      await saveSession(data?.token, data?.user);
      return { ok: true, demo: false };
    } catch (error) {
      if (error.response) {
        return { ok: false, error: error.response.data?.message || 'Registration failed' };
      }
      await saveSession('demo-token', {
        ...DEMO_USER,
        fullName: payload.fullName,
        email: payload.email
      });
      return { ok: true, demo: true };
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['token', 'user']);
  };

  const value = useMemo(() => ({
    booting,
    isAuthenticated: Boolean(token),
    login,
    logout,
    register,
    token,
    updateUser,
    user
  }), [booting, token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
