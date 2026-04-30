import { create } from 'zustand';
import { userService } from '@/services/userService';
import type { User, CreateUserPayload, PatchUserPayload } from '../types';

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  getUserById: (id: number) => Promise<void>;
  addUser: (payload: CreateUserPayload) => Promise<void>;
  updateUser: (id: number, payload: CreateUserPayload) => Promise<void>;
  patchUser: (id: number, payload: PatchUserPayload) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getUsers();
      set({ users: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.getUserById(id);
      set({ selectedUser: user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addUser: async (payload: CreateUserPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userService.createUser(payload);
      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateUser: async (id: number, payload: CreateUserPayload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(id, payload);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        selectedUser: updatedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  patchUser: async (id: number, payload: PatchUserPayload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.patchUser(id, payload);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        selectedUser: updatedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
