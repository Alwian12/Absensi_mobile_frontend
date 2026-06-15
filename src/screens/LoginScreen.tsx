import React, {useState} from 'react';
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

import {Button, Field} from '../components/FormControls';
import {Icon} from '../components/Icon';
import {colors, radius, shadows} from '../components/Theme';
import {useAppStore} from '../state/AppStore';
import api from '../utils/api';

const LoginScreen = () => {
  const {signIn} = useAppStore();
  const {width} = useWindowDimensions();
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

      const {token, user, message} = response.data;

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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.shell, isWide && styles.shellWide]}>
          <View style={[styles.brandPanel, isWide && styles.brandPanelWide]}>
            <View style={styles.brandMark}>
              <Icon name="shield" color={colors.white} size={30} strokeWidth={2.4} />
            </View>
            <Text style={styles.brandEyebrow}>SIAP Absensi Kantor</Text>
            <Text style={styles.brandTitle}>Absensi Honor Kantor</Text>
            <Text style={styles.brandText}>
              Masuk, pantau kehadiran, ajukan izin, dan sinkronkan data kantor
              dalam satu aplikasi.
            </Text>
            <View style={styles.brandStats}>
              <MiniStat label="GPS" value="Aktif" />
              <MiniStat label="Foto" value="Selfie" />
              <MiniStat label="Data" value="Online" />
            </View>
          </View>

          <View style={[styles.card, isWide && styles.cardWide]}>
            <Text style={styles.formTitle}>Masuk ke akun</Text>
            <Text style={styles.formSubtitle}>
              Pilih role sesuai akses yang diberikan admin kantor.
            </Text>

            <View style={styles.roleSwitch}>
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
            </View>

            <View style={styles.formGap}>
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
                />
              </View>

              <View>
                <Text style={styles.label}>Password</Text>
                <Field
                  placeholder="Masukkan password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <Button
              label={loading ? 'Memproses...' : 'Masuk Sekarang'}
              icon="logIn"
              loading={loading}
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.footerNote}>
              <Icon name="check" color={colors.brand} size={17} strokeWidth={2.4} />
              <Text style={styles.footerText}>
                Sesi disimpan aman di perangkat setelah login berhasil.
              </Text>
            </View>
          </View>
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
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.roleTab,
      active && styles.roleTabActive,
      pressed && styles.pressed,
    ]}>
    <Icon
      name={icon}
      size={18}
      color={active ? colors.brandDark : colors.muted}
      strokeWidth={2.3}
    />
    <Text style={[styles.roleTabText, active && styles.roleTabTextActive]}>
      {label}
    </Text>
  </Pressable>
);

const MiniStat = ({label, value}: {label: string; value: string}) => (
  <View style={styles.miniStat}>
    <Text style={styles.miniStatLabel}>{label}</Text>
    <Text style={styles.miniStatValue}>{value}</Text>
  </View>
);

export default LoginScreen;

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: colors.soft,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 18,
  },
  shell: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    gap: 14,
  },
  shellWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  brandPanel: {
    backgroundColor: colors.graphite,
    borderRadius: radius.md,
    padding: 22,
    overflow: 'hidden',
  },
  brandPanelWide: {
    flex: 1,
    minHeight: 500,
    justifyContent: 'space-between',
  },
  brandMark: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  brandEyebrow: {
    color: '#9AE6DD',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  brandTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 10,
  },
  brandText: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  brandStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 28,
  },
  miniStat: {
    minWidth: 86,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  miniStatLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  miniStatValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 22,
    ...shadows.lift,
  },
  cardWide: {
    width: 420,
    justifyContent: 'center',
  },
  formTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  formSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F5',
    borderRadius: radius.md,
    padding: 4,
    gap: 6,
    marginTop: 24,
  },
  roleTab: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  roleTabActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  roleTabText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  roleTabTextActive: {
    color: colors.brandDark,
  },
  formGap: {
    gap: 14,
    marginTop: 20,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 22,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    padding: 12,
    marginTop: 16,
  },
  footerText: {
    flex: 1,
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  pressed: {
    opacity: 0.76,
  },
});
