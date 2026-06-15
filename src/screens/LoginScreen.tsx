import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';

import { Button, Field } from '../components/FormControls';
import { Icon } from '../components/Icon';
import { colors, radius, shadows, spacing } from '../components/Theme';
import { useAppStore } from '../state/AppStore';
import api from '../utils/api';

const LoginScreen = () => {
  const { signIn } = useAppStore();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username/Nama dan Password wajib diisi!');
      return;
    }

    setLoading(true);

    try {
      const response =
        loginType === 'admin'
          ? await api.post('/api/auth/admin/login', {
              username: username.trim(),
              password,
            })
          : await api.post('/api/auth/login', {
              nama: username.trim(),
              password,
            });

      const { token, user, message } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('userRole', loginType);

      Alert.alert('Sukses', message || 'Login Berhasil!');
      signIn(loginType === 'admin' ? 'admin' : 'employee');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Gagal terhubung ke server. Pastikan backend menyala.';
      Alert.alert('Login Gagal', errorMessage);
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.shell, isWide && styles.shellWide]}>
          {/* Brand Panel - Left side */}
          <MotiView
            from={{ opacity: 0, translateX: -40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 700 }}
            style={[styles.brandPanel, isWide && styles.brandPanelWide]}
          >
            <MotiView
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 200 }}
            >
              <View style={styles.brandMark}>
                <Icon
                  name="shield"
                  color={colors.white}
                  size={30}
                  strokeWidth={2.4}
                />
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 300 }}
            >
              <Text style={styles.brandEyebrow}>SIAP Absensi Kantor</Text>
              <Text style={styles.brandTitle}>Absensi Honor Kantor</Text>
              <Text style={styles.brandText}>
                Masuk, pantau kehadiran, ajukan izin, dan sinkronkan data kantor
                dalam satu aplikasi.
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 400 }}
              style={styles.brandStats}
            >
              <MiniStat label="GPS" value="Aktif" />
              <MiniStat label="Foto" value="Selfie" />
              <MiniStat label="Data" value="Online" />
            </MotiView>
          </MotiView>

          {/* Login Card - Right side */}
          <MotiView
            from={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 700 }}
            style={[styles.card, isWide && styles.cardWide]}
          >
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 200 }}
            >
              <Text style={styles.formTitle}>Masuk ke akun</Text>
              <Text style={styles.formSubtitle}>
                Pilih role sesuai akses yang diberikan admin kantor.
              </Text>
            </MotiView>

            {/* Role Switch - Animated */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 300 }}
              style={styles.roleSwitch}
            >
              <RoleTab
                label="Pegawai"
                active={loginType === 'user'}
                icon="user"
                onPress={() => setLoginType('user')}
              />
              <RoleTab
                label="Admin"
                active={loginType === 'admin'}
                icon="shield"
                onPress={() => setLoginType('admin')}
              />
            </MotiView>

            {/* Form Fields - Staggered Animation */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 400 }}
              style={styles.formGap}
            >
              <View>
                <Text style={styles.label}>
                  {loginType === 'admin' ? 'Username Admin' : 'Nama Lengkap'}
                </Text>
                <Field
                  placeholder={
                    loginType === 'admin'
                      ? 'Masukkan username'
                      : 'Masukkan nama lengkap'
                  }
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize={loginType === 'admin' ? 'none' : 'words'}
                  icon="user"
                  variant="glass"
                />
              </View>

              <View>
                <Text style={styles.label}>Password</Text>
                <Field
                  placeholder="Masukkan password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="shield"
                  variant="glass"
                />
              </View>
            </MotiView>

            {/* Login Button - Animated */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 500 }}
            >
              <Button
                label={loading ? 'Memproses...' : 'Masuk Sekarang'}
                icon="logIn"
                loading={loading}
                onPress={handleLogin}
                style={styles.loginButton}
                size="lg"
              />
            </MotiView>

            {/* Footer Note - Animated */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 600 }}
              style={styles.footerNote}
            >
              <Icon
                name="check"
                color={colors.brand}
                size={17}
                strokeWidth={2.4}
              />
              <Text style={styles.footerText}>
                Sesi disimpan aman di perangkat setelah login berhasil.
              </Text>
            </MotiView>
          </MotiView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const RoleTab = ({
  label,
  active,
  icon,
  onPress,
}: {
  label: string;
  active: boolean;
  icon: 'user' | 'shield';
  onPress: () => void;
}) => (
  <MotiView
    animate={{
      scale: active ? 1.02 : 1,
    }}
    transition={{ type: 'timing', duration: 150 }}
  >
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.roleTab,
        active && styles.roleTabActive,
        pressed && styles.pressed,
      ]}
    >
      <Icon
        name={icon}
        size={18}
        color={active ? colors.brand : colors.muted}
        strokeWidth={2.3}
      />
      <Text style={[styles.roleTabText, active && styles.roleTabTextActive]}>
        {label}
      </Text>
    </Pressable>
  </MotiView>
);

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'timing', duration: 500 }}
  >
    <View style={styles.miniStat}>
      <Text style={styles.miniStatLabel}>{label}</Text>
      <Text style={styles.miniStatValue}>{value}</Text>
    </View>
  </MotiView>
);

export default LoginScreen;

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: colors.soft,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },

  shell: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    gap: spacing.lg,
  },

  shellWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // ========== BRAND PANEL ==========
  brandPanel: {
    backgroundColor: colors.graphite,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadows.lift,
  },

  brandPanelWide: {
    flex: 1,
    minHeight: 520,
    justifyContent: 'space-between',
  },

  brandMark: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.lift,
  },

  brandEyebrow: {
    color: '#A5F3FC',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  brandTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: spacing.md,
    lineHeight: 42,
  },

  brandText: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.md,
    fontWeight: '500',
  },

  brandStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },

  miniStat: {
    minWidth: 100,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: '#374151',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  miniStatLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  miniStatValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
    marginTop: spacing.xs,
  },

  // ========== LOGIN CARD ==========
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
    ...shadows.lift,
  },

  cardWide: {
    width: 420,
    justifyContent: 'center',
  },

  formTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 36,
  },

  formSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    fontWeight: '500',
  },

  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.panelAlt,
    borderRadius: radius.lg,
    padding: spacing.xs,
    gap: spacing.xs,
    marginTop: spacing.xl,
  },

  roleTab: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  roleTabActive: {
    backgroundColor: colors.surface,
    borderColor: colors.brand,
    ...shadows.card,
  },

  roleTabText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  roleTabTextActive: {
    color: colors.brand,
  },

  formGap: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },

  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  loginButton: {
    marginTop: spacing.xl,
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.brandSoft,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.brandLight,
  },

  footerText: {
    flex: 1,
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },

  pressed: {
    opacity: 0.75,
  },
});
