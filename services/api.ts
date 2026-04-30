import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.ework.ia.bo/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let onSessionExpired = null;

export const setSessionExpiredCallback = (callback) => {
  onSessionExpired = callback;
};

// Interceptor de Peticiones: Agrega el token a las cabeceras
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token de AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas: Manejo de errores globales y refresco de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          
          // Guardamos el nuevo access token
          await AsyncStorage.setItem('access_token', access);

          // Actualizamos la cabecera original y reintentamos la petición
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Fallo al refrescar token, cerrando sesión...', refreshError);
        // Si falla el refresh, eliminamos los tokens para forzar re-login
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        
        if (onSessionExpired) {
          onSessionExpired();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
