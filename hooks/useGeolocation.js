import { useEmergencyStore } from '@/store/emergencyStore';
import * as Location from 'expo-location';
import { useCallback, useEffect } from 'react';

export const useGeolocation = () => {
  const setLocation = useEmergencyStore((state) => state.setLocation);
  const setLocationLoading = useEmergencyStore((state) => state.setLocationLoading);
  const setLocationError = useEmergencyStore((state) => state.setLocationError);

  const fetchLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permiso denegado');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        accuracy: locationData.coords.accuracy,
      });
    } catch (err) {
      setLocationError(err.message ?? 'Error desconocido');
    } finally {
      setLocationLoading(false);
    }
  }, [setLocation, setLocationLoading, setLocationError]);

  useEffect(() => {
    let subscription;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permiso denegado');
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (locationData) => {
            setLocation({
              latitude: locationData.coords.latitude,
              longitude: locationData.coords.longitude,
              accuracy: locationData.coords.accuracy,
            });
            setLocationLoading(false);
          },
        );
      } catch (err) {
        setLocationError(err.message);
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [setLocation, setLocationError, setLocationLoading]);

  return { fetchLocation };
};
