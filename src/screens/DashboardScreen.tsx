import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AttendanceBadge} from '../components/Badge';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
import {quickActions, scheduleItems} from '../data/attendance';
import api from '../utils/api';
import type {AttendanceStatus} from '../types/attendance';

const normalizeAttendanceStatus = (status?: string): AttendanceStatus => {
  if (status === 'tepat_waktu' || status === 'hadir') {
    return 'hadir';
  }

  if (status === 'terlambat' || status === 'izin') {
    return status;
  }

  return 'alpa';
};

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const isTablet = width >= 680;

  const [userData, setUserData] = useState<any>(null);
  const [todayStatus, setTodayStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);

    try {
      const userStr = await AsyncStorage.getItem('userData');
      const roleStr = await AsyncStorage.getItem('userRole');

      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUserData({...parsedUser, roleType: roleStr});
      }

      const [statsRes, todayRes] = await Promise.all([
        api.get('/api/absensi/statistics'),
        api.get('/api/absensi/today'),
      ]);

      setStats(statsRes.data);
      setTodayStatus(todayRes.data);
    } catch (error) {
      console.log('Error fetching dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData]),
  );

  const isManager = userData?.roleType === 'admin';

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
      color: colors.amber,
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
        <ActivityIndicator
          size="large"
          color={colors.brand}
          style={styles.loading}
        />
      ) : (
        <>
          <View style={[styles.metricGrid, isTablet && styles.metricGridWide]}>
            {metrics.map(item => (
              <Card
                key={item.label}
                style={[styles.metricCard, isTablet && styles.metricCardWide]}>
                <View
                  style={[styles.metricAccent, {backgroundColor: item.color}]}
                />
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricHelper}>{item.helper}</Text>
              </Card>
            ))}
          </View>

          <View style={[styles.grid, isWide && styles.gridWide]}>
            <View style={styles.mainColumn}>
              <Card>
                <SectionHeader
                  title="Status Hari Ini"
                  subtitle="Data sinkronisasi dari database server"
                />
                <View style={styles.employeeRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {userData?.nama
                        ? userData.nama.substring(0, 2).toUpperCase()
                        : 'UI'}
                    </Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>
                      {userData?.nama || 'Pegawai'}
                    </Text>
                    <Text style={styles.employeeMeta}>
                      {isManager ? 'Administrator' : 'Pegawai Honor'} -
                      Diskominfo
                    </Text>
                  </View>
                  <AttendanceBadge
                    status={normalizeAttendanceStatus(
                      todayStatus?.statusCheckIn,
                    )}
                  />
                </View>

                <View style={styles.timeGrid}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Masuk</Text>
                    <Text style={styles.timeValue}>
                      {todayStatus?.checkInTime || '--:--'}
                    </Text>
                  </View>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Pulang</Text>
                    <Text style={styles.timeValue}>
                      {todayStatus?.checkOutTime || '--:--'}
                    </Text>
                  </View>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Bukti Foto</Text>
                    <Text style={styles.timeValueSmall}>
                      {todayStatus?.fotoCheckIn ? 'Terkirim' : 'Belum ada'}
                    </Text>
                  </View>
                </View>
              </Card>

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
                      style={({pressed}) => [
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

            <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
              <Card>
                <SectionHeader
                  title="Jadwal Kantor"
                  subtitle="Aturan shift aktif"
                />
                <View style={styles.listGap}>
                  {scheduleItems.map(item => (
                    <View key={item.label} style={styles.scheduleItem}>
                      <Text style={styles.scheduleLabel}>{item.label}</Text>
                      <Text style={styles.scheduleValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              <Card>
                <SectionHeader
                  title="Sistem Terhubung"
                  subtitle="Node.js & MySQL Backend"
                />
                <Text style={styles.activityDescription}>
                  Dashboard ini menggunakan data dari endpoint
                  /api/absensi/today dan /api/absensi/statistics.
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
  loading: {marginTop: 50},
  metricGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  metricGridWide: {flexWrap: 'nowrap'},
  metricCard: {width: '48%', minHeight: 122},
  metricCardWide: {flex: 1, width: undefined},
  metricAccent: {width: 34, height: 4, borderRadius: 4, marginBottom: 14},
  metricValue: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0,
  },
  metricLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },
  metricHelper: {color: colors.muted, fontSize: 12, marginTop: 3},
  grid: {gap: 16, marginTop: 16},
  gridWide: {flexDirection: 'row', alignItems: 'flex-start'},
  mainColumn: {flex: 1, gap: 16},
  sideColumn: {gap: 16},
  sideColumnWide: {width: 354},
  employeeRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#DDEAF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {color: colors.brand, fontSize: 16, fontWeight: '900'},
  employeeInfo: {flex: 1, minWidth: 0},
  employeeName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  employeeMeta: {color: colors.muted, fontSize: 13, marginTop: 4},
  timeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16},
  timeBox: {
    width: '31%',
    minWidth: 112,
    minHeight: 74,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  timeLabel: {color: colors.muted, fontSize: 12, fontWeight: '900'},
  timeValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  timeValueSmall: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
  },
  actionGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  actionCard: {
    width: '48%',
    minHeight: 82,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#F8FAFC',
    padding: 12,
    justifyContent: 'center',
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actionText: {color: colors.muted, fontSize: 12, marginTop: 5},
  listGap: {gap: 10},
  scheduleItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleLabel: {color: colors.muted, fontSize: 13, fontWeight: '900'},
  scheduleValue: {color: colors.ink, fontSize: 18, fontWeight: '900'},
  activityDescription: {color: colors.muted, fontSize: 13, lineHeight: 18},
  pressed: {opacity: 0.78},
});
