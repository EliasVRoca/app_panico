import { create } from 'zustand';

export const useEmergencyStore = create((set) => ({
  isActive: false,
  status: 'idle', // idle, counting, sending, success, error
  countdown: 5,
  location: null,
  locationLoading: false,
  locationError: null,
  contacts: [
    { id: '1', name: 'Centro de Monitoreo', phone: '911' }
  ],

  setStatus: (status) => set({ status }),
  setLocation: (location) => set({ location }),
  setLocationLoading: (locationLoading) => set({ locationLoading }),
  setLocationError: (locationError) => set({ locationError }),
  
  addContact: (name, phone) => set((state) => ({ 
    contacts: [...state.contacts, { id: Date.now().toString(), name, phone }] 
  })),
  removeContact: (id) => set((state) => ({ 
    contacts: state.contacts.filter(c => c.id !== id) 
  })),
  
  startCountdown: () => set({ isActive: true, status: 'counting' }),
  resetAlert: () => set({ isActive: false, status: 'idle', countdown: 5 }),
}));
