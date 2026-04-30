import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS, FONT_SIZES, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { authService } from '@/services/authService';

const DEFAULT_MESSAGE = "¡EMERGENCIA! Necesito ayuda urgente.\nEsta es mi ubicación:";
const DEFAULT_TIME = 5;

export default function SettingsScreen() {
  const router = useRouter();
  const [emergencyMessage, setEmergencyMessage] = useState(DEFAULT_MESSAGE);
  const [countdownTime, setCountdownTime] = useState(DEFAULT_TIME);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedMessage = await AsyncStorage.getItem('emergencyMessage');
      const savedTime = await AsyncStorage.getItem('countdownTime');
      
      if (savedMessage !== null) {
        setEmergencyMessage(savedMessage);
      }
      if (savedTime !== null) {
        setCountdownTime(parseInt(savedTime, 10));
      }
    } catch (error) {
      console.error('Error loading settings', error);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('emergencyMessage', emergencyMessage);
      await AsyncStorage.setItem('countdownTime', countdownTime.toString());
      Alert.alert("Éxito", "Configuración guardada correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la configuración");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión");
            }
          }
        }
      ]
    );
  };

  const TimeButton = ({ time }: { time: number }) => {
    const isSelected = countdownTime === time;
    return (
      <TouchableOpacity 
        style={[
          styles.timeButton, 
          isSelected ? styles.timeButtonSelected : styles.timeButtonUnselected
        ]}
        onPress={() => setCountdownTime(time)}
      >
        <Text style={[
          styles.timeButtonText, 
          isSelected ? styles.timeButtonTextSelected : styles.timeButtonTextUnselected
        ]}>
          {time}s
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIGURACIÓN</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>MENSAJE DE EMERGENCIA</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={emergencyMessage}
              onChangeText={setEmergencyMessage}
              placeholder="Escribe tu mensaje aquí..."
              placeholderTextColor={COLORS.mediumGray}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>TIEMPO DE CUENTA REGRESIVA</Text>
            <View style={styles.timeButtonsContainer}>
              <TimeButton time={3} />
              <TimeButton time={5} />
              <TimeButton time={10} />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>INFORMACIÓN</Text>
            <Text style={styles.infoText}>
              La alerta se enviará automáticamente a todos tus contactos después del tiempo de cuenta regresiva. Puedes cancelarla en cualquier momento.
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={COLORS.error} />
            <Text style={styles.logoutBtnText}>CERRAR SESIÓN</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>GUARDAR CAMBIOS</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: COLORS.lightBackground,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.darkText,
    letterSpacing: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.mediumGray,
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: SPACING.md,
    height: 120,
    fontSize: FONT_SIZES.md,
    color: COLORS.darkText,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  timeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  timeButtonSelected: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
  },
  timeButtonUnselected: {
    backgroundColor: 'transparent',
    borderColor: '#C5CDD3',
  },
  timeButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  timeButtonTextSelected: {
    color: COLORS.white,
  },
  timeButtonTextUnselected: {
    color: COLORS.darkText,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primaryBlue,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkText,
    lineHeight: 20,
    fontWeight: TYPOGRAPHY.fontWeightRegular,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.lightBackground,
  },
  saveBtn: {
    backgroundColor: COLORS.success,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },
  logoutBtnText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});
