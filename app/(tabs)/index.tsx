import { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PanicButton } from '@/components/panic-button';
import { LocationCard } from '@/components/location-card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePanicAlert } from '@/hooks/usePanicAlert';
import { useEmergencyStore } from '@/store/emergencyStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, FONT_SIZES, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';

const STATUS_CONFIG = {
  idle: { color: COLORS.success, label: 'LISTO', icon: 'lens' },
  counting: { color: COLORS.primaryOrange, label: 'ACTIVANDO', icon: 'timer' },
  sending: { color: COLORS.secondaryBlue, label: 'ENVIANDO', icon: 'sync' },
  success: { color: COLORS.success, label: 'ENVIADO', icon: 'done-all' },
  error: { color: COLORS.error, label: 'ERROR', icon: 'error' },
};

function StatusIndicator({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  return (
    <View style={styles.statusContainer}>
      <MaterialIcons name={cfg.icon} size={12} color={cfg.color} style={{ marginRight: 6 }} />
      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function BottomActions() {
  const router = useRouter();
  
  return (
    <View style={styles.bottomActions}>
      <TouchableOpacity 
        style={styles.actionBtn}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <MaterialIcons name="people" size={20} color={COLORS.primaryBlue} />
        <Text style={styles.actionBtnText}>Contactos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionBtn}
        onPress={() => router.push('/settings')} 
      >
        <MaterialIcons name="settings" size={20} color={COLORS.primaryBlue} />
        <Text style={styles.actionBtnText}>Ajustes</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const status = useEmergencyStore((state) => state.status);
  const { fetchLocation } = useGeolocation();
  const { cancelAlert } = usePanicAlert();

  useEffect(() => {
    if (status === 'counting') {
      router.push('/modal');
    }
  }, [status, router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightBackground} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ALERTA RÁPIDA</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.centerArea}>
          <StatusIndicator status={status} />
          <PanicButton />
          <Text style={styles.instructions}>
            Mantener presionado para activar
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

          {status === 'idle' && <BottomActions />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    color: COLORS.darkText,
    fontSize: FONT_SIZES.lg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 1,
  },
  instructions: {
    color: COLORS.mediumGray,
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xl,
    fontWeight: TYPOGRAPHY.fontWeightRegular,
  },
  footer: {
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  cancelBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    fontSize: FONT_SIZES.md,
    letterSpacing: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primaryBlue,
    backgroundColor: 'transparent',
  },
  actionBtnText: {
    color: COLORS.primaryBlue,
    fontSize: FONT_SIZES.md,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});
