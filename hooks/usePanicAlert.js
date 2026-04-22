import { useEmergencyStore } from '@/store/emergencyStore';
import { useCallback, useEffect } from 'react';
import axios from 'axios';

export const usePanicAlert = () => {
  const { status, setStatus, resetAlert, location } = useEmergencyStore();

  const cancelAlert = useCallback(() => {
    resetAlert();
  }, [resetAlert]);

  const sendAlert = useCallback(async () => {
    setStatus('sending');
    try {
      // Fase 3: Simulación de envío a API
      console.log('Enviando alerta S.O.S con ubicación:', location);
      
      // Aquí iría la llamada real con axios
      // await axios.post('https://api.tu-servidor.com/alert', { location });
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [setStatus, location]);

  useEffect(() => {
    let timer;
    if (status === 'counting') {
      timer = setTimeout(() => {
        sendAlert();
      }, 5000); // 5 segundos de cuenta regresiva
    }
    return () => clearTimeout(timer);
  }, [status, sendAlert]);

  return { cancelAlert, sendAlert };
};
