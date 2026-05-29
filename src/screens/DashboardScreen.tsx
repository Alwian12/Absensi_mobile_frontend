import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../utils/api'; // Menggunakan Axios Interceptor yang kita buat
import { AttendanceBadge } from '../components/Badge';
import { Card, Screen, SectionHeader } from '../components/Screen';
import { colors } from '../components/Theme';
import { quickActions, scheduleItems } from '../data/attendance';

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const isTablet = width >= 680;

  // State untuk menyimpan data dari Backend
  const [userData, setUserData] = useState<any>(null);
  const [todayStatus, setTodayStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data setiap kali layar Dashboard difokuskan (dibuka)
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Ambil data user yang login dari Storage
      const userStr = await AsyncStorage.getItem('userData');
      const roleStr = await AsyncStorage.getItem('userRole');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUserData({ ...parsedUser, roleType: roleStr });
      }

      // 2. Tembak API Statistics & Today secara paralel
      const [statsRes, todayRes] = await Promise.all([
        api.get('/api/absensi/statistics'),
        api.get('/api/absensi/today')
      ]);

      setStats(statsRes.data);
      setTodayStatus(todayRes.data);

    } catch (error) {
      console.log('Error fetching dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isManager = userData?.roleType === 'admin';

  // Menyusun metrik berdasarkan data asli dari Backend
  const metrics = [
    {
      label: 'Hadir',
      value: stats?.monthly?.hadir?.toString() || '0',
      helper: 'Bulan ini',
      color: colors.green,
    },
    {
      label: 'Terlambat',
      value: stats?.monthly?.terlambat?.toString() || '0',
      helper: 'Bulan ini',
      color: '#C47C16',
    },
    {
      label: 'Izin / Sakit',
      value: stats?.monthly?.izin?.toString() || '0',
      helper: 'Bulan ini',
      color: colors.blue,
    },
    {
      label: 'Menunggu',
      value: stats?.izin?.pending?.toString() || '0',
      helper: 'Approval izin',
      color: colors.red,
    },
  ];

  const visibleActions = quickActions.filter(
    action => isManager || action.route !== 'Tim',
  );

  return (
    <Screen title="Dashboard Absensi" badge="Real-time Server Data">
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.brand} style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* Metrik Grid */}
          <View style={[styles.metricGrid, isTablet && styles.metricGridWide]}>
            {metrics.map(item => (
              <Card
                key={item.label}
                style={[styles.metricCard, isTablet && styles.metricCardWide]}>
                <View style={[styles.metricAccent, { backgroundColor: item.color }]} />
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricHelper}>{item.helper}</Text>
              </Card>
            ))}
          </View>

          <View style={[styles.grid, isWide && styles.gridWide]}>
            <View style={styles.mainColumn}>
              
              {/* Status Hari Ini */}
              <Card>
                <SectionHeader
                  title="Status Hari Ini"
                  subtitle="Data sinkronisasi dari database server"
                />
                <View style={styles.employeeRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {userData?.nama ? userData.nama.substring(0, 2).toUpperCase() : 'UI'}
                    </Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{userData?.nama || 'Pegawai'}</Text>
                    <Text style={styles.employeeMeta}>
                      {isManager ? 'Administrator' : 'Pegawai Honor'} - Diskominfo
                    </Text>
                  </View>
                  <AttendanceBadge status={todayStatus?.statusCheckIn || 'belum absen'} />
                </View>

                <View style={styles.timeGrid}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Masuk</Text>
                    <Text style={styles.timeValue}>{todayStatus?.checkInTime || '--:--'}</Text>
                  </View>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Pulang</Text>
                    <Text style={styles.timeValue}>{todayStatus?.checkOutTime || '--:--'}</Text>
                  </View>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Bukti Foto</Text>
                    <Text style={styles.timeValueSmall}>
                      {todayStatus?.fotoCheckIn ? 'Terkirim ✅' : 'Belum ada ❌'}
                    </Text>
                  </View>
                </View>
              </Card>

              {/* Aksi Cepat */}
              <Card>
                <SectionHeader
                  title="Aksi Cepat"
                  subtitle="Pilih menu operasional"
                />
                <View style={styles.actionGrid}>
                  {visibleActions.map(action => (
                    <Pressable
                      key={action.route}
                      onPress={() => navigation.navigate(action.route)}
                      style={({ pressed }) => [
                        styles.actionCard,
                        pressed && styles.pressed,
                      ]}>
                      <Text style={styles.actionTitle}>{action.label}</Text>
                      <Text style={styles.actionText}>Buka fitur</Text>
                    </Pressable>
                  ))}
                </View>
              </Card>
            </View>

            {/* Kolom Samping (Jadwal) */}
            <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
              <Card>
                <SectionHeader title="Jadwal Kantor" subtitle="Aturan shift aktif" />
                <View style={styles.listGap}>
                  {scheduleItems.map(item => (
                    <View key={item.label} style={styles.scheduleItem}>
                      <Text style={styles.scheduleLabel}>{item.label}</Text>
                      <Text style={styles.scheduleValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              {/* Catatan Pengembangan */}
              <Card>
                <SectionHeader
                  title="Sistem Terhubung"
                  subtitle="Node.js & MySQL (Backend)"
                />
                <Text style={styles.activityDescription}>
                  Dashboard ini sekarang menggunakan data asli yang ditarik dari endpoint /api/absensi/today dan /api/absensi/statistics.
                </Text>
              </Card>
            </View>
          </View>
        </>
      )}
    </Screen>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricGridWide: { flexWrap: 'nowrap' },
  metricCard: { width: '48%', minHeight: 122 },
  metricCardWide: { flex: 1, width: undefined },
  metricAccent: { width: 34, height: 4, borderRadius: 4, marginBottom: 14 },
  metricValue: { color: colors.ink, fontSize: 27, fontWeight: '900', letterSpacing: 0 },
  metricLabel: { color: colors.ink, fontSize: 14, fontWeight: '900', marginTop: 3 },
  metricHelper: { color: colors.muted, fontSize: 12, marginTop: 3 },
  grid: { gap: 16, marginTop: 16 },
  gridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  mainColumn: { flex: 1, gap: 16 },
  sideColumn: { gap: 16 },
  sideColumnWide: { width