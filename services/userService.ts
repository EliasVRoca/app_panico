import api from './api';
import type { User, CreateUserPayload, PatchUserPayload } from '../types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('api/users/');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Error al obtener los usuarios');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const response = await api.get('api/users/me/');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Error al obtener mi perfil');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`api/users/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error('Error de conexión con el servidor');
    }
  },

  updateUser: async (id: number, payload: CreateUserPayload): Promise<User> => {
    try {
      const response = await api.put(`api/users/${id}/`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al actualizar el usuario');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  patchUser: async (id: number, payload: PatchUserPayload): Promise<User> => {
    try {
      const response = await api.patch(`api/users/${id}/`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al actualizar el usuario');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    try {
      const response = await api.post('api/users/', payload);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al crear el usuario');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      await api.delete(`api/users/${id}/`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Error al eliminar el usuario');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
