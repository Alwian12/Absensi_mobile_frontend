import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import api from '../utils/api'; // Import koneksi API kita

import {Button, Segmented} from '../components/FormControls';
import {Icon} from '../components/Icon';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors, radius} from '../components/Theme';
import {photoModes, scheduleItems} from '../data/attendance';
import type {PhotoMode} from '../types/attendance';

const AttendanceScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const [photoMode, setPhotoMode] = useState<PhotoMode>('Lokasi kerja');
  
  // State baru untuk menyimpan foto dari kamera
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<any>(null);
  
  const [message, setMessage] = useState('Siapkan foto dan GPS sebelum absen');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fungsi Buka Kamera
  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.5, // Kompres ukuran file
        cameraType: 'front', // Kamera depan untuk selfie
        saveToPhotos: false,
      });

      if (result.didCancel || !result.assets) {
        setMessage('Batal mengambil foto');
        return;
      }

      setPhotoUri(result.assets[0].uri || null);
      setPhotoData(result.assets[0]);
      setMessage('Bukti foto siap dikirim!');
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Gagal membuka kamera');
    }
  };

  // 2. Fungsi Minta Izin GPS
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // 3. Fungsi Utama Simpan Absen ke Backend
  const saveAttendance = async (action: 'masuk' | 'pulang') => {
    if (!photoData) {
      Alert.alert('Peringatan', 'Silakan ambil foto selfie terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setMessage('Mengambil kordinat GPS...');

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Izin Ditolak', 'Tidak bisa absen tanpa akses GPS');
      setIsLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          setMessage('Mengirim data ke server...');
          
          // Membuat form data untuk dikirim ke backend (karena ada file foto)
          const formData = new FormData();
          formData.append('latitude', position.coords.latitude.toString());
          formData.append('longitude', position.coords.longitude.toString());
          formData.append('foto', {
            uri: photoData.uri,
            type: photoData.type || 'image/jpeg',
            name: photoData.fileName || 'selfie.jpg',
          } as any);

          // Tentukan Endpoint (Masuk atau Pulang)
          const endpoint = action === 'masuk' ? '/api/absensi/checkin' : '/api/absensi/checkout';
          
          // Tembak API Backend!
          const response = await api.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Jika berhasil:
          Alert.alert('Absen Berhasil!', response.data.message);
          setMessage(`Berhasil: ${response.data.status} pada ${response.data.checkInTime || response.data.checkOutTime}`);
          
          // Reset Form
          setPhotoUri(null);
          setPhotoData(null);
          
        } catch (error: any) {
          // Menangkap pesan error dari backend (misal: "Anda di luar radius kantor")
          const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server';
          Alert.alert('Gagal Absen', errorMessage);
          setMessage(errorMessage);
        } finally {
          setIsLoading(false);
        }
      },
      _error => {
        Alert.alert('Error GPS', 'Gagal mendapatkan lokasi.');
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <Screen title="Absensi Selfie" badge="GPS + Server Backend Terhubung">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card style={styles.attendanceCard}>
            <SectionHeader
              title="Absen Hari Ini"
              subtitle="Ambil selfie, validasi GPS, lalu kirim ke server"
            />
            
            <View style={styles.photoBox}>
              <View style={styles.photoPreview}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoImage} />
                ) : (
                  <View style={styles.emptyPhotoPreview}>
                    <Icon name="camera" size={34} color={colors.brand} strokeWidth={2.2} />
                    <Text style={styles.photoPreviewLabel}>Wajib Selfie</Text>
                  </View>
                )}
              </View>
              <View style={styles.photoInfo}>
                <View style={styles.infoStatusRow}>
                  <Icon
                    name={photoUri ? 'check' : 'alert'}
                    size={17}
                    color={photoUri ? colors.green : colors.amber}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.infoLabel}>Status Pengiriman</Text>
                </View>
                <Text style={styles.infoValue}>{photoUri ? 'Foto Tersimpan (Draft)' : 'Belum ada foto'}</Text>
                <Text style={styles.infoHint}>Radius otomatis dicek oleh server backend.</Text>
              </View>
            </View>

            <View style={styles.formGap}>
              <Segmented items={photoModes} value={photoMode} onChange={setPhotoMode} />
              <Button
                label="Buka Kamera Depan"
                icon="camera"
                onPress={openCamera}
                disabled={isLoading}
              />
            </View>

            <View style={styles.actionRow}>
              <Button
                label={isLoading ? "Memproses..." : "Absen Masuk"}
                icon="logIn"
                onPress={() => saveAttendance('masuk')}
                disabled={isLoading}
                loading={isLoading}
                style={styles.actionButton}
              />
              <Button
                label={isLoading ? "Memproses..." : "Absen Pulang"}
                icon="logOut"
                onPress={() => saveAttendance('pulang')}
                variant="secondary"
                disabled={isLoading}
                style={styles.actionButton}
              />
            </View>
            <Text style={styles.message}>{message}</Text>
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader title="Jadwal" subtitle="Waktu Kantor" />
            <View style={styles.listGap}>
              {scheduleItems.map(item => (
                <View key={item.label} style={styles.scheduleItem}>
                  <View style={styles.scheduleIcon}>
                    <Icon name="calendar" size={18} color={colors.brand} strokeWidth={2.3} />
                  </View>
                  <View style={styles.scheduleText}>
                    <Text style={styles.scheduleLabel}>{item.label}</Text>
                    <Text style={styles.scheduleValue}>{item.value}</Text>
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

export default AttendanceScreen;

const styles = StyleSheet.create({
  grid: { gap: 16 },
  gridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  mainColumn: { flex: 1 },
  sideColumn: { gap: 16 },
  sideColumnWide: { width: 354 },
  attendanceCard: { gap: 0 },
  photoBox: { flexDirection: 'row', gap: 14, marginTop: 4, borderRadius: radius.md, backgroundColor: colors.panelAlt, borderWidth: 1, borderColor: colors.line, padding: 12 },
  photoPreview: { width: 142, minHeight: 142, borderRadius: radius.md, backgroundColor: colors.brandSoft, borderWidth: 1, borderColor: colors.lineStrong, padding: 10 },
  photoImage: { width: '100%', height: '100%', borderRadius: radius.sm },
  emptyPhotoPreview: { justifyContent: 'center', alignItems: 'center', flex: 1, gap: 10 },
  photoPreviewLabel: { color: colors.brandDark, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  photoInfo: { flex: 1, justifyContent: 'center' },
  infoStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  infoLabel: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  infoValue: { color: colors.ink, fontSize: 17, fontWeight: '900', marginTop: 6, lineHeight: 22 },
  infoHint: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 8 },
  formGap: { gap: 10, marginTop: 14 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  actionButton: { flex: 1, minWidth: 150 },
  message: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 12, fontWeight: '800', lineHeight: 18 },
  listGap: { gap: 10 },
  scheduleItem: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.panelAlt },
  scheduleIcon: { width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  scheduleText: { flex: 1 },
  scheduleLabel: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  scheduleValue: { color: colors.ink, fontSize: 18, fontWeight: '900', marginTop: 3 },
});
