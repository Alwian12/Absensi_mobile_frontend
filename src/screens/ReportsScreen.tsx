import React, {useMemo, useState} from 'react';
import {
  StyleSheet, 
  Text, 
  View, 
  useWindowDimensions, 
  Share, 
  Alert
} from 'react-native';

import {Button, Field, Segmented} from '../components/FormControls';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
import {useAppStore} from '../state/AppStore';
import type {AttendanceStatus} from '../types/attendance';

const departments = ['Semua', 'HR', 'Operasional', 'Finance', 'Teknik'] as const;

const ReportsScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const isTablet = width >= 680;
  const {attendanceRecords, requests} = useAppStore();
  const [department, setDepartment] =
    useState<(typeof departments)[number]>('Semua');
  const [period, setPeriod] = useState('Mei 2026');
  const [message, setMessage] = useState('Laporan siap difilter');

  const filteredRecords = useMemo(
    () =>
      attendanceRecords.filter(
        item => department === 'Semua' || item.department === department,
      ),
    [attendanceRecords, department],
  );

  const countByStatus = (status: AttendanceStatus) =>
    filteredRecords.filter(record => record.status === status).length;

  const reportCards = [
    {
      label: 'Total pegawai',
      value: filteredRecords.length.toString(),
      helper: department,
    },
    {
      label: 'Hadir',
      value: countByStatus('hadir').toString(),
      helper: 'tepat waktu',
    },
    {
      label: 'Terlambat',
      value: countByStatus('terlambat').toString(),
      helper: 'perlu tindak lanjut',
    },
    {
      label: 'Izin/Alpa',
      value: (countByStatus('izin') + countByStatus('alpa')).toString(),
      helper: 'tidak hadir',
    },
  ];

  const pendingRequests = requests.filter(
    request => request.status === 'menunggu',
  ).length;

  // FITUR BARU: Fungsi untuk mengekspor dan membagikan laporan
  const handleExport = async () => {
    try {
      setMessage('Menyiapkan laporan...');

      // 1. Membuat Header Laporan
      let reportText = `📊 *LAPORAN ABSENSI PEGAWAI*\n`;
      reportText += `Periode: ${period}\n`;
      reportText += `Departemen: ${department}\n\n`;
      
      // 2. Membuat Ringkasan Data
      reportText += `*RINGKASAN:*\n`;
      reportText += `- Total Pegawai: ${filteredRecords.length}\n`;
      reportText += `- Hadir Tepat Waktu: ${countByStatus('hadir')}\n`;
      reportText += `- Terlambat: ${countByStatus('terlambat')}\n`;
      reportText += `- Izin/Alpa: ${countByStatus('izin') + countByStatus('alpa')}\n\n`;
      
      // 3. Membuat Daftar Hadir Detail
      reportText += `*RINCIAN KEHADIRAN:*\n`;
      reportText += `--------------------------\n`;

      filteredRecords.forEach((record, index) => {
        reportText += `${index + 1}. ${record.name} (${record.department})\n`;
        reportText += `   Status: ${record.status.toUpperCase()}\n`;
        reportText += `   Jam Masuk: ${record.checkIn || '-'}\n`;
        reportText += `   Jam Pulang: ${record.checkOut || '-'}\n`;
        reportText += `   Catatan: ${record.proof?.note || '-'}\n\n`;
      });

      // 4. Memanggil fitur Share bawaan HP
      const result = await Share.share({
        message: reportText,
        title: `Laporan Absensi - ${period}`,
      });

      // 5. Cek aksi pengguna
      if (result.action === Share.sharedAction) {
        setMessage('Laporan berhasil diekspor & dibagikan!');
      } else if (result.action === Share.dismissedAction) {
        setMessage('Export dibatalkan oleh pengguna.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setMessage('Gagal mengekspor laporan.');
    }
  };

  return (
    <Screen title="Laporan Absensi" badge="Export to WhatsApp/Email">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card>
            <SectionHeader
              title="Filter Laporan"
              subtitle="Pilih periode dan departemen untuk menyesuaikan data"
            />
            <View style={styles.formGap}>
              <Field
                value={period}
                onChangeText={setPeriod}
                placeholder="Periode laporan"
              />
              <Segmented
                items={[...departments]}
                value={department}
                onChange={setDepartment}
              />
              <Button
                label="Terapkan Filter"
                onPress={() =>
                  setMessage(`Laporan ${department} periode ${period} aktif`)
                }
              />
            </View>
          </Card>

          <View style={[styles.metricGrid, isTablet && styles.metricGridWide]}>
            {reportCards.map(item => (
              <Card
                key={item.label}
                style={[styles.metricCard, isTablet && styles.metricCardWide]}>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricHelper}>{item.helper}</Text>
              </Card>
            ))}
          </View>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader
              title="Ringkasan"
              subtitle="Data dihitung dari absensi lokal"
            />
            <View style={styles.reportBox}>
              <Text style={styles.reportLabel}>Periode</Text>
              <Text style={styles.reportValue}>{period}</Text>
            </View>
            <View style={styles.reportBox}>
              <Text style={styles.reportLabel}>Pengajuan menunggu</Text>
              <Text style={styles.reportValue}>{pendingRequests}</Text>
            </View>
            <View style={styles.reportBox}>
              <Text style={styles.reportLabel}>Lampiran foto</Text>
              <Text style={styles.reportValue}>
                {filteredRecords.filter(item => item.proof).length}
              </Text>
            </View>
            <Button
              label="Kirim Laporan (Share)"
              onPress={handleExport}
            />
          </Card>

          <Card>
            <SectionHeader title="Status Aktivitas" />
            <Text style={styles.message}>{message}</Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
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
    width: 360,
  },
  formGap: {
    gap: 10,
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
    minHeight: 116,
  },
  metricCardWide: {
    flex: 1,
    width: undefined,
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
  reportBox: {
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginBottom: 10,
  },
  reportLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  reportValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 5,
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});