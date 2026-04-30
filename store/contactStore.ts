import { create } from 'zustand';
import { contactService } from '@/services/contactService';
import type { Contact } from '../types';

interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  getContactById: (id: number) => Promise<void>;
  addContact: (name: string, phone_number: string, priority?: number) => Promise<void>;
  updateContact: (id: number, name: string, phone_number: string, priority?: number) => Promise<void>;
  patchContact: (id: number, data: Partial<{ name: string; phone_number: string; priority: number }>) => Promise<void>;
  removeContact: (id: number) => Promise<void>;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await contactService.getContacts();
      set({ contacts: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getContactById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const contact = await contactService.getContactById(id);
      set({ selectedContact: contact, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addContact: async (name: string, phone_number: string, priority = 1) => {
    set({ isLoading: true, error: null });
    try {
      const newContact = await contactService.createContact({ name, phone_number, priority });
      set((state) => ({
        contacts: [...state.contacts, newContact],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeContact: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await contactService.deleteContact(id);
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateContact: async (id: number, name: string, phone_number: string, priority = 1) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await contactService.updateContact(id, { name, phone_number, priority });
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? updated : c)),
        selectedContact: updated,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  patchContact: async (id: number, data: Partial<{ name: string; phone_number: string; priority: number }>) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await contactService.patchContact(id, data);
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? updated : c)),
        selectedContact: updated,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
