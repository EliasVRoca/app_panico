import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { setSessionExpiredCallback } from '@/services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (userData: Record<string, string>) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  setSessionExpiredCallback(() => {
    set({ user: null, isAuthenticated: false, isLoading: false, error: 'La sesión ha expirado' });
  });

  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    signIn: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await authService.login(username, password);
        if (data.access) {
          await AsyncStorage.setItem('access_token', data.access);
          if (data.refresh) {
            await AsyncStorage.setItem('refresh_token', data.refresh);
          }
          set({
            user: data.user || { username },
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    signUp: async (userData: Record<string, string>) => {
      set({ isLoading: true, error: null });
      try {
        await authService.register(userData);
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      } catch (error) {
        console.error('Error durante el cierre de sesión', error);
        set({ isLoading: false });
      }
    },

    restoreSession: async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          // If token exists, try to get user info
          const store = useAuthStore.getState();
          await store.fetchMe();
        } else {
          set({ isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error('Error restaurando sesión', error);
        set({ isAuthenticated: false, isLoading: false });
      }
    },

    fetchMe: async () => {
      set({ isLoading: true, error: null });
      try {
        const user = await userService.getMe();
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isAuthenticated: false, isLoading: false });
        // Optional: clear tokens if me fails?
        // await AsyncStorage.removeItem('access_token');
      }
    },
  };
});
