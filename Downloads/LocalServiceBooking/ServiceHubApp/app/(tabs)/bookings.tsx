import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type Booking = {
  id: string;
  provider_name: string;
  provider_category: string;
  service_date: string;
  service_time: string;
  status: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#EFF6FF', icon: 'checkmark-circle' },
  pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', icon: 'time' },
  completed: { label: 'Completed', color: '#22C55E', bg: '#F0FDF4', icon: 'checkmark-done-circle' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', icon: 'close-circle' },
  in_progress: { label: 'In Progress', color: '#8B5CF6', bg: '#F5F3FF', icon: 'reload-circle' },
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) setBookings(data);
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.categoryBadge}>
            <Ionicons name="briefcase-outline" size={14} color={colors.primary} />
            <Text style={styles.categoryText}>{item.provider_category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon as any} size={14} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <Text style={styles.providerName}>{item.provider_name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.outline} />
            <Text style={styles.metaText}>{formatDate(item.service_date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.outline} />
            <Text style={styles.metaText}>{item.service_time}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.amount}>${item.total_amount?.toFixed(2)}</Text>
          <View style={styles.payMethod}>
            <Ionicons name="card-outline" size={13} color={colors.outline} />
            <Text style={styles.payMethodText}>{item.payment_method}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity onPress={fetchBookings}>
          <Ionicons name="refresh-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={56} color={colors.outlineVariant} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyBody}>Book your first service to get started.</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.ctaBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  emptyBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  ctaBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.lg, marginTop: 8 },
  ctaBtnText: { fontSize: 14, fontWeight: '600', color: colors.onPrimary },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 10, ...shadow.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primaryFixed, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full,
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  providerName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.outlineVariant + '40',
  },
  amount: { fontSize: 18, fontWeight: '700', color: colors.primary },
  payMethod: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  payMethodText: { fontSize: 12, color: colors.outline, textTransform: 'capitalize' },
});
