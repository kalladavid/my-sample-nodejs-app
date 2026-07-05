import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';
import { supabase } from '../../lib/supabase';

type Provider = {
  id: string;
  name: string;
  category: string;
  specialty: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  availability: string;
  bio: string;
  image_url: string;
};

const REVIEWS = [
  { id: 1, author: 'Maria S.', rating: 5, text: 'Excellent work! Very professional and efficient.', date: 'Jun 2025' },
  { id: 2, author: 'James K.', rating: 4, text: 'Great service, arrived on time and did a fantastic job.', date: 'May 2025' },
  { id: 3, author: 'Priya M.', rating: 5, text: 'Highly recommend! Will definitely book again.', date: 'Apr 2025' },
];

export default function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    const { data, error } = await supabase.from('providers').select('*').eq('id', id).single();
    if (!error && data) setProvider(data);
    setLoading(false);
  };

  const handleBookNow = () => {
    if (!provider) return;
    router.push({
      pathname: '/booking/datetime',
      params: {
        providerId: provider.id,
        providerName: provider.name,
        providerCategory: provider.category,
        providerRate: String(provider.hourly_rate),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.loadingCenter}>
        <Text style={{ color: colors.textSecondary }}>Provider not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Back button overlay */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Hero image */}
        <Image source={{ uri: provider.image_url }} style={styles.heroImage} />

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{provider.name}</Text>
              <Text style={styles.specialty}>{provider.specialty}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingNum}>{provider.rating?.toFixed(1)}</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.reviews_count}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${provider.hourly_rate}</Text>
              <Text style={styles.statLabel}>Per Hour</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3+</Text>
              <Text style={styles.statLabel}>Yrs Exp.</Text>
            </View>
          </View>

          {/* Category & Availability */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="briefcase-outline" size={13} color={colors.primary} />
              <Text style={styles.badgeText}>{provider.category}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#F0FDF4', borderColor: colors.success + '30' }]}>
              <Ionicons name="time-outline" size={13} color={colors.success} />
              <Text style={[styles.badgeText, { color: colors.success }]}>{provider.availability}</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{provider.bio}</Text>
          </View>

          {/* Verified badges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Credentials</Text>
            <View style={styles.credRow}>
              {['Background Checked', 'ID Verified', 'Licensed & Insured'].map((c) => (
                <View key={c} style={styles.credItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.credText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.ratingSum}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingSumText}>{provider.rating?.toFixed(1)} ({provider.reviews_count})</Text>
              </View>
            </View>
            {REVIEWS.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.author[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <View style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons key={i} name="star" size={12} color={i < r.rating ? '#F59E0B' : colors.outlineVariant} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed Book Now button */}
      <View style={styles.bookBar}>
        <View>
          <Text style={styles.bookBarPrice}>${provider.hourly_rate}<Text style={styles.bookBarPriceSub}>/hr</Text></Text>
          <Text style={styles.bookBarAvail}>{provider.availability}</Text>
        </View>
        <TouchableOpacity style={styles.bookNowBtn} onPress={handleBookNow}>
          <Text style={styles.bookNowText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    ...shadow.sm,
  },
  shareBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    ...shadow.sm,
  },
  heroImage: { width: '100%', height: 260, backgroundColor: colors.surfaceContainerHighest },
  profileCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    ...shadow.sm,
  },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  name: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  specialty: { fontSize: 14, color: colors.textSecondary, marginTop: 3 },
  ratingBox: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.md,
  },
  ratingNum: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: colors.background, borderRadius: radius.lg, padding: 16, marginBottom: 16,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statDivider: { width: 1, backgroundColor: colors.outlineVariant },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.primaryFixed, borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.primary + '20',
  },
  badgeText: { fontSize: 13, fontWeight: '500', color: colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  bio: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  credRow: { gap: 8 },
  credItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  credText: { fontSize: 14, color: colors.textPrimary },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  ratingSum: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingSumText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  reviewCard: {
    backgroundColor: colors.background, borderRadius: radius.lg, padding: 14,
    marginBottom: 10, gap: 8,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  reviewAuthor: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  stars: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewDate: { fontSize: 12, color: colors.outline },
  reviewText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  bookBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant + '40',
    ...shadow.md,
  },
  bookBarPrice: { fontSize: 22, fontWeight: '700', color: colors.primary },
  bookBarPriceSub: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  bookBarAvail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: radius.lg,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    ...shadow.lg,
  },
  bookNowText: { fontSize: 15, fontWeight: '700', color: colors.onPrimary },
});
