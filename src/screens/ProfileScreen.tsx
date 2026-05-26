import React, {useState} from 'react';
import {Switch, StyleSheet, Text, View, useWindowDimensions} from 'react-native';

import {Button} from '../components/FormControls';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
import {useAppStore} from '../state/AppStore';

const ProfileScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const {user, activeEmployee, signOut} = useAppStore();
  const [photoRequired, setPhotoRequired] = useState(true);
  const [locationRequired, setLocationRequired] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState(true);

  return (
    <Screen title="Profil dan Pengaturan" badge="Siap disesuaikan desain">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card>
            <SectionHeader
              title="Profil Aktif"
              subtitle="Akun demo untuk menguji role aplikasi"
            />
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {activeEmployee.name
                    .split(' ')
                    .map(part => part[0])
                    .join('')
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.meta}>
                  {activeEmployee.role} - {activeEmployee.department}
                </Text>
                <Text style={styles.meta}>Role aplikasi: {user?.role}</Text>
              </View>
            </View>
          </Card>

          <Card>
            <SectionHeader
              title="Pengaturan Absensi"
              subtitle="Kontrol frontend untuk aturan standar"
            />
            <SettingRow
              title="Wajib bukti foto"
              description="Foto menjadi lampiran, bukan verifikasi muka"
              value={photoRequired}
              onValueChange={setPhotoRequired}
            />
            <SettingRow
              title="Validasi lokasi"
              description="Cocok untuk radius kantor dan pegawai lapangan"
              value={locationRequired}
              onValueChange={setLocationRequired}
            />
            <SettingRow
              title="Antrean offline"
              description="Draft absensi bisa disimpan sebelum sinkron"
              value={offlineQueue}
              onValueChange={setOfflineQueue}
            />
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader
              title="Kesiapan Integrasi"
              subtitle="Bagian yang nanti disambungkan backend"
            />
            <View style={styles.integrationList}>
              <InfoLine label="API absensi" value="Belum tersambung" />
              <InfoLine label="Kamera/upload" value="Siap dipasang" />
              <InfoLine label="Export laporan" value="Simulasi frontend" />
              <InfoLine label="Role akses" value="Pegawai/Admin/Atasan" />
            </View>
          </Card>

          <Card>
            <Button label="Keluar" onPress={signOut} variant="danger" />
          </Card>
        </View>
      </View>
    </Screen>
  );
};

const SettingRow = ({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingText}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingDescription}>{description}</Text>
    </View>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const InfoLine = ({label, value}: {label: string; value: string}) => (
  <View style={styles.infoLine}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default ProfileScreen;

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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#DDEAF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.brand,
    fontSize: 18,
    fontWeight: '900',
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  settingRow: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  settingText: {
    flex: 1,
    minWidth: 0,
  },
  settingTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  settingDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  integrationList: {
    gap: 10,
  },
  infoLine: {
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  infoValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },
});
