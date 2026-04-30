import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('api/auth/login/', { username, password });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Error al iniciar sesión');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  register: async (userData: Record<string, string>): Promise<void> => {
    try {
      const response = await api.post('api/auth/register/', userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error en el registro');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
    } catch (error) {
      console.error('Error clearing session:', error);
      throw new Error('Error al cerrar sesión');
    }
  }
};
