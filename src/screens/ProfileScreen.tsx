import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import api from '../utils/api';
import { Button } from '../components/FormControls';
import { Card, Screen, SectionHeader } from '../components/Screen';
import { colors } from '../components/Theme';
import { useAppStore } from '../state/AppStore';

const ProfileScreen = () => {
  const { signOut } = useAppStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data profil setiap kali layar ini dibuka
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const roleStr = await AsyncStorage.getItem('userRole');
      
      // Tembak API Profile di Backend
      try {
        const response = await api.get('/api/auth/me');
        setProfileData({ ...response.data, roleType: roleStr });
      } catch {
        // Jika gagal API (misal token admin beda jalur), ambil cadangan dari Storage
        const userStr = await AsyncStorage.getItem('userData');
        if (userStr) {
          setProfileData({ ...JSON.parse(userStr), roleType: roleStr });
        }
      }
    } catch (error) {
      console.error('Error memuat profil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Logout Terintegrasi
  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert('Error', 'Gagal melakukan logout');
            }
          },
        },
      ]
    );
  };

  return (
    <Screen title="Profil Pengguna" badge="Data Tersinkronisasi">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.brand}
              style={styles.loader}
            />
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarTextLarge}>
                    {profileData?.nama ? profileData.nama.substring(0, 2).toUpperCase() : 'UI'}
                  </Text>
                </View>
                <Text style={styles.name}>{profileData?.nama || 'Nama Pegawai'}</Text>
                <Text style={styles.role}>
                  {profileData?.roleType === 'admin' ? 'Administrator' : 'Pegawai Honor'}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Diskominfo Provinsi</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <SectionHeader title="Informasi Pribadi" />
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profileData?.email || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nomor HP</Text>
                  <Text style={styles.infoValue}>{profileData?.no_hp || '-'}</Text>
                </View>

                {profileData?.roleType !== 'admin' && (
                  <>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Asal Sekolah/Instansi</Text>
                      <Text style={styles.infoValue}>{profileData?.asal_sekolah || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Jurusan/Divisi</Text>
                      <Text style={styles.infoValue}>{profileData?.jurusan || '-'}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.actionSection}>
                <Button 
                  label="Ganti Password" 
                  onPress={() => Alert.alert('Info', 'Fitur ganti password via aplikasi segera hadir.')} 
                  variant="secondary" 
                />
                <View style={styles.buttonSpacer} />
                <Button 
                  label="Logout Keluar Sistem" 
                  onPress={handleLogout} 
                  variant="danger"
                />
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  card: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#DDEAF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTextLarge: {
    color: colors.brand,
    fontSize: 28,
    fontWeight: '900',
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 4,
  },
  role: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  actionSection: {
    marginTop: 10,
  },
  loader: {
    marginVertical: 30,
  },
  buttonSpacer: {
    height: 12,
  },
});
