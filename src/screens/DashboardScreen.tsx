import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MotiView} from 'moti';

import {AttendanceBadge} from '../components/Badge';
import {Icon, IconName} from '../components/Icon';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors, radius} from '../components/Theme';
import {quickActions} from '../data/attendance';
import type {AttendanceStatus} from '../types/attendance';
import api from '../utils/api';

const normalizeAttendanceStatus = (status?: string): AttendanceStatus => {
  if (status === 'tepat_waktu' || status === 'hadir') {
    return 'hadir';
  }
  if (status === 'terlambat' || status === 'izin') {
    return status;
  }
  return 'alpa';
};

const actionIcons: Record<string, IconName> = {
  Absensi: 'camera',
  Pengajuan: 'file',
  Tim: 'users',
  Laporan: 'barChart',
};

const getInitials = (name?: string) =>
  (name || 'Pegawai')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const {width} = useWindowDimensions();
  const isTablet = width >= 760;

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
  const attendanceStatus = normalizeAttendanceStatus(todayStatus?.statusCheckIn);

  const metrics = [
    {
      label: 'Hadir',
      value: stats?.monthly?.hadir?.toString() || '0',
      color: colors.green,
      surface: '#E9F8EF',
      icon: 'check' as IconName,
    },
    {
      label: 'Terlambat',
      value: stats?.monthly?.terlambat?.toString() || '0',
      color: colors.amber,
      surface: '#FFF6E7',
      icon: 'alert' as IconName,
    },
    {
      label: 'Izin / Sakit',
      value: stats?.monthly?.izin?.toString() || '0',
      color: colors.blue,
      surface: '#EAF1FF',
      icon: 'file' as IconName,
    },
    {
      label: 'Menunggu',
      value: stats?.izin?.pending?.toString() || '0',
      color: colors.red,
      surface: '#FEECEC',
      icon: 'clipboard' as IconName,
    },
  ];

  const visibleActions = quickActions.filter(
    action => isManager || action.route !== 'Tim',
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand} />
        <MotiView
          from={{opacity: 0.45}}
          animate={{opacity: 1}}
          transition={{loop: true, type: 'timing', duration: 1000}}>
          <Text style={styles.loadingText}>Menyinkronkan data...</Text>
        </MotiView>
      </View>
    );
  }

  return (
    <Screen
      title="Beranda"
      subtitle={`Selamat bekerja, ${userData?.nama || 'Pegawai'}`}
      badge={isManager ? 'Administrator' : 'Pegawai Honor'}>
      <MotiView
        from={{opacity: 0, translateY: 18}}
        animate={{opacity: 1, translateY: 0}}
        transition={{type: 'timing', duration: 420}}>
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(userData?.nama)}</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{userData?.nama || 'Pegawai'}</Text>
              <Text style={styles.profileMeta}>
                {isManager ? 'Administrator' : 'Pegawai Honor'} - Diskominfo
              </Text>
            </View>
            <View style={styles.syncBadge}>
              <Icon name="shield" size={16} color={colors.brand} strokeWidth={2.4} />
              <Text style={styles.syncText}>Online</Text>
            </View>
          </View>
        </Card>
      </MotiView>

      <View style={[styles.grid, isTablet && styles.gridWide]}>
        <MotiView
          from={{opacity: 0, scale: 0.97}}
          animate={{opacity: 1, scale: 1}}
          transition={{type: 'spring', delay: 120}}
          style={styles.todayColumn}>
          <Card style={styles.todayCard}>
            <SectionHeader
              title="Absensi Hari Ini"
              subtitle="Jam masuk dan pulang terakhir dari server"
            />
            <View style={styles.todayStatus}>
              <View
                style={[
                  styles.liveIndicator,
                  todayStatus?.checkInTime && styles.liveIndicatorActive,
                ]}>
                <MotiView
                  from={{scale: 1, opacity: 0.42}}
                  animate={{scale: 1.7, opacity: 0}}
                  transition={{
                    loop: true,
                    type: 'timing',
                    duration: 1800,
                  }}
                  style={[
                    styles.livePulse,
                    {
                      backgroundColor: todayStatus?.checkInTime
                        ? colors.brand
                        : colors.faint,
                    },
                  ]}
                />
                <Icon
                  name={todayStatus?.checkInTime ? 'check' : 'calendar'}
                  size={24}
                  color={todayStatus?.checkInTime ? colors.brand : colors.muted}
                  strokeWidth={2.4}
                />
              </View>
              <View style={styles.todayText}>
                <Text style={styles.todayLabel}>
                  {todayStatus?.checkInTime ? 'Sudah absen masuk' : 'Belum absen'}
                </Text>
                <Text style={styles.todayHint}>
                  Status akan diperbarui setelah absen berhasil.
                </Text>
              </View>
              <AttendanceBadge status={attendanceStatus} />
            </View>

            <View style={styles.timeGrid}>
              <TimeBox label="Masuk" value={todayStatus?.checkInTime || '--:--'} />
              <TimeBox label="Pulang" value={todayStatus?.checkOutTime || '--:--'} />
            </View>
          </Card>
        </MotiView>

        <Card style={[styles.actionsCard, isTablet && styles.actionsCardWide]}>
          <SectionHeader
            title="Aksi Cepat"
            subtitle="Navigasi utama untuk pekerjaan harian"
          />
          <View style={styles.actionGrid}>
            {visibleActions.map((action, index) => (
              <MotiView
                key={action.route}
                from={{opacity: 0, translateY: 16}}
                animate={{opacity: 1, translateY: 0}}
                transition={{type: 'spring', delay: 180 + index * 80}}
                style={styles.actionWrapper}>
                <Pressable
                  onPress={() => navigation.navigate(action.route)}
                  style={({pressed}) => [
                    styles.actionCard,
                    pressed && styles.actionCardPressed,
                  ]}>
                  <View style={styles.actionIcon}>
                    <Icon
                      name={actionIcons[action.route] ?? 'home'}
                      size={23}
                      color={colors.brand}
                      strokeWidth={2.4}
                    />
                  </View>
                  <Text style={styles.actionTitle}>{action.label}</Text>
                </Pressable>
              </MotiView>
            ))}
          </View>
        </Card>
      </View>

      <Card>
        <SectionHeader
          title="Laporan Bulan Ini"
          subtitle="Ringkasan kehadiran periode berjalan"
        />
        <View style={[styles.metricGrid, isTablet && styles.metricGridWide]}>
          {metrics.map((item, index) => (
            <MotiView
              key={item.label}
              from={{opacity: 0, translateY: 18}}
              animate={{opacity: 1, translateY: 0}}
              transition={{type: 'spring', delay: 260 + index * 70}}
              style={[
                styles.metricCard,
                isTablet && styles.metricCardWide,
                {backgroundColor: item.surface},
              ]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, {borderColor: item.color}]}>
                  <Icon name={item.icon} size={18} color={item.color} strokeWidth={2.4} />
                </View>
                <Text style={[styles.metricValue, {color: item.color}]}>
                  {item.value}
                </Text>
              </View>
              <Text style={styles.metricLabel}>{item.label}</Text>
            </MotiView>
          ))}
        </View>
      </Card>
    </Screen>
  );
};

const TimeBox = ({label, value}: {label: string; value: string}) => (
  <View style={styles.timeBox}>
    <Text style={styles.timeLabel}>{label}</Text>
    <Text style={styles.timeValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.soft,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontWeight: '800',
  },
  profileCard: {
    padding: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.brandDark,
    fontSize: 17,
    fontWeight: '900',
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  profileMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  syncBadge: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.panelAlt,
  },
  syncText: {
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: '900',
  },
  grid: {
    gap: 16,
  },
  gridWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  todayColumn: {
    flex: 1.4,
  },
  todayCard: {
    flex: 1,
  },
  todayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  liveIndicator: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.panelAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  liveIndicatorActive: {
    backgroundColor: colors.brandSoft,
  },
  livePulse: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  todayText: {
    flex: 1,
    minWidth: 0,
  },
  todayLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  todayHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  timeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  timeBox: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panelAlt,
    padding: 13,
  },
  timeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  timeValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
  actionsCard: {
    flex: 1,
  },
  actionsCardWide: {
    maxWidth: 390,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionWrapper: {
    width: '48%',
    minWidth: 132,
  },
  actionCard: {
    minHeight: 106,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panelAlt,
    padding: 13,
    justifyContent: 'space-between',
  },
  actionCardPressed: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 12,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricGridWide: {
    flexWrap: 'nowrap',
  },
  metricCard: {
    width: '48%',
    minHeight: 112,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  metricCardWide: {
    flex: 1,
    width: undefined,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 14,
  },
});

export default DashboardScreen;
