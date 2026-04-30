import api from './api';
import type { Role, CreateRolePayload, PatchRolePayload } from '../types';

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await api.get('api/roles/');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los roles');
    }
  },

  getRoleById: async (id: number): Promise<Role> => {
    try {
      const response = await api.get(`api/roles/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener el rol con id ${id}`);
    }
  },

  updateRole: async (id: number, payload: CreateRolePayload): Promise<Role> => {
    try {
      const response = await api.put(`api/roles/${id}/`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al actualizar el rol');
      }
      throw new Error('Error de conexión al actualizar el rol');
    }
  },

  patchRole: async (id: number, payload: PatchRolePayload): Promise<Role> => {
    try {
      const response = await api.patch(`api/roles/${id}/`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al actualizar el rol parcialmente');
      }
      throw new Error('Error de conexión al actualizar el rol');
    }
  },

  createRole: async (payload: CreateRolePayload): Promise<Role> => {
    try {
      const response = await api.post('api/roles/', payload);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al crear el rol');
      }
      throw new Error('Error de conexión al crear el rol');
    }
  },

  deleteRole: async (id: number): Promise<void> => {
    try {
      await api.delete(`api/roles/${id}/`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Error al eliminar el rol');
      }
      throw new Error('Error de conexión al eliminar el rol');
    }
  },
};
