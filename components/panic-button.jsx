import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEmergencyStore } from '@/store/emergencyStore';
import { COLORS, FONT_SIZES, TYPOGRAPHY } from '@/constants/theme';

export const PanicButton = ({ onActivated }) => {
  const status = useEmergencyStore((state) => state.status);
  const startCountdown = useEmergencyStore((state) => state.startCountdown);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    startCountdown();
    if (onActivated) {
        onActivated();
    }
  };

  const isCounting = status === 'counting';
  const isSending = status === 'sending';

  const buttonColor = isCounting
    ? COLORS.secondaryOrange
    : isSending
      ? COLORS.secondaryBlue
      : status === 'success'
        ? COLORS.success
        : status === 'error'
          ? COLORS.error
          : COLORS.primaryOrange;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.shimmer, 
          { 
            transform: [{ scale: pulseAnim }], 
            opacity: status === 'idle' ? 0.4 : 0 
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
          <Text style={styles.sosText}>SOS</Text>
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
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.secondaryOrange,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  sosText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.mega,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 2,
  },
});
