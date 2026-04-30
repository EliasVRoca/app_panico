import { useEmergencyStore } from '@/store/emergencyStore';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, FONT_SIZES, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '@/constants/theme';

export const LocationCard = ({ onRetry }) => {
  const location = useEmergencyStore((state) => state.location);
  const locationError = useEmergencyStore((state) => state.locationError);
  const locationLoading = useEmergencyStore((state) => state.locationLoading);

  const renderStatus = () => {
    if (locationLoading) {
      return (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color={COLORS.primaryBlue} />
          <Text style={styles.statusText}>Localizando...</Text>
        </View>
      );
    }
    if (locationError) {
      const errorMsg = 
        locationError === 'GPS desactivado' ? 'GPS Apagado' : 
        locationError === 'Timeout de ubicación' ? 'Señal débil' : 
        locationError;

      return (
        <View style={styles.statusRow}>
          <MaterialIcons name="location-off" size={16} color={COLORS.error} />
          <Text style={[styles.statusText, { color: COLORS.error }]}>
            {errorMsg}
          </Text>
        </View>
      );
    }
    if (location) {
      return (
        <View style={styles.statusRow}>
          <MaterialIcons name="location-on" size={16} color={COLORS.success} />
          <Text style={[styles.statusText, { color: COLORS.success }]}>GPS Activo</Text>
        </View>
      );
    }
    return (
      <View style={styles.statusRow}>
        <MaterialIcons name="gps-fixed" size={16} color={COLORS.mediumGray} />
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
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.lightBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primaryBlue,
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.mediumGray,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  coordGroup: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.mediumGray,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.darkText,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  placeholder: {
    color: COLORS.mediumGray,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: FONT_SIZES.md,
  },
  retryBtn: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryBtnText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
