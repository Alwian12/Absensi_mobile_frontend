import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {AttendanceBadge} from '../components/Badge';
import {Button} from '../components/FormControls';
import {Icon} from '../components/Icon';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors, radius} from '../components/Theme';
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

const ReportsScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;

  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Data riwayat absensi terbaru');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/absensi/history?limit=30');
      setHistoryRecords(response.data);
      setMessage(`Berhasil memuat ${response.data.length} riwayat absensi.`);
    } catch (error) {
      console.error('Error fetching history:', error);
      setMessage('Gagal mengambil data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const handleExport = async () => {
    if (historyRecords.length === 0) {
      Alert.alert('Kosong', 'Tidak ada data absensi untuk diekspor.');
      return;
    }

    try {
      setMessage('Menyiapkan laporan...');

      let reportText = '*LAPORAN RIWAYAT ABSENSI*\n';
      reportText += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\n`;
      reportText += '*RINCIAN KEHADIRAN (Terbaru):*\n';
      reportText += '--------------------------\n';

      historyRecords.forEach((record, index) => {
        const tgl = new Date(record.tanggal).toLocaleDateString('id-ID');

        reportText += `${index + 1}. Tanggal: ${tgl}\n`;
        reportText += `   Status Masuk: ${record.status_check_in?.toUpperCase() || '-'}\n`;
        reportText += `   Status Pulang: ${record.status_check_out?.toUpperCase() || '-'}\n`;
        reportText += `   Jam Masuk: ${record.check_in || 'Belum absen'}\n`;
        reportText += `   Jam Pulang: ${record.check_out || 'Belum absen'}\n\n`;
      });

      const result = await Share.share({
        message: reportText,
        title: 'Riwayat Absensi',
      });

      if (result.action === Share.sharedAction) {
        setMessage('Laporan berhasil diekspor dan dibagikan.');
      } else if (result.action === Share.dismissedAction) {
        setMessage('Export dibatalkan oleh pengguna.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setMessage('Gagal mengekspor laporan.');
    }
  };

  const renderHistoryItem = ({item}: {item: any}) => {
    const tgl = new Date(item.tanggal).toLocaleDateString('id-ID');

    return (
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={styles.historyDateGroup}>
            <View style={styles.historyIcon}>
              <Icon name="calendar" size={17} color={colors.brand} strokeWidth={2.3} />
            </View>
            <Text style={styles.historyDate}>{tgl}</Text>
          </View>
          <AttendanceBadge status={normalizeAttendanceStatus(item.status_check_in)} />
        </View>

        <View style={styles.historyBody}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Jam Masuk</Text>
            <Text style={styles.timeValue}>{item.check_in || '--:--'}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Jam Pulang</Text>
            <Text style={styles.timeValue}>{item.check_out || '--:--'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Screen title="Riwayat Absensi" badge="Data Tersinkronisasi">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card style={styles.historyPanel}>
            <SectionHeader
              title="Daftar Kehadiran"
              subtitle="Diurutkan dari yang terbaru"
            />
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.brand}
                style={styles.loader}
              />
            ) : historyRecords.length > 0 ? (
              <FlatList
                data={historyRecords}
                keyExtractor={item => item.id.toString()}
                renderItem={renderHistoryItem}
                contentContainerStyle={styles.historyList}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>
                Belum ada riwayat absensi yang ditemukan.
              </Text>
            )}
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader
              title="Aksi Laporan"
              subtitle="Cetak atau bagikan riwayat"
            />
            <View style={styles.reportBox}>
              <View style={styles.reportIcon}>
                <Icon name="barChart" size={21} color={colors.brand} strokeWidth={2.3} />
              </View>
              <View style={styles.reportText}>
                <Text style={styles.reportLabel}>Total Record</Text>
                <Text style={styles.reportValue}>{historyRecords.length} Hari</Text>
              </View>
            </View>
            <Button
              label="Bagikan Laporan"
              icon="send"
              onPress={handleExport}
              disabled={isLoading || historyRecords.length === 0}
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
  grid: {gap: 16},
  gridWide: {flexDirection: 'row', alignItems: 'flex-start'},
  mainColumn: {flex: 1, gap: 16},
  sideColumn: {gap: 16},
  sideColumnWide: {width: 360},
  historyPanel: {flex: 1, minHeight: 400},
  loader: {marginTop: 40},
  historyList: {gap: 12, paddingBottom: 20},
  historyCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.panelAlt,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  historyDateGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDate: {
    flex: 1,
    fontWeight: '900',
    fontSize: 15,
    color: colors.ink,
  },
  historyBody: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginTop: 12,
    paddingTop: 12,
  },
  timeInfo: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.muted,
    fontStyle: 'italic',
  },
  reportBox: {
    borderRadius: radius.md,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reportIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportText: {flex: 1},
  reportLabel: {color: colors.muted, fontSize: 12, fontWeight: '900'},
  reportValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 5,
  },
  message: {color: colors.muted, fontSize: 13, lineHeight: 18},
});
