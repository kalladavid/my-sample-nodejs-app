import { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const checkAuth = async () => {
      await new Promise(r => setTimeout(r, 2200));
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    };

    checkAuth();
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.bg} />
      <View style={styles.center}>
        <View style={styles.logoBox}>
          <Ionicons name="handshake" size={48} color={colors.onPrimaryContainer} />
        </View>
        <Text style={styles.brand}>ServiceHub</Text>
        <Text style={styles.tagline}>Professional services, personally delivered.</Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: barWidth }]} />
        </View>
        <Text style={styles.loadingText}>SECURING CONNECTION...</Text>
      </View>

      <Text style={styles.footer}>✓ Trusted by 50k+ Neighbors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
  },
  center: {
    alignItems: 'center',
    gap: 16,
  },
  logoBox: {
    width: 96,
    height: 96,
    backgroundColor: colors.primaryContainer,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 80,
    width: '60%',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.outline,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    fontSize: 12,
    color: colors.outline,
  },
});
