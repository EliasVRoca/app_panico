import { useEmergencyStore } from '@/store/emergencyStore';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const LocationCard = ({ onRetry }) => {
  const location = useEmergencyStore((state) => state.location);
  const locationError = useEmergencyStore((state) => state.locationError);
  const locationLoading = useEmergencyStore((state) => state.locationLoading);

  const renderStatus = () => {
    if (locationLoading) {
      return (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#1F6F8B" />
          <Text style={styles.statusText}>Localizando...</Text>
        </View>
      );
    }
    if (locationError) {
      return (
        <View style={styles.statusRow}>
          <MaterialIcons name="location-off" size={16} color="#D32F2F" />
          <Text style={[styles.statusText, { color: '#D32F2F' }]}>Error de GPS</Text>
        </View>
      );
    }
    if (location) {
      return (
        <View style={styles.statusRow}>
          <MaterialIcons name="location-on" size={16} color="#2E7D32" />
          <Text style={[styles.statusText, { color: '#2E7D32' }]}>GPS Activo</Text>
        </View>
      );
    }
    return (
      <View style={styles.statusRow}>
        <MaterialIcons name="gps-fixed" size={16} color="#90A4AE" />
        <Text style={styles.statusText}>Esperando señal...</Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>MI UBICACIÓN</Text>
        {renderStatus()}
      </View>

      {location ? (
        <View style={styles.content}>
          <View style={styles.coordGroup}>
            <Text style={styles.coordLabel}>Latitud</Text>
            <Text style={styles.coordValue}>{location.latitude.toFixed(5)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.coordGroup}>
            <Text style={styles.coordLabel}>Longitud</Text>
            <Text style={styles.coordValue}>{location.longitude.toFixed(5)}</Text>
          </View>
        </View>
      ) : locationError ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryBtnText}>Reintentar búsqueda</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.placeholder}>Obteniendo coordenadas precisas...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#90A4AE',
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#90A4AE',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECEFF1',
    borderRadius: 16,
    padding: 16,
  },
  coordGroup: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#90A4AE',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#263238',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  placeholder: {
    color: '#90A4AE',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: '#1F6F8B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
