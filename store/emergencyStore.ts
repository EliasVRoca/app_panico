import { create } from 'zustand';
import type { LocationData } from '../types';

type AlertStatus = 'idle' | 'counting' | 'sending' | 'success' | 'error';

interface EmergencyState {
  isActive: boolean;
  status: AlertStatus;
  countdown: number;
  location: LocationData | null;
  locationLoading: boolean;
  locationError: string | null;
  setStatus: (status: AlertStatus) => void;
  setLocation: (location: LocationData) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  startCountdown: () => void;
  resetAlert: () => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  isActive: false,
  status: 'idle',
  countdown: 5,
  location: null,
  locationLoading: false,
  locationError: null,

  setStatus: (status) => set({ status }),
  setLocation: (location) => set({ location }),
  setLocationLoading: (locationLoading) => set({ locationLoading }),
  setLocationError: (locationError) => set({ locationError }),

  startCountdown: () => set({ isActive: true, status: 'counting' }),
  resetAlert: () => set({ isActive: false, status: 'idle', countdown: 5 }),
}));
