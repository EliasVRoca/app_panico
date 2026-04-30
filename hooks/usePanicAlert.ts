import { useEmergencyStore } from '@/store/emergencyStore';
import { usePanicStore } from '@/store/panicStore';
import { useCallback, useState } from 'react';
import { panicService } from '@/services/panicService';
import type { PanicActivateResponse } from '@/types';

export const usePanicAlert = () => {
  const { status, setStatus, resetAlert, location } = useEmergencyStore();
  const { setLastResponse } = usePanicStore();
  const [lastResponse, setLocalResponse] = useState<PanicActivateResponse | null>(null);

  const cancelAlert = useCallback(() => {
    resetAlert();
  }, [resetAlert]);

  const sendAlert = useCallback(async () => {
    setStatus('sending');
    try {
      const latitude = location?.latitude ?? null;
      const longitude = location?.longitude ?? null;

      if (latitude === null || longitude === null) {
        console.warn('Advertencia: No se detectó ubicación. Se enviará la alerta sin coordenadas.');
      }

      console.log('Enviando alerta S.O.S a la API con ubicación:', latitude, longitude);

      const response = await panicService.activatePanic(latitude, longitude);

      setLocalResponse(response);   // estado local del hook
      setLastResponse(response);    // estado global del store
      console.log('Alerta enviada:', response.message);
      console.log('Evento ID:', response.event.id);

      setStatus('success');
    } catch (err) {
      console.error('Error al enviar la alerta de pánico', err);
      setStatus('error');
    }
  }, [setStatus, location, setLastResponse]);

  return { cancelAlert, sendAlert, lastResponse };
};
