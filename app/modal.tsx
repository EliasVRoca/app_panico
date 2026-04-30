import { useEmergencyStore } from '@/store/emergencyStore';
import { usePanicAlert } from '@/hooks/usePanicAlert';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EmergencyModal() {
  const router = useRouter();
  const { status, resetAlert } = useEmergencyStore();
  const { sendAlert, cancelAlert } = usePanicAlert();
  const [seconds, setSeconds] = useState(5);

  // Animación para el anillo de pulso
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'counting') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulse.start();
      
      const interval = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(interval);
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      return () => {
        pulse.stop();
        clearInterval(interval);
      };
    }
  }, [status, scaleAnim]);

  // Disparar alerta cuando el contador llega a 0
  useEffect(() => {
    if (status === 'counting' && seconds === 0) {
      sendAlert();
    }
  }, [seconds, status, sendAlert]);

  // Si la alerta termina con éxito, cerramos tras un momento
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        resetAlert(); // vuelve a idle y cierra el modal
      }, 2500);
      return () => clearTimeout(timer);
    }
    // Si vuelve a idle (por ejemplo al cancelar), cerramos el modal
    if (status === 'idle') {
      router.back();
    }
  }, [status, router, resetAlert]);

  const handleCancel = () => {
    cancelAlert(); // Llama a resetAlert, lo que cambia status a 'idle' y cierra
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        
        {/* Header de Emergencia */}
        <View style={styles.header}>
          <MaterialIcons name="warning" size={48} color="#FFF" style={{ marginBottom: 10 }} />
          <Text style={styles.emergencyText}>ALERTA S.O.S</Text>
          <Text style={styles.subText}>Enviando tu ubicación en tiempo real...</Text>
        </View>

        {/* Círculo de Cuenta Regresiva o Estado */}
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: scaleAnim }] }]} />
          <View style={styles.timerCircle}>
            {status === 'counting' && (
              <>
                <Text style={styles.timerNumber}>{seconds}</Text>
                <Text style={styles.timerLabel}>SEGUNDOS</Text>
              </>
            )}
            {status === 'sending' && (
              <>
                <ActivityIndicator size="large" color="#D32F2F" />
                <Text style={[styles.timerLabel, { marginTop: 15 }]}>ENVIANDO...</Text>
              </>
            )}
            {status === 'success' && (
              <>
                <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
                <Text style={[styles.timerLabel, { marginTop: 5, color: '#4CAF50' }]}>ENVIADO</Text>
              </>
            )}
            {status === 'error' && (
              <>
                <MaterialIcons name="error" size={80} color="#D32F2F" />
                <Text style={[styles.timerLabel, { marginTop: 5, color: '#D32F2F' }]}>ERROR</Text>
              </>
            )}
          </View>
        </View>

        {/* Información Adicional */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <MaterialIcons name="security" size={20} color="#FFF" />
            <Text style={styles.infoText}>Protocolo de seguridad activo</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <MaterialIcons name="gps-fixed" size={20} color="#FFF" />
            <Text style={styles.infoText}>GPS rastreando coordenadas</Text>
          </View>
        </View>

        {/* Botón de Cancelación Crítica o Cierre */}
        {(status === 'counting' || status === 'error') ? (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>
              {status === 'error' ? 'CERRAR' : 'CANCELAR ALERTA'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 60 }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F', // Rojo de Error de la paleta
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 50,
  },
  header: {
    alignItems: 'center',
  },
  emergencyText: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  timerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  timerNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#D32F2F',
    lineHeight: 85,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#90A4AE',
    letterSpacing: 2,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 20,
    borderRadius: 20,
    width: '80%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 60,
    paddingVertical: 22,
    borderRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    height: 60,
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#D32F2F',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
});
