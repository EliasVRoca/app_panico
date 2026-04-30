import { create } from 'zustand';
import { panicService } from '@/services/panicService';
import type { PanicEvent, PanicActivateResponse } from '../types';

interface PanicState {
  history: PanicEvent[];
  lastEvent: PanicEvent | null;
  lastResponse: PanicActivateResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  setLastResponse: (response: PanicActivateResponse) => void;
}

export const usePanicStore = create<PanicState>((set) => ({
  history: [],
  lastEvent: null,
  lastResponse: null,
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await panicService.getHistory();
      set({
        history: data,
        lastEvent: data.length > 0 ? data[0] : null,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setLastResponse: (response: PanicActivateResponse) => {
    set({
      lastResponse: response,
      lastEvent: response.event,
    });
  },
}));
