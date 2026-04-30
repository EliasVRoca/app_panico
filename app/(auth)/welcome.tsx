import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>VIGIA</Text>
        <Text style={styles.subtitle}>Botón de pánico</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: FONT_SIZES.mega,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primaryOrange,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primaryBlue,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  buttonContainer: {
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryOrange,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryOrange,
    marginTop: SPACING.md,
  },
  secondaryButtonText: {
    color: COLORS.primaryOrange,
    fontSize: FONT_SIZES.lg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
