import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user!.id, full_name: fullName, phone }, { onConflict: 'id' });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      await refreshProfile();
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive', onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{profile?.full_name ?? 'Service User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={colors.outline}
              />
            ) : (
              <Text style={styles.value}>{profile?.full_name ?? '—'}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email ?? '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your phone number"
                placeholderTextColor={colors.outline}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{profile?.phone ?? '—'}</Text>
            )}
          </View>

          {editing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          )}
        </View>

        {/* Menu items */}
        <View style={styles.menuCard}>
          {[
            { icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/notifications') },
            { icon: 'location-outline', label: 'Saved Addresses', onPress: () => {} },
            { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
            { icon: 'shield-outline', label: 'Privacy Policy', onPress: () => {} },
          ].map((item, idx, arr) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.outline} />
              </TouchableOpacity>
              {idx < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  editBtn: { fontSize: 15, fontWeight: '600', color: colors.primary },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  avatarSection: { alignItems: 'center', paddingVertical: 16, gap: 6 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.md,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  userEmail: { fontSize: 14, color: colors.textSecondary },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 0, ...shadow.sm },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  field: { paddingVertical: 12 },
  label: { fontSize: 12, fontWeight: '500', color: colors.outline, marginBottom: 4 },
  value: { fontSize: 15, color: colors.textPrimary },
  input: {
    fontSize: 15, color: colors.textPrimary,
    borderWidth: 1, borderColor: colors.primary,
    borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8,
  },
  divider: { height: 1, backgroundColor: colors.outlineVariant + '40' },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: colors.onPrimary },
  menuCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 4, ...shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  menuIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.error + '30',
    ...shadow.sm,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.error },
});
