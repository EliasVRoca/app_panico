import { create } from 'zustand';
import { roleService } from '@/services/roleService';
import type { Role } from '../types';

interface RoleState {
  roles: Role[];
  selectedRole: Role | null;
  isLoading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  getRoleById: (id: number) => Promise<void>;
  createRole: (name: string, description: string) => Promise<void>;
  updateRole: (id: number, name: string, description: string) => Promise<void>;
  patchRole: (id: number, data: Partial<{ name: string; description: string }>) => Promise<void>;
  removeRole: (id: number) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  selectedRole: null,
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await roleService.getRoles();
      set({ roles: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getRoleById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const role = await roleService.getRoleById(id);
      set({ selectedRole: role, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createRole: async (name: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      const newRole = await roleService.createRole({ name, description });
      set((state) => ({
        roles: [...state.roles, newRole],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateRole: async (id: number, name: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await roleService.updateRole(id, { name, description });
      set((state) => ({
        roles: state.roles.map((r) => (r.id === id ? updated : r)),
        selectedRole: updated,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  patchRole: async (id: number, data: Partial<{ name: string; description: string }>) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await roleService.patchRole(id, data);
      set((state) => ({
        roles: state.roles.map((r) => (r.id === id ? updated : r)),
        selectedRole: updated,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeRole: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await roleService.deleteRole(id);
      set((state) => ({
        roles: state.roles.filter((r) => r.id !== id),
        selectedRole: state.selectedRole?.id === id ? null : state.selectedRole,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
