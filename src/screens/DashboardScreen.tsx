import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AttendanceBadge} from '../components/Badge';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
import {quickActions, scheduleItems} from '../data/attendance';
import {useAppStore} from '../state/AppStore';

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const isTablet = width >= 680;
  const {activeEmployee, attendanceRecords, requests, activities, user} =
    useAppStore();

  const isManager = user?.role !== 'pegawai';

  const metrics = useMemo(
    () => [
      {
        label: 'Hadir',
        value: attendanceRecords
          .filter(record => record.status === 'hadir')
          .length.toString(),
        helper: 'tepat waktu',
        color: colors.green,
      },
      {
        label: 'Terlambat',
        value: attendanceRecords
          .filter(record => record.status === 'terlambat')
          .length.toString(),
        helper: 'perlu catatan',
        color: '#C47C16',
      },
      {
        label: 'Izin',
        value: attendanceRecords
          .filter(record => record.status === 'izin')
          .length.toString(),
        helper: 'pengajuan aktif',
        color: colors.blue,
      },
      {
        label: 'Menunggu',
        value: requests
          .filter(request => request.status === 'menunggu')
          .length.toString(),
        helper: 'approval',
        color: colors.red,
      },
    ],
    [attendanceRecords, requests],
  );

  const visibleActions = quickActions.filter(
    action => isManager || action.route !== 'Tim',
  );

  return (
    <Screen title="Dashboard Absensi" badge="Foto non-verifikasi wajah">
      <View style={[styles.metricGrid, isTablet && styles.metricGridWide]}>
        {metrics.map(item => (
          <Card
            key={item.label}
            style={[styles.metricCard, isTablet && styles.metricCardWide]}>
            <View style={[styles.metricAccent, {backgroundColor: item.color}]} />
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
              subtitle="Ringkasan absensi pegawai aktif"
            />
            <View style={styles.employeeRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {activeEmployee.name
                    .split(' ')
                    .map(part => part[0])
                    .join('')
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{activeEmployee.name}</Text>
                <Text style={styles.employeeMeta}>
                  {activeEmployee.role} - {activeEmployee.location}
                </Text>
              </View>
              <AttendanceBadge status={activeEmployee.status} />
            </View>

            <View style={styles.timeGrid}>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>Masuk</Text>
                <Text style={styles.timeValue}>{activeEmployee.checkIn}</Text>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>Pulang</Text>
                <Text style={styles.timeValue}>{activeEmployee.checkOut}</Text>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>Bukti</Text>
                <Text style={styles.timeValueSmall}>
                  {activeEmployee.proof?.mode ?? 'Belum ada'}
                </Text>
              </View>
            </View>
          </Card>

          <Card>
            <SectionHeader
              title="Aksi Cepat"
              subtitle="Pindah ke fitur standar absensi"
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

          <Card>
            <SectionHeader
              title="Aktivitas"
              subtitle="Log frontend selama sesi berjalan"
            />
            <View style={styles.listGap}>
              {activities.map(item => (
                <View key={item.id} style={styles.activityItem}>
                  <Text style={styles.activityTime}>{item.time}</Text>
                  <View style={styles.activityText}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
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
    minHeight: 122,
  },
  metricCardWide: {
    flex: 1,
    width: undefined,
  },
  metricAccent: {
    width: 34,
    height: 4,
    borderRadius: 4,
    marginBottom: 14,
  },
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
  metricHelper: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  grid: {
    gap: 16,
  },
  gridWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainColumn: {
    flex: 1,
    gap: 16,
  },
  sideColumn: {
    gap: 16,
  },
  sideColumnWide: {
    width: 354,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#DDEAF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.brand,
    fontSize: 17,
    fontWeight: '900',
  },
  employeeInfo: {
    flex: 1,
    minWidth: 0,
  },
  employeeName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  employeeMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  timeBox: {
    flex: 1,
    minWidth: 130,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  timeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  timeValue: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 4,
  },
  timeValueSmall: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 7,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    minHeight: 68,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionTitle: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '900',
  },
  actionText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  listGap: {
    gap: 10,
  },
  scheduleItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  scheduleLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  scheduleValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  activityItem: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  activityTime: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    width: 44,
  },
  activityText: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  activityDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  pressed: {
    opacity: 0.78,
  },
});
