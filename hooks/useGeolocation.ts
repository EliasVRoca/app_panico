import { useEmergencyStore } from '@/store/emergencyStore';
import * as Location from 'expo-location';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

export const useGeolocation = () => {
  const setLocation = useEmergencyStore((state) => state.setLocation);
  const setLocationLoading = useEmergencyStore((state) => state.setLocationLoading);
  const setLocationError = useEmergencyStore((state) => state.setLocationError);

  const fetchLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      let enabled = await Location.hasServicesEnabledAsync();
      if (!enabled && Platform.OS === 'android') {
        try {
          await Location.enableNetworkProviderAsync();
          enabled = await Location.hasServicesEnabledAsync();
        } catch (e) {
          console.warn('Failed to enable location services', e);
        }
      }

      if (!enabled) {
        setLocationError('GPS desactivado. Por favor enciéndelo.');
        return;
      }

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!canAskAgain) {
          setLocationError('Permiso denegado permanentemente. Actívalo en Ajustes.');
        } else {
          setLocationError('Permiso denegado');
        }
        return;
      }

      // Intentar obtener la última ubicación conocida (muy rápido)
      const lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        setLocation({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
          accuracy: lastKnown.coords.accuracy,
        });
      }

      // Intentar obtener ubicación actual con timeout
      const locationData = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de ubicación')), 10000)
        )
      ]);

      if (locationData && 'coords' in locationData) {
        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          accuracy: locationData.coords.accuracy,
        });
      }
    } catch (err) {
      console.warn('Error fetching location:', err.message);
      const currentState = useEmergencyStore.getState();
      if (!currentState.location) {
        setLocationError(err.message);
      }
    } finally {
      setLocationLoading(false);
    }
  }, [setLocation, setLocationLoading, setLocationError]);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startWatching = async () => {
      setLocationLoading(true);
      try {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled && Platform.OS === 'android') {
          try {
            await Location.enableNetworkProviderAsync();
            enabled = await Location.hasServicesEnabledAsync();
          } catch (e) {
            console.warn('Failed to enable location services in watcher', e);
          }
        }

        if (!enabled) {
          setLocationError('GPS desactivado');
          setLocationLoading(false);
          return;
        }

        const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!canAskAgain) {
            setLocationError('Permiso denegado. Ve a Ajustes.');
          } else {
            setLocationError('Permiso denegado');
          }
          setLocationLoading(false);
          return;
        }

        // Posición rápida
        const lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          setLocation({
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
            accuracy: lastKnown.coords.accuracy,
          });
          setLocationLoading(false);
        }

        // Fix inicial con timeout
        try {
          const initial = await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
          ]);
          
          if (initial && 'coords' in initial) {
            setLocation({
              latitude: initial.coords.latitude,
              longitude: initial.coords.longitude,
              accuracy: initial.coords.accuracy,
            });
          }
          setLocationLoading(false);
        } catch (e) {
          console.warn('Initial fix timeout, waiting for watcher...');
          const state = useEmergencyStore.getState();
          if (state.location) setLocationLoading(false);
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
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
            setLocationError(null);
          },
        );
      } catch (err) {
        console.error('Error in startWatching:', err);
        setLocationError(err.message);
        setLocationLoading(false);
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
