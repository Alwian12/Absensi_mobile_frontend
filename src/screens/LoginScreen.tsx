import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api'; // Import konfigurasi axios kita
import { useAppStore } from '../state/AppStore';
import { colors } from '../components/Theme';

const LoginScreen = () => {
  const { signIn } = useAppStore();
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
      let response;
      
      // Menembak API Backend sesuai tipe user
      if (loginType === 'admin') {
        response = await api.post('/api/auth/admin/login', {
          username: username.trim(),
          password: password
        });
      } else {
        response = await api.post('/api/auth/login', {
          nama: username.trim(), // Sesuai dengan field di backend web
          password: password
        });
      }

      const { token, user, message } = response.data;

      // 1. Simpan Token dan Data User ke Storage HP (Sesi Persisten)
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('userRole', loginType);

      Alert.alert('Sukses', message || 'Login Berhasil!');
      
      // 2. Ubah State Global untuk pindah ke halaman Dashboard
      signIn(loginType === 'admin' ? 'admin' : 'employee');

    } catch (error: any) {
      // Tangkap pesan error spesifik dari backend (misal: "Nama atau password salah")
      const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server. Pastikan backend menyala.';
      Alert.alert('Login Gagal', errorMessage);
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Absensi Honor Kantor</Text>
          <Text style={styles.subtitle}>Login Sistem Absensi</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, loginType === 'user' && styles.tabActiveUser]}
            onPress={() => setLoginType('user')}>
            <Text style={[styles.tabText, loginType === 'user' && styles.tabTextActiveUser]}>
              Pegawai Honor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, loginType === 'admin' && styles.tabActiveAdmin]}
            onPress={() => setLoginType('admin')}>
            <Text style={[styles.tabText, loginType === 'admin' && styles.tabTextActiveAdmin]}>
              Administrator
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {loginType === 'admin' ? 'Username Admin' : 'Nama Lengkap'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={loginType === 'admin' ? "Masukkan username" : "Masukkan nama lengkap"}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginBtn, loginType === 'admin' && styles.loginBtnAdmin]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>
              {loginType === 'admin' ? 'Login Admin' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brandSoft, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: '900', color: colors.brandDark, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 4 },
  divider: { width: 80, height: 4, backgroundColor: colors.brand, borderRadius: 2, marginTop: 12 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabActiveUser: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  tabActiveAdmin: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  tabText: { fontWeight: 'bold', color: colors.muted },
  tabTextActiveUser: { color: colors.brand },
  tabTextActiveAdmin: { color: '#9333ea' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.ink, marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: colors.line, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.ink },
  loginBtn: { backgroundColor: colors.brand, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  loginBtnAdmin: { backgroundColor: '#9333ea' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});