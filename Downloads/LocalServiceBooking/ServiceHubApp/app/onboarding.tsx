import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        {/* Floating icons */}
        <View style={[styles.floatIcon, { top: 40, left: 24 }]}>
          <Ionicons name="construct" size={36} color={colors.primaryContainer} style={{ opacity: 0.3 }} />
        </View>
        <View style={[styles.floatIcon, { bottom: 120, right: 24 }]}>
          <Ionicons name="sparkles" size={28} color={colors.secondary} style={{ opacity: 0.3 }} />
        </View>

        {/* Hero image */}
        <View style={styles.heroContainer}>
          <View style={styles.heroBg} />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.badgeText}>Verified Pro</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.headline}>Find Trusted Pros{'\n'}Near You</Text>
          <Text style={styles.body}>
            Connect with background-checked local professionals for cleaning, repair, and home maintenance in just a few taps.
          </Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Bottom actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/auth/signup')}>
          <Text style={styles.btnPrimaryText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnSecondaryText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  floatIcon: { position: 'absolute' },
  heroContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.surface,
    marginBottom: spacing.xl,
    position: 'relative',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryFixed,
    opacity: 0.1,
  },
  heroImage: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeText: { fontSize: 13, fontWeight: '500', color: colors.onSurface },
  content: { alignItems: 'center', gap: 10, marginBottom: 24 },
  headline: { fontSize: 24, fontWeight: '700', color: colors.onBackground, textAlign: 'center', letterSpacing: -0.3 },
  body: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.outlineVariant },
  dotActive: { width: 24, backgroundColor: colors.primary },
  footer: { paddingHorizontal: 24, paddingBottom: 36, gap: 12 },
  btnPrimary: {
    backgroundColor: colors.primaryContainer,
    height: 52,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '600', color: colors.onPrimary },
  btnSecondary: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: { fontSize: 15, fontWeight: '500', color: colors.primary },
});
