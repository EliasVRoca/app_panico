import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEmergencyStore } from '@/store/emergencyStore';

export const PanicButton = ({ onActivated }) => {
  const status = useEmergencyStore((state) => state.status);
  const startCountdown = useEmergencyStore((state) => state.startCountdown);

  // Pulse animation for idle state
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.spring(pulseAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    return () => pulseLoop.current?.stop();
  }, [status, pulseAnim]);

  const handleLongPress = () => {
    // Fase 2: Integración de Haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    startCountdown();
    onActivated?.();
  };

  const isCounting = status === 'counting';
  const isSending = status === 'sending';

  // Fase 2: Colores dinámicos basados en la nueva paleta solicitada
  const buttonColor = isCounting
    ? '#FFA726' // Secondary Orange
    : isSending
      ? '#2EA3D0' // Secondary Blue
      : status === 'success'
        ? '#2E7D32' // Success Green
        : status === 'error'
          ? '#D32F2F' // Error Red
          : '#F57C00'; // Primary Orange (Idle)

  return (
    <View style={styles.container}>
      {/* Efecto de brillo/shimmer detrás del botón */}
      <Animated.View 
        style={[
          styles.shimmer, 
          { 
            transform: [{ scale: pulseAnim }], 
            opacity: status === 'idle' ? 0.3 : 0 
          }
        ]} 
      />
      
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onLongPress={handleLongPress}
          delayLongPress={1000}
          disabled={isSending || status === 'success'}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: buttonColor },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.sosText}>S.O.S</Text>
          <Text style={styles.hintText}>
            {isCounting
              ? 'ACTIVANDO...'
              : isSending
                ? 'ENVIANDO...'
                : status === 'success'
                  ? 'ENVIADO'
                  : status === 'error'
                    ? 'ERROR'
                    : 'MANTÉN PRESIONADO'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmer: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FFA726',
  },
  button: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#F57C00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonPressed: {
    opacity: 0.9,
    // Eliminamos el transform scale aquí para no chocar con el Animated.View
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
  },
  hintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 8,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
