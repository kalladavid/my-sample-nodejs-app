import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../lib/theme';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'booking',
    icon: 'checkmark-circle',
    color: colors.success,
    title: 'Booking Confirmed',
    body: 'Your booking with Alex Johnson for Electrical service has been confirmed.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    icon: 'alarm',
    color: colors.primary,
    title: 'Service Tomorrow',
    body: 'Reminder: Sarah Miller (Plumbing) is scheduled tomorrow at 10:00 AM.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    type: 'promo',
    icon: 'pricetag',
    color: '#F59E0B',
    title: 'Weekend Special!',
    body: 'Get 20% off on all cleaning services this weekend. Limited slots available.',
    time: '3 hrs ago',
    read: true,
  },
  {
    id: '4',
    type: 'review',
    icon: 'star',
    color: '#F59E0B',
    title: 'Rate Your Experience',
    body: 'How was your service with David Chen? Tap to leave a review.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    icon: 'shield-checkmark',
    color: colors.secondary,
    title: 'Account Verified',
    body: 'Your ServiceHub account has been successfully verified.',
    time: '2 days ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : <View style={{ width: 38 }} />}
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.notifCard, !item.read && styles.notifCardUnread]}>
            <View style={[styles.notifIcon, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <View style={styles.notifTitleRow}>
                <Text style={[styles.notifTitle, !item.read && { color: colors.primary }]}>{item.title}</Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={52} color={colors.outlineVariant} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
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
  badge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  list: { padding: 16, gap: 10 },
  notifCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: 14, ...shadow.sm,
  },
  notifCardUnread: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  notifIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  notifBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  notifTime: { fontSize: 11, color: colors.outline, marginTop: 2 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 16, color: colors.textSecondary },
});
