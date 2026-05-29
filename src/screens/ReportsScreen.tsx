import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Share,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../utils/api';
import { Button } from '../components/FormControls';
import { Card, Screen, SectionHeader } from '../components/Screen';
import { colors } from '../components/Theme';

const ReportsScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const isTablet = width >= 680;

  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Data riwayat absensi terbaru');

  // Mengambil data setiap kali layar Laporan dibuka
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      // Menembak endpoint history di backend
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

  // Fungsi Export/Share Data Asli dari Backend
  const handleExport = async () => {
    if (historyRecords.length === 0) {
      Alert.alert('Kosong', 'Tidak ada data absensi untuk diekspor.');
      return;
    }

    try {
      setMessage('Menyiapkan laporan...');

      let reportText = `📊 *LAPORAN RIWAYAT ABSENSI*\n`;
      reportText += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\n`;
      
      reportText += `*RINCIAN KEHADIRAN (Terbaru):*\n`;
      reportText += `--------------------------\n`;

      historyRecords.forEach((record, index) => {
        // Format tanggal dari MySQL (YYYY-MM-DD) ke format lokal
        const tgl = new Date(record.tanggal).toLocaleDateString('id-ID');
        
        reportText += `${index + 1}. Tanggal: ${tgl}\n`;
        reportText += `   Status Masuk: ${record.status_check_in?.toUpperCase() || '-'}\n`;
        reportText += `   Status Pulang: ${record.status_check_out?.toUpperCase() || '-'}\n`;
        reportText += `   Jam Masuk: ${record.check_in || 'Belum absen'}\n`;
        reportText += `   Jam Pulang: ${record.check_out || 'Belum absen'}\n\n`;
      });

      const result = await Share.share({
        message: reportText,
        title: `Riwayat Absensi`,
      });

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

  // Komponen untuk me-render setiap baris riwayat
  const renderHistoryItem = ({ item }: { item: any }) => {
    const tgl = new Date(item.tanggal).toLocaleDateString('id-ID');
    
    // Tentukan warna indikator berdasarkan status
    let statusColor = colors.muted;
    if (item.status_check_in === 'tepat_waktu') statusColor = colors.green;
    if (item.status_check_in === 'terlambat') statusColor = '#C47C16';
    if (item.status_check_in === 'izin') statusColor = colors.blue;

    return (
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyDate}>{tgl}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status_check_in?.replace('_', ' ').toUpperCase() || 'TIDAK HADIR'}</Text>
          </View>
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
        
        {/* Kolom Utama: Daftar Riwayat */}
        <View style={styles.mainColumn}>
          <Card style={{ flex: 1, minHeight: 400 }}>
            <SectionHeader
              title="Daftar Kehadiran"
              subtitle="Diurutkan dari yang terbaru"
            />
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.brand} style={{ marginTop: 40 }} />
            ) : historyRecords.length > 0 ? (
              <FlatList
                data={historyRecords}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHistoryItem}
                contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>Belum ada riwayat absensi yang ditemukan.</Text>
            )}
          </Card>
        </View>

        {/* Kolom Samping: Aksi & Info */}
        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader
              title="Aksi Laporan"
              subtitle="Cetak atau bagikan riwayat"
            />
            <View style={styles.reportBox}>
              <Text style={styles.reportLabel}>Total Record</Text>
              <Text style={styles.reportValue}>{historyRecords.length} Hari</Text>
            </View>
            <Button
              label="Kirim Laporan (Share WA/Email)"
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
  grid: { gap: 16 },
  gridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  mainColumn: { flex: 1, gap: 16 },
  sideColumn: { gap: 16 },
  sideColumnWide: { width: 360 },
  
  // Style untuk List Riwayat
  historyCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#F8FAFC'
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  historyDate: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.ink
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  historyBody: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  timeInfo: {
    alignItems: 'center'
  },
  timeLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.muted,
    fontStyle: 'italic'
  },

  // Style untuk Laporan Box
  reportBox: {
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginBottom: 14,
  },
  reportLabel: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  reportValue: { color: colors.ink, fontSize: 20, fontWeight: '900', marginTop: 5 },
  message: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});