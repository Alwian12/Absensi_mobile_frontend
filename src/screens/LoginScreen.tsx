import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors} from '../components/Theme';
import {useAppStore} from '../state/AppStore';
import type {UserRole} from '../types/attendance';

const roles: Array<{
  role: UserRole;
  title: string;
  description: string;
}> = [
  {
    role: 'pegawai',
    title: 'Pegawai',
    description: 'Absen masuk, pulang, dan kirim pengajuan pribadi.',
  },
  {
    role: 'admin',
    title: 'Admin HR',
    description: 'Pantau absensi tim, laporan, dan data pengajuan.',
  },
  {
    role: 'atasan',
    title: 'Atasan',
    description: 'Review pengajuan dan pantau disiplin kehadiran.',
  },
];

const LoginScreen = () => {
  const {signIn} = useAppStore();
  const {width} = useWindowDimensions();
  const isWide = width >= 820;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brand} />
      <View style={[styles.page, isWide && styles.pageWide]}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SIAP Absensi Kantor</Text>
          <Text style={styles.title}>Absensi dengan bukti foto kerja</Text>
          <Text style={styles.subtitle}>
            Foto dipakai sebagai lampiran kehadiran, bukan verifikasi muka.
            Pilih role demo untuk masuk ke fitur.
          </Text>
        </View>

        <View style={styles.roleGrid}>
          {roles.map(item => (
            <Pressable
              key={item.role}
              onPress={() => signIn(item.role)}
              style={({pressed}) => [
                styles.roleCard,
                isWide && styles.roleCardWide,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.roleTitle}>{item.title}</Text>
              <Text style={styles.roleDescription}>{item.description}</Text>
              <Text style={styles.roleAction}>Masuk sebagai {item.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.brand,
  },
  page: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 22,
  },
  pageWide: {
    maxWidth: 980,
    alignSelf: 'center',
    width: '100%',
  },
  hero: {
    gap: 10,
  },
  eyebrow: {
    color: '#A7D1E8',
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#D6E6F2',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 620,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D9E5EC',
  },
  roleCardWide: {
    flex: 1,
    minWidth: 0,
  },
  roleTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  roleDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  roleAction: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 16,
  },
  pressed: {
    opacity: 0.78,
  },
});
