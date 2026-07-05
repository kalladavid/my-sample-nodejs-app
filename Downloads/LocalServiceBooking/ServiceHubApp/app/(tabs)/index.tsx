import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { id: 'Cleaning', label: 'Cleaning', icon: 'sparkles' },
  { id: 'Plumbing', label: 'Plumbing', icon: 'water' },
  { id: 'Electrical', label: 'Electrical', icon: 'flash' },
  { id: 'AC Repair', label: 'AC Repair', icon: 'thermometer' },
  { id: 'Painting', label: 'Painting', icon: 'color-palette' },
  { id: 'Gardening', label: 'Gardening', icon: 'leaf' },
  { id: 'Moving', label: 'Moving', icon: 'car' },
  { id: 'Handyman', label: 'Handyman', icon: 'construct' },
];

const TOP_PROVIDERS = [
  { id: '1', name: 'Alex Johnson', specialty: 'Expert Electrician', rating: 4.9, rate: 45, availability: 'Mon – Fri', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80' },
  { id: '2', name: 'Sarah Miller', specialty: 'Master Plumber', rating: 5.0, rate: 55, availability: 'Available Today', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { id: '3', name: 'Emma Wilson', specialty: 'Cleaning Specialist', rating: 4.9, rate: 30, availability: 'Mon – Sat', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const { profile } = useAuth();

  const greeting = profile?.full_name ? `Hi, ${profile.full_name.split(' ')[0]}` : 'Hello';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.headerTitle}>Find a service</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={22} color={colors.onSurface} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Search bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What service do you need today?"
            placeholderTextColor={colors.outline}
            value={search}
            onChangeText={setSearch}
            onFocus={() => router.push('/(tabs)/search')}
          />
        </View>

        {/* Promo banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>LIMITED OFFER</Text>
            </View>
            <Text style={styles.promoHeadline}>20% Off{'\n'}Home Cleaning</Text>
            <Text style={styles.promoBody}>Book this weekend and save big.</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' }}
            style={styles.promoImage}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: '/providers/list', params: { category: cat.id } })}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={cat.icon as any} size={28} color={colors.primary} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top rated providers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Providers</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/providers/list', params: { category: 'all' } })}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TOP_PROVIDERS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 16, paddingRight: 4 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.providerCard}
                onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id, name: item.name } })}
              >
                <Image source={{ uri: item.image }} style={styles.providerImage} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <View style={styles.providerInfo}>
                  <View style={styles.providerNameRow}>
                    <View>
                      <Text style={styles.providerName}>{item.name}</Text>
                      <Text style={styles.providerSpecialty}>{item.specialty}</Text>
                    </View>
                    <Text style={styles.providerRate}>${item.rate}/hr</Text>
                  </View>
                  <View style={styles.providerMeta}>
                    <Ionicons name="time-outline" size={13} color={colors.outline} />
                    <Text style={styles.metaText}>{item.availability}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id } })}
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Trust section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why ServiceHub?</Text>
          <View style={styles.trustGrid}>
            {[
              { icon: 'shield-checkmark', color: colors.success, title: 'Vetted Professionals', desc: 'Every provider passes a rigorous background check.' },
              { icon: 'card', color: colors.primary, title: 'Secure Payments', desc: 'Pay safely after the job is done.' },
              { icon: 'headset', color: '#F59E0B', title: '24/7 Support', desc: 'Dedicated support team always ready.' },
            ].map((item) => (
              <View key={item.title} style={styles.trustCard}>
                <View style={[styles.trustIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={styles.trustTitle}>{item.title}</Text>
                <Text style={styles.trustDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  greeting: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  notifBtn: { position: 'relative', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: colors.error, borderRadius: 4 },
  content: { paddingBottom: 24 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 50,
    ...shadow.sm,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 140,
  },
  promoContent: { flex: 1, padding: 18, justifyContent: 'center', gap: 6 },
  promoBadge: { backgroundColor: '#F59E0B', borderRadius: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3 },
  promoBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  promoHeadline: { fontSize: 20, fontWeight: '700', color: '#fff', lineHeight: 26 },
  promoBody: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  promoImage: { width: 130, height: '100%' },
  section: { marginTop: 28, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  seeAll: { fontSize: 13, fontWeight: '600', color: colors.primary },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryItem: { width: '22%', alignItems: 'center', gap: 8 },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  categoryLabel: { fontSize: 12, fontWeight: '500', color: colors.textPrimary, textAlign: 'center' },
  providerCard: { width: 240, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow.sm },
  providerImage: { width: '100%', height: 140 },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  providerInfo: { padding: 14, gap: 8 },
  providerNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  providerName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  providerSpecialty: { fontSize: 13, color: colors.textSecondary, marginTop: 1 },
  providerRate: { fontSize: 15, fontWeight: '700', color: colors.primary },
  providerMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: colors.outline },
  bookBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: { fontSize: 13, fontWeight: '600', color: colors.onPrimary },
  trustGrid: { gap: 12, marginTop: 8 },
  trustCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadow.sm,
  },
  trustIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  trustTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  trustDesc: { fontSize: 12, color: colors.textSecondary, flex: 2, lineHeight: 18 },
});
