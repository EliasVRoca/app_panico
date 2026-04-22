import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { PanicButton } from '@/components/panic-button';
import { LocationCard } from '@/components/location-card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePanicAlert } from '@/hooks/usePanicAlert';
import { useEmergencyStore } from '@/store/emergencyStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Estados de colores basados en la paleta
const PALETTE = {
  primaryBlue: '#1F6F8B',
  darkText: '#263238',
  mediumGray: '#90A4AE',
  error: '#D32F2F',
  success: '#2E7D32',
  background: '#0a0a0a'
};

const STATUS_CONFIG = {
  idle: { color: PALETTE.success, label: 'LISTO', icon: 'check-circle' },
  counting: { color: '#F57C00', label: 'ACTIVANDO', icon: 'timer' },
  sending: { color: '#2EA3D0', label: 'ENVIANDO', icon: 'sync' },
  success: { color: PALETTE.success, label: 'ENVIADO', icon: 'done-all' },
  error: { color: PALETTE.error, label: 'ERROR', icon: 'error' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  return (
    <View style={[styles.badge, { borderColor: cfg.color }]}>
      <MaterialIcons name={cfg.icon} size={14} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const status = useEmergencyStore((state) => state.status);
  const { fetchLocation } = useGeolocation();
  const { cancelAlert } = usePanicAlert();

  // Fase 4: Navegación automática al modal cuando se activa la cuenta atrás
  useEffect(() => {
    if (status === 'counting') {
      router.push('/modal');
    }
  }, [status, router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panic Alert</Text>
          <Text style={styles.headerSubtitle}>Sistema de Emergencia</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerBtn}
          onPress={() => router.push('/explore')}
        >
          <MaterialIcons name="people" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.statusWrapper}>
          <StatusBadge status={status} />
        </View>

        <View style={styles.buttonArea}>
          <PanicButton />
          <Text style={styles.instructions}>
            Mantén presionado el botón central{"\n"}para enviar una alerta inmediata.
          </Text>
        </View>

        <View style={styles.footer}>
          <LocationCard onRetry={fetchLocation} />
          
          {(status === 'counting' || status === 'error') && (
            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={cancelAlert}
            >
              <Text style={styles.cancelBtnText}>CANCELAR ALERTA</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: PALETTE.mediumGray,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  headerBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statusWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  buttonArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  instructions: {
    color: PALETTE.mediumGray,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    marginBottom: 20,
  },
  cancelBtn: {
    marginTop: 16,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderWidth: 1,
    borderColor: PALETTE.error,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: PALETTE.error,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
});
