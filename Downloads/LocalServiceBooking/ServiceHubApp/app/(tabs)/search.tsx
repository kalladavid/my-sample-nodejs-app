import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';

const CATEGORIES = [
  { id: 'Cleaning', label: 'Cleaning', icon: 'sparkles', color: '#22C55E' },
  { id: 'Plumbing', label: 'Plumbing', icon: 'water', color: '#3B82F6' },
  { id: 'Electrical', label: 'Electrical', icon: 'flash', color: '#F59E0B' },
  { id: 'AC Repair', label: 'AC Repair', icon: 'thermometer', color: '#06B6D4' },
  { id: 'Painting', label: 'Painting', icon: 'color-palette', color: '#8B5CF6' },
  { id: 'Gardening', label: 'Gardening', icon: 'leaf', color: '#10B981' },
  { id: 'Moving', label: 'Moving', icon: 'car', color: '#F97316' },
  { id: 'Handyman', label: 'Handyman', icon: 'construct', color: '#6B7280' },
  { id: 'Appliance', label: 'Appliance', icon: 'hardware-chip', color: '#EC4899' },
  { id: 'Beauty', label: 'Beauty', icon: 'cut', color: '#D946EF' },
  { id: 'Tutoring', label: 'Tutoring', icon: 'school', color: '#2563EB' },
  { id: 'Security', label: 'Security', icon: 'shield-checkmark', color: '#DC2626' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const filtered = query
    ? CATEGORIES.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : CATEGORIES;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Services</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={colors.outline} style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a service..."
          placeholderTextColor={colors.outline}
          value={query}
          onChangeText={setQuery}
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.outline} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {filtered.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/providers/list', params: { category: cat.id } })}
          >
            <View style={[styles.cardIcon, { backgroundColor: cat.color + '18' }]}>
              <Ionicons name={cat.icon as any} size={32} color={cat.color} />
            </View>
            <Text style={styles.cardLabel}>{cat.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.outline} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 14,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  grid: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadow.sm,
  },
  cardIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
});
