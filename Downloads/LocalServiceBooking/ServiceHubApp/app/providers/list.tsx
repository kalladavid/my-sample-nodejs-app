import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ActivityIndicator, TextInput,
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
  image_url: string;
};

export default function ProviderListScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [category]);

  const fetchProviders = async () => {
    setLoading(true);
    let query = supabase.from('providers').select('*').eq('is_available', true);
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('rating', { ascending: false });
    if (!error && data) setProviders(data);
    setLoading(false);
  };

  const filtered = search
    ? providers.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.specialty.toLowerCase().includes(search.toLowerCase())
      )
    : providers;

  const renderItem = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id } })}
    >
      <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={12} color="#F59E0B" />
        <Text style={styles.ratingText}>{item.rating?.toFixed(1)}</Text>
        <Text style={styles.reviewCount}>({item.reviews_count})</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
          </View>
          <Text style={styles.rate}>${item.hourly_rate}/hr</Text>
        </View>
        <View style={styles.availRow}>
          <Ionicons name="time-outline" size={14} color={colors.outline} />
          <Text style={styles.avail}>{item.availability}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push({ pathname: '/providers/[id]', params: { id: item.id } })}
        >
          <Text style={styles.bookBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category === 'all' ? 'All Providers' : category}</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color={colors.outline} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers..."
          placeholderTextColor={colors.outline}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.count}>{filtered.length} professional{filtered.length !== 1 ? 's' : ''} found</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="person-outline" size={48} color={colors.outlineVariant} />
              <Text style={styles.emptyText}>No providers found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16, marginVertical: 12,
    paddingHorizontal: 14, height: 46,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.outlineVariant,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  count: { paddingHorizontal: 20, paddingBottom: 8, fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40 },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow.sm },
  cardImage: { width: '100%', height: 160 },
  ratingBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  reviewCount: { fontSize: 11, color: colors.textSecondary },
  cardBody: { padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  specialty: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  rate: { fontSize: 16, fontWeight: '700', color: colors.primary },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  avail: { fontSize: 13, color: colors.outline },
  bookBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md, height: 42,
    alignItems: 'center', justifyContent: 'center',
  },
  bookBtnText: { fontSize: 14, fontWeight: '600', color: colors.onPrimary },
});
