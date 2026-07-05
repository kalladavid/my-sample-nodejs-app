import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { locationStore } from '../../lib/locationStore';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'card', desc: 'Visa, Mastercard, Amex' },
  { id: 'upi', label: 'UPI / Net Banking', icon: 'phone-portrait', desc: 'Instant transfer' },
  { id: 'cash', label: 'Cash on Service', icon: 'cash', desc: 'Pay when done' },
];

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    providerId: string;
    providerName: string;
    providerCategory: string;
    providerRate: string;
    serviceDate: string;
    serviceTime: string;
  }>();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [serviceAddress, setServiceAddress] = useState(locationStore.getAddress());

  // Refresh address whenever this screen comes back into focus (after map picker)
  useFocusEffect(
    useCallback(() => {
      setServiceAddress(locationStore.getAddress());
    }, [])
  );

  const rate = parseFloat(params.providerRate ?? '0');
  const serviceFee = rate * 0.1;
  const total = rate + serviceFee;

  const handlePay = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first.');
      return;
    }
    if (!serviceAddress) {
      Alert.alert('Address Required', 'Please pick a service location on the map.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from('bookings').insert({
      user_id: user.id,
      provider_id: params.providerId,
      provider_name: params.providerName,
      provider_category: params.providerCategory,
      provider_rate: rate,
      service_date: params.serviceDate,
      service_time: params.serviceTime,
      service_address: serviceAddress,
      status: 'confirmed',
      payment_method: selectedMethod,
      total_amount: total,
    }).select().single();

    setLoading(false);
    if (error) {
      Alert.alert('Booking Failed', error.message);
    } else {
      router.replace({
        pathname: '/booking/confirmation',
        params: { bookingId: data.id, ...params, totalAmount: String(total.toFixed(2)), paymentMethod: selectedMethod },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Ionicons name="person-outline" size={16} color={colors.primary} />
            <Text style={styles.summaryLabel}>Provider</Text>
            <Text style={styles.summaryValue}>{params.providerName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{params.providerCategory}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{params.serviceDate}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{params.serviceTime}</Text>
          </View>
          <View style={styles.divider} />
          {/* Address picker row */}
          <TouchableOpacity
            style={styles.summaryRow}
            onPress={() => router.push('/location/picker')}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.summaryLabel}>Address</Text>
            <View style={styles.addressCell}>
              {serviceAddress ? (
                <Text style={styles.summaryValue} numberOfLines={1}>{serviceAddress}</Text>
              ) : (
                <Text style={styles.addressPlaceholder}>Tap to pick on map</Text>
              )}
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Price breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service rate (1 hr)</Text>
            <Text style={styles.priceValue}>${rate.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform fee (10%)</Text>
            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.methodSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.methodCardSelected]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodIconBox}>
                <Ionicons name={method.icon as any} size={22} color={selectedMethod === method.id ? colors.primary : colors.onSurfaceVariant} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodLabel, selectedMethod === method.id && { color: colors.primary }]}>
                  {method.label}
                </Text>
                <Text style={styles.methodDesc}>{method.desc}</Text>
              </View>
              <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]}>
                {selectedMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Secure notice */}
        <View style={styles.secureNotice}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.secureText}>Your payment is encrypted and secure. You pay only after service completion.</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <>
              <Text style={styles.payBtnText}>Confirm & Pay</Text>
              <Ionicons name="lock-closed" size={16} color={colors.onPrimary} />
            </>
          )}
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
  content: { padding: 16, gap: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 0, ...shadow.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  summaryLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.outlineVariant + '40' },
  priceCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 10, ...shadow.sm },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 14, color: colors.textPrimary },
  totalRow: {
    paddingTop: 12, marginTop: 4,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  methodSection: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: 14, borderWidth: 1.5, borderColor: colors.outlineVariant,
    ...shadow.sm,
  },
  methodCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryFixed },
  methodIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
  },
  methodLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  methodDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  addressCell: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  addressPlaceholder: { fontSize: 13, color: colors.primary, fontStyle: 'italic' },
  secureNotice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#F0FDF4', borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: colors.success + '30',
  },
  secureText: { flex: 1, fontSize: 13, color: colors.success, lineHeight: 18 },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant + '40',
    ...shadow.md,
  },
  footerTotal: { gap: 2 },
  footerTotalLabel: { fontSize: 12, color: colors.textSecondary },
  footerTotalAmount: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  payBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', gap: 8,
    ...shadow.lg,
  },
  payBtnText: { fontSize: 15, fontWeight: '700', color: colors.onPrimary },
});
