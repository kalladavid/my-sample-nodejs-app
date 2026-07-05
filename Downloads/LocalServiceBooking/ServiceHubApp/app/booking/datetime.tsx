import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DateTimeScreen() {
  const params = useLocalSearchParams<{
    providerId: string;
    providerName: string;
    providerCategory: string;
    providerRate: string;
  }>();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const calDays: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    router.push({
      pathname: '/booking/payment',
      params: {
        ...params,
        serviceDate: dateStr,
        serviceTime: selectedTime,
      },
    });
  };

  const canContinue = selectedDate !== null && selectedTime !== null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Date & Time</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Provider summary */}
      <View style={styles.providerBanner}>
        <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
        <View>
          <Text style={styles.bannerName}>{params.providerName}</Text>
          <Text style={styles.bannerSub}>{params.providerCategory} · ${params.providerRate}/hr</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calCard}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map((d) => <Text key={d} style={styles.dayHeader}>{d}</Text>)}
          </View>

          {/* Days grid */}
          <View style={styles.daysGrid}>
            {calDays.map((day, idx) => {
              if (!day) return <View key={idx} style={styles.dayCell} />;
              const disabled = isDisabled(day);
              const selected = selectedDate === day && viewMonth === viewMonth;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dayCell, selected && styles.dayCellSelected, disabled && styles.dayCellDisabled]}
                  onPress={() => !disabled && setSelectedDate(day)}
                  disabled={disabled}
                >
                  <Text style={[styles.dayText, selected && styles.dayTextSelected, disabled && styles.dayTextDisabled]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time slots */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Available Times</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeChip, selectedTime === slot && styles.timeChipSelected]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.timeChipText, selectedTime === slot && styles.timeChipTextSelected]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        {canContinue && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Selection</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.summaryText}>
                {MONTHS[viewMonth]} {selectedDate}, {viewYear}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time" size={16} color={colors.primary} />
              <Text style={styles.summaryText}>{selectedTime}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueBtnText}>Continue to Payment</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '40',
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  providerBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  bannerName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  bannerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  content: { padding: 16, gap: 20 },
  calCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, ...shadow.sm },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: colors.background },
  monthLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 50 },
  dayCellSelected: { backgroundColor: colors.primary },
  dayCellDisabled: { opacity: 0.3 },
  dayText: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  dayTextSelected: { color: '#fff', fontWeight: '700' },
  dayTextDisabled: { color: colors.outline },
  timeSection: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  timeChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipText: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },
  timeChipTextSelected: { color: '#fff', fontWeight: '700' },
  summaryCard: {
    backgroundColor: colors.primaryFixed,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryText: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant + '40',
  },
  continueBtn: {
    backgroundColor: colors.primary,
    height: 54, borderRadius: radius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    ...shadow.lg,
  },
  continueBtnDisabled: { backgroundColor: colors.outlineVariant, shadowOpacity: 0 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: colors.onPrimary },
});
