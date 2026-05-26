import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';

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

  const captureProof = () => {
    setDraftProof(
      `Draft foto ${photoMode.toLowerCase()} dibuat pada ${formatTime(new Date())}`,
    );
    setMessage('Bukti foto siap dipakai untuk absen');
  };

  const saveAttendance = (action: 'masuk' | 'pulang') => {
    if (!draftProof) {
      setMessage('Ambil foto bukti dulu sebelum menyimpan absensi');
      return;
    }

    const result = submitAttendance(action, photoMode, note);
    setMessage(result);
    setDraftProof('');
    setNote('');
  };

  return (
    <Screen title="Absensi Foto" badge="Bukti, bukan face verification">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card>
            <SectionHeader
              title="Absen Hari Ini"
              subtitle="Foto hanya menjadi lampiran bukti kehadiran"
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
                <Text style={styles.infoLabel}>Status foto</Text>
                <Text style={styles.infoValue}>
                  {draftProof || activeEmployee.proof?.note || 'Belum ada foto'}
                </Text>
                <Text style={styles.infoHint}>
                  Tidak ada pencocokan wajah, liveness, atau biometrik.
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
                placeholder="Catatan foto/lokasi tugas"
              />
              <Button label="Ambil Foto Bukti" onPress={captureProof} />
            </View>

            <View style={styles.actionRow}>
              <Button
                label="Simpan Absen Masuk"
                onPress={() => saveAttendance('masuk')}
              />
              <Button
                label="Simpan Absen Pulang"
                onPress={() => saveAttendance('pulang')}
                variant="secondary"
              />
            </View>
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
              subtitle="Sesuai arahan: foto bukan verifikasi wajah"
            />
            <Text style={styles.paragraph}>
              Bukti foto disimpan sebagai lampiran aktivitas. Validasi yang
              disiapkan di frontend adalah waktu, lokasi kerja, catatan, dan
              status absen.
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
