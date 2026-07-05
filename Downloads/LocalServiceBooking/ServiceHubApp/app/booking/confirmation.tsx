import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{
    bookingId: string;
    providerName: string;
    providerCategory: string;
    serviceDate: string;
    serviceTime: string;
    totalAmount: string;
    paymentMethod: string;
  }>();

  const steps = [
    { label: 'Booking Confirmed', desc: 'Your booking has been received', done: true },
    { label: 'Provider Notified', desc: `${params.providerName} will confirm shortly`, done: true },
    { label: 'Service Scheduled', desc: `${params.serviceDate} at ${params.serviceTime}`, done: false },
    { label: 'Service Complete', desc: 'Rate your experience afterward', done: false },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success animation */}
        <View style={styles.successSection}>
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={52} color="#fff" />
            </View>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSub}>
            Your booking with {params.providerName} has been confirmed successfully.
          </Text>
          <View style={styles.bookingIdBadge}>
            <Ionicons name="receipt-outline" size={14} color={colors.outline} />
            <Text style={styles.bookingIdText}>#{params.bookingId?.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Booking details */}
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Booking Details</Text>

          {[
            { icon: 'person-outline', label: 'Provider', value: params.providerName },
            { icon: 'briefcase-outline', label: 'Service', value: params.providerCategory },
            { icon: 'calendar-outline', label: 'Date', value: params.serviceDate },
            { icon: 'time-outline', label: 'Time', value: params.serviceTime },
            { icon: 'card-outline', label: 'Payment', value: params.paymentMethod },
            { icon: 'cash-outline', label: 'Total Paid', value: `$${params.totalAmount}` },
          ].map((item, idx, arr) => (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name={item.icon as any} size={17} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
              {idx < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>What's Next</Text>
          {steps.map((step, idx) => (
            <View key={step.label} style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineCircle, step.done ? styles.timelineCircleDone : styles.timelineCirclePending]}>
                  {step.done
                    ? <Ionicons name="checkmark" size={14} color="#fff" />
                    : <View style={styles.timelineDot} />
                  }
                </View>
                {idx < steps.length - 1 && (
                  <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, step.done && { color: colors.primary }]}>{step.label}</Text>
                <Text style={styles.timelineDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(tabs)/bookings')}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.secondaryBtnText}>View My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 20, paddingBottom: 36 },
  successSection: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  successRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.success + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  successCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.lg,
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginTop: 8 },
  successSub: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  bookingIdBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.outlineVariant,
  },
  bookingIdText: { fontSize: 13, fontWeight: '600', color: colors.outline, letterSpacing: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, ...shadow.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  detailIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.primaryFixed, alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.outlineVariant + '40' },
  timelineCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, ...shadow.sm },
  timelineStep: { flexDirection: 'row', gap: 14, minHeight: 56 },
  timelineLeft: { alignItems: 'center', width: 24 },
  timelineCircle: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineCircleDone: { backgroundColor: colors.primary },
  timelineCirclePending: { backgroundColor: colors.outlineVariant },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surface },
  timelineLine: { flex: 1, width: 2, backgroundColor: colors.outlineVariant, marginVertical: 3 },
  timelineLineDone: { backgroundColor: colors.primary },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  timelineDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  actions: { gap: 12 },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  primaryBtn: {
    height: 52, borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.lg,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: colors.onPrimary },
});
