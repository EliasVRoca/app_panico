import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { COLORS, FONT_SIZES, TYPOGRAPHY } from '../constants/theme';

export default function SplashScreen() {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        setTimeout(() => {
          if (token) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }
        }, 2000);
      } catch (error) {
        setTimeout(() => {
            router.replace('/(auth)/login');
        }, 2000);
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VIGIA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: FONT_SIZES.hero,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primaryOrange,
    letterSpacing: 2,
  },
});
