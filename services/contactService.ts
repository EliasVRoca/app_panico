import api from './api';
import type { Contact, CreateContactPayload, PatchContactPayload } from '../types';

export const contactService = {
  getContacts: async (): Promise<Contact[]> => {
    try {
      const response = await api.get('api/contacts/');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los contactos');
    }
  },

  createContact: async (contactData: CreateContactPayload): Promise<Contact> => {
    try {
      const response = await api.post('api/contacts/', contactData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al crear contacto');
      }
      throw new Error('Error de conexión al crear contacto');
    }
  },

  getContactById: async (id: number): Promise<Contact> => {
    try {
      const response = await api.get(`api/contacts/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener el contacto con id ${id}`);
    }
  },

  updateContact: async (id: number, contactData: CreateContactPayload): Promise<Contact> => {
    try {
      const response = await api.put(`api/contacts/${id}/`, contactData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al actualizar contacto');
      }
      throw new Error('Error de conexión al actualizar contacto');
    }
  },

  patchContact: async (id: number, contactData: PatchContactPayload): Promise<Contact> => {
    try {
      const response = await api.patch(`api/contacts/${id}/`, contactData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data).flat().join(', ');
        throw new Error(errorMessage || 'Error al actualizar contacto parcialmente');
      }
      throw new Error('Error de conexión al actualizar contacto');
    }
  },

  deleteContact: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`api/contacts/${id}/`);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar contacto');
    }
  }
};
