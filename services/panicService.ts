import api from './api';
import type { PanicActivatePayload, PanicActivateResponse, PanicEvent } from '../types';

export const panicService = {
  activatePanic: async (latitude: number | null, longitude: number | null): Promise<PanicActivateResponse> => {
    try {
      // La API espera las coordenadas como strings
      const payload: PanicActivatePayload = {
        latitude: latitude !== null ? String(latitude) : '0',
        longitude: longitude !== null ? String(longitude) : '0',
      };
      const response = await api.post('api/panic/activate/', payload);
      return response.data;
    } catch (error: any) {
      console.error('Detalles del error de API:', error.response?.data);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.detail || errorData.error || errorData.message || (typeof errorData === 'string' ? errorData : null);
        throw new Error(errorMessage || 'Error al enviar la alerta S.O.S.');
      }
      throw new Error('Error de conexión al enviar la alerta');
    }
  },

  getHistory: async (): Promise<PanicEvent[]> => {
    try {
      const response = await api.get('api/panic/history/');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el historial de alertas');
    }
  }
};
