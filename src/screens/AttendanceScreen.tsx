import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import api from '../utils/api'; // Import koneksi API kita

import {Button, Segmented} from '../components/FormControls';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
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
          <Card>
            <SectionHeader
              title="Absen Hari Ini"
              subtitle="Pastikan wajah terlihat jelas dan berada di area kantor"
            />
            
            <View style={styles.photoBox}>
              <View style={styles.photoPreview}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoImage} />
                ) : (
                  <View style={styles.emptyPhotoPreview}>
                     <Text style={styles.photoPreviewLabel}>Wajib Selfie</Text>
                  </View>
                )}
              </View>
              <View style={styles.photoInfo}>
                <Text style={styles.infoLabel}>Status Pengiriman</Text>
                <Text style={styles.infoValue}>{photoUri ? 'Foto Tersimpan (Draft)' : 'Belum ada foto'}</Text>
                <Text style={styles.infoHint}>Radius otomatis dicek oleh server backend.</Text>
              </View>
            </View>

            <View style={styles.formGap}>
              <Segmented items={photoModes} value={photoMode} onChange={setPhotoMode} />
              <Button label="Buka Kamera Depan" onPress={openCamera} disabled={isLoading} />
            </View>

            <View style={styles.actionRow}>
              <Button
                label={isLoading ? "Memproses..." : "Absen Masuk"}
                onPress={() => saveAttendance('masuk')}
                disabled={isLoading}
              />
              <Button
                label={isLoading ? "Memproses..." : "Absen Pulang"}
                onPress={() => saveAttendance('pulang')}
                variant="secondary"
                disabled={isLoading}
              />
            </View>
            {isLoading && <ActivityIndicator size="small" color={colors.brand} style={styles.loader} />}
            <Text style={styles.message}>{message}</Text>
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader title="Jadwal" subtitle="Waktu Kantor" />
            <View style={styles.listGap}>
              {scheduleItems.map(item => (
                <View key={item.label} style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>{item.label}</Text>
                  <Text style={styles.scheduleValue}>{item.value}</Text>
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
  photoBox: { flexDirection: 'row', gap: 14, marginTop: 18, borderRadius: 8, backgroundColor: '#F5F8FA', padding: 12 },
  photoPreview: { width: 140, minHeight: 140, borderRadius: 8, backgroundColor: colors.brandSoft, borderWidth: 1, borderColor: '#CADCE7', padding: 12 },
  photoImage: { width: '100%', height: '100%', borderRadius: 8 },
  emptyPhotoPreview: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  photoPreviewLabel: { color: '#3C6578', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  photoInfo: { flex: 1, justifyContent: 'center' },
  infoLabel: { color: colors.muted, fontSize: 13, fontWeight: '900' },
  infoValue: { color: colors.ink, fontSize: 17, fontWeight: '900', marginTop: 6, lineHeight: 22 },
  infoHint: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 8 },
  formGap: { gap: 10, marginTop: 14 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  loader: { marginTop: 10 },
  message: { color: colors.danger || 'red', fontSize: 13, textAlign: 'center', marginTop: 12, fontWeight: 'bold' },
  listGap: { gap: 10 },
  scheduleItem: { borderRadius: 8, borderWidth: 1, borderColor: colors.line, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scheduleLabel: { color: colors.muted, fontSize: 13, fontWeight: '900' },
  scheduleValue: { color: colors.ink, fontSize: 18, fontWeight: '900' },
});
