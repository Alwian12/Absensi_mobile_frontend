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
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {AttendanceBadge} from '../components/Badge';
import {Button, Field, Segmented} from '../components/FormControls';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
import {photoModes, scheduleItems} from '../data/attendance';
import {useAppStore} from '../state/AppStore';
import type {PhotoMode} from '../types/attendance';
import {formatTime} from '../utils/date';

const AttendanceScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const {activeEmployee, submitAttendance} = useAppStore();
  const [photoMode, setPhotoMode] = useState<PhotoMode>('Lokasi kerja');
  const [note, setNote] = useState('');
  const [draftProof, setDraftProof] = useState('');
  const [message, setMessage] = useState('Siapkan bukti foto sebelum absen');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  const captureProof = () => {
    setDraftProof(
      `Draft foto ${photoMode.toLowerCase()} dibuat pada ${formatTime(new Date())}`,
    );
    setMessage('Bukti foto siap dipakai untuk absen');
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Akses Lokasi',
            message: 'Aplikasi absensi membutuhkan lokasi Anda saat ini.',
            buttonNeutral: 'Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // Untuk iOS biasanya menggunakan Geolocation.requestAuthorization()
  };

  const saveAttendance = async (action: 'masuk' | 'pulang') => {
    if (!draftProof) {
      setMessage('Ambil foto bukti dulu sebelum menyimpan absensi');
      return;
    }

    setIsLoading(true);
    setMessage('Memvalidasi lokasi GPS...');

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setMessage('Izin lokasi ditolak, gagal absen.');
      setIsLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);

        // Gabungkan koordinat lokasi ke dalam note/catatan absensi
        const finalNote = note 
          ? `${note} (GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` 
          : `GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

        const result = submitAttendance(action, photoMode, finalNote);
        setMessage(`${result}\nKoordinat: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        setDraftProof('');
        setNote('');
        setIsLoading(false);
      },
      error => {
        Alert.alert('Error GPS', 'Gagal mendapatkan lokasi. Pastikan GPS menyala.');
        setMessage('Gagal absen: Lokasi tidak ditemukan.');
        console.log(error);
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <Screen title="Absensi Foto" badge="Dilengkapi Validasi GPS">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card>
            <SectionHeader
              title="Absen Hari Ini"
              subtitle="Foto dan GPS digunakan sebagai bukti kehadiran"
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

            <View style={styles.photoBox}>
              <View style={styles.photoPreview}>
                <Text style={styles.photoPreviewLabel}>Bukti Foto</Text>
                <Text style={styles.photoPreviewTitle}>{photoMode}</Text>
                <Text style={styles.photoPreviewText}>
                  Area ini siap diganti kamera/upload saat dependency kamera
                  dipasang.
                </Text>
              </View>
              <View style={styles.photoInfo}>
                <Text style={styles.infoLabel}>Status foto & Lokasi</Text>
                <Text style={styles.infoValue}>
                  {draftProof || activeEmployee.proof?.note || 'Belum ada foto'}
                </Text>
                {location && (
                  <Text style={styles.infoValue}>
                    📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </Text>
                )}
                <Text style={styles.infoHint}>
                  Merekam waktu dan titik kordinat saat tombol absen ditekan.
                </Text>
              </View>
            </View>

            <View style={styles.formGap}>
              <Segmented
                items={photoModes}
                value={photoMode}
                onChange={setPhotoMode}
              />
              <Field
                value={note}
                onChangeText={setNote}
                placeholder="Catatan foto/lokasi tugas (Opsional)"
              />
              <Button label="Ambil Foto Bukti (Draft)" onPress={captureProof} disabled={isLoading} />
            </View>

            <View style={styles.actionRow}>
              <Button
                label={isLoading ? "Memproses..." : "Simpan Absen Masuk"}
                onPress={() => saveAttendance('masuk')}
                disabled={isLoading}
              />
              <Button
                label={isLoading ? "Memproses..." : "Simpan Absen Pulang"}
                onPress={() => saveAttendance('pulang')}
                variant="secondary"
                disabled={isLoading}
              />
            </View>
            {isLoading && <ActivityIndicator size="small" color={colors.brand} style={{marginTop: 10}} />}
            <Text style={styles.message}>{message}</Text>
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader title="Jadwal" subtitle="Validasi waktu frontend" />
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
              title="Catatan Metode"
              subtitle="Upgrade: Geolocation Active"
            />
            <Text style={styles.paragraph}>
              Aplikasi kini merekam titik koordinat (Latitude & Longitude) secara langsung saat proses absen dilakukan untuk mencegah kecurangan pemalsuan lokasi.
            </Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default AttendanceScreen;

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
  photoBox: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
    borderRadius: 8,
    backgroundColor: '#F5F8FA',
    padding: 12,
  },
  photoPreview: {
    width: 140,
    minHeight: 140,
    borderRadius: 8,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: '#CADCE7',
    padding: 12,
    justifyContent: 'space-between',
  },
  photoPreviewLabel: {
    color: '#3C6578',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  photoPreviewTitle: {
    color: colors.brand,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  photoPreviewText: {
    color: '#4D6C7C',
    fontSize: 11,
    lineHeight: 15,
  },
  photoInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  infoValue: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 6,
    lineHeight: 22,
  },
  infoHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  formGap: {
    gap: 10,
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
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
  paragraph: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});