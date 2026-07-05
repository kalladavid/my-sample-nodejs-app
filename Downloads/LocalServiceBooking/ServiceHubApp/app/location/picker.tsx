import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, FlatList, Keyboard, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';
import { locationStore } from '../../lib/locationStore';

interface Place {
  displayName: string;
  shortName: string;
  subtext: string;
  lat: string;
  lon: string;
}

async function searchNominatim(query: string): Promise<Place[]> {
  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ServiceHubApp/1.0', 'Accept-Language': 'en' },
  });
  if (!res.ok) return [];
  const data: any[] = await res.json();
  return data.map((item) => {
    const a = item.address || {};
    const shortName =
      a.house_number && a.road
        ? `${a.house_number} ${a.road}`
        : a.road || a.neighbourhood || a.suburb || item.display_name.split(',')[0];
    const subtext = [a.city || a.town || a.village, a.state, a.country]
      .filter(Boolean)
      .join(', ');
    return {
      displayName: item.display_name,
      shortName,
      subtext,
      lat: item.lat,
      lon: item.lon,
    };
  });
}

export default function LocationPickerScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const existing = locationStore.getAddress();
    if (existing) {
      setQuery(existing);
      setSelected({
        displayName: existing,
        shortName: existing.split(',')[0],
        subtext: existing.split(',').slice(1).join(',').trim(),
        lat: '0', lon: '0',
      });
    }
  }, []);

  const runSearch = async (text: string) => {
    if (text.trim().length < 3) { setResults([]); return; }
    setSearching(true);
    try {
      const places = await searchNominatim(text);
      setResults(places);
    } catch (_) {
      setResults([]);
    }
    setSearching(false);
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(text), 600);
  };

  const handleSelect = (place: Place) => {
    Keyboard.dismiss();
    setSelected(place);
    setQuery(place.displayName);
    setResults([]);
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    setSelected(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleConfirm = () => {
    if (!selected) return;
    locationStore.setAddress(selected.displayName);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pick Service Location</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.primary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Type your address or area…"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={handleQueryChange}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="search"
            onSubmitEditing={() => runSearch(query)}
            autoFocus
          />
          {searching ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : query.length > 0 ? (
            <TouchableOpacity onPress={clearInput} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.searchHint}>Powered by OpenStreetMap — no sign-in needed</Text>
      </View>

      {/* Results list */}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(_, i) => String(i)}
          keyboardShouldPersistTaps="handled"
          style={styles.resultsList}
          contentContainerStyle={{ paddingBottom: 12 }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultRow}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <View style={styles.resultIcon}>
                <Ionicons name="location" size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultMain} numberOfLines={1}>{item.shortName}</Text>
                <Text style={styles.resultSub} numberOfLines={1}>{item.subtext}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Selected card */}
      {selected && results.length === 0 && (
        <View style={styles.selectedWrap}>
          <View style={styles.selectedCard}>
            {/* Decorative header */}
            <View style={styles.mapPreview}>
              <View style={styles.gridRow}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.gridCell} />
                ))}
              </View>
              <View style={styles.gridRow}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={[styles.gridCell, i === 2 && styles.gridCellRoad]} />
                ))}
              </View>
              <View style={styles.gridRow}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.gridCell} />
                ))}
              </View>
              <View style={styles.pinWrap}>
                <Ionicons name="location" size={40} color={colors.primary} />
              </View>
              <View style={styles.pulseOuter}>
                <View style={styles.pulseInner} />
              </View>
            </View>

            {/* Address details */}
            <View style={styles.selectedBody}>
              <View style={styles.selectedTitleRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.selectedConfirmed}>Location confirmed</Text>
              </View>
              <Text style={styles.selectedShort}>{selected.shortName}</Text>
              {selected.subtext ? (
                <Text style={styles.selectedSub}>{selected.subtext}</Text>
              ) : null}
              <TouchableOpacity style={styles.changeBtn} onPress={clearInput}>
                <Ionicons name="refresh" size={14} color={colors.primary} />
                <Text style={styles.changeBtnText}>Search a different location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Empty / hint state */}
      {!selected && results.length === 0 && !searching && (
        <View style={styles.hint}>
          <View style={styles.hintCircle}>
            <Ionicons name="map-outline" size={52} color={colors.primary} />
          </View>
          <Text style={styles.hintTitle}>Where should the pro come?</Text>
          <Text style={styles.hintBody}>
            Type any address, landmark, or area above to search
          </Text>
        </View>
      )}

      {/* Confirm button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !selected && styles.confirmBtnOff]}
          onPress={handleConfirm}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
          <Text style={styles.confirmText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '40',
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },

  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '40',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.background,
    borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.primary + '60',
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 13 : 9,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  searchHint: { fontSize: 11, color: colors.textSecondary, marginTop: 6, marginLeft: 2 },

  resultsList: { flex: 1, backgroundColor: colors.surface },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  resultIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center', justifyContent: 'center',
  },
  resultMain: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  resultSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sep: { height: 1, backgroundColor: colors.outlineVariant + '40', marginLeft: 64 },

  selectedWrap: { flex: 1, padding: 16 },
  selectedCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.success + '50',
    ...shadow.md,
  },
  mapPreview: {
    height: 120, backgroundColor: '#EEF2FF',
    justifyContent: 'space-around', overflow: 'hidden',
    alignItems: 'center',
  },
  gridRow: { flexDirection: 'row', flex: 1, width: '100%' },
  gridCell: { flex: 1, borderWidth: 0.5, borderColor: '#C7D2FE44' },
  gridCellRoad: { backgroundColor: '#fff', opacity: 0.8 },
  pinWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  pulseOuter: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary + '15',
    borderWidth: 2, borderColor: colors.primary + '30',
  },
  pulseInner: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary + '30',
    position: 'absolute', alignSelf: 'center', top: 16,
  },
  selectedBody: { padding: 16, gap: 6 },
  selectedTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  selectedConfirmed: { fontSize: 13, fontWeight: '700', color: colors.success },
  selectedShort: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },
  selectedSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  changeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', marginTop: 8,
    backgroundColor: colors.primaryFixed, paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 99,
  },
  changeBtnText: { fontSize: 13, fontWeight: '600', color: colors.primary },

  hint: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32 },
  hintCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  hintTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  hintBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  footer: {
    paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 20, paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant + '40',
    ...shadow.lg,
  },
  confirmBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  confirmBtnOff: { backgroundColor: colors.outlineVariant },
  confirmText: { fontSize: 16, fontWeight: '700', color: colors.onPrimary },
});
