import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View, useWindowDimensions} from 'react-native';

import {AttendanceBadge} from '../components/Badge';
import {Field, Segmented} from '../components/FormControls';
import {Icon} from '../components/Icon';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors, radius} from '../components/Theme';
import {useAppStore} from '../state/AppStore';
import type {AttendanceRecord, AttendanceStatus} from '../types/attendance';

const filters: Array<'semua' | AttendanceStatus> = [
  'semua',
  'hadir',
  'terlambat',
  'izin',
  'alpa',
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2);

const TeamScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const {attendanceRecords} = useAppStore();
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('semua');
  const [selectedId, setSelectedId] = useState(attendanceRecords[0].id);

  const filteredRecords = useMemo(() => {
    const cleanKeyword = keyword.trim().toLowerCase();

    return attendanceRecords.filter(record => {
      const matchStatus = filter === 'semua' || record.status === filter;
      const matchKeyword =
        !cleanKeyword ||
        [record.name, record.role, record.department, record.location]
          .join(' ')
          .toLowerCase()
          .includes(cleanKeyword);

      return matchStatus && matchKeyword;
    });
  }, [attendanceRecords, filter, keyword]);

  const selectedRecord =
    attendanceRecords.find(record => record.id === selectedId) ??
    attendanceRecords[0];

  return (
    <Screen title="Monitoring Tim" badge="Admin dan atasan">
      <Card>
        <SectionHeader
          title="Pencarian Pegawai"
          subtitle="Pantau status, lokasi, dan lampiran foto"
          action={`${filteredRecords.length} data`}
        />
        <View style={styles.filterGap}>
          <Field
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Cari nama, jabatan, departemen, lokasi"
          />
          <Segmented items={filters} value={filter} onChange={setFilter} />
        </View>
      </Card>

      <View style={[styles.grid, isWide && styles.gridWide]}>
        <Card style={isWide && styles.listPanel}>
          <SectionHeader title="Daftar Absensi" />
          <View style={styles.list}>
            {filteredRecords.map(record => (
              <TeamItem
                key={record.id}
                item={record}
                selected={record.id === selectedRecord.id}
                onPress={() => setSelectedId(record.id)}
              />
            ))}
          </View>
        </Card>

        <Card style={isWide && styles.detailPanel}>
          <SectionHeader
            title="Detail Pegawai"
            subtitle="Ringkasan absensi hari ini"
          />
          <View style={styles.detailHeader}>
            <View style={styles.detailAvatar}>
              <Text style={styles.detailAvatarText}>
                {getInitials(selectedRecord.name)}
              </Text>
            </View>
            <View style={styles.detailText}>
              <Text style={styles.detailName}>{selectedRecord.name}</Text>
              <Text style={styles.detailMeta}>
                {selectedRecord.role} - {selectedRecord.department}
              </Text>
            </View>
            <AttendanceBadge status={selectedRecord.status} />
          </View>
          <View style={styles.detailGrid}>
            <InfoBox label="Masuk" value={selectedRecord.checkIn} />
            <InfoBox label="Pulang" value={selectedRecord.checkOut} />
            <InfoBox label="Lokasi" value={selectedRecord.location} />
            <InfoBox
              label="Bukti"
              value={selectedRecord.proof?.mode ?? 'Belum ada'}
            />
          </View>
          <View style={styles.proofBox}>
            <View style={styles.proofTitleRow}>
              <Icon name="camera" size={17} color={colors.brand} strokeWidth={2.3} />
              <Text style={styles.proofTitle}>Catatan bukti foto</Text>
            </View>
            <Text style={styles.proofText}>
              {selectedRecord.proof?.note ??
                'Pegawai belum melampirkan bukti foto.'}
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

const TeamItem = ({
  item,
  selected,
  onPress,
}: {
  item: AttendanceRecord;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.item,
      selected && styles.itemSelected,
      pressed && styles.pressed,
    ]}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
    </View>
    <View style={styles.itemText}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemMeta}>
        {item.role} - {item.location}
      </Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>Masuk {item.checkIn}</Text>
        <Text style={styles.timeText}>Pulang {item.checkOut}</Text>
      </View>
    </View>
    <AttendanceBadge status={item.status} />
  </Pressable>
);

const InfoBox = ({label, value}: {label: string; value: string}) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default TeamScreen;

const styles = StyleSheet.create({
  filterGap: {
    gap: 10,
  },
  grid: {
    gap: 16,
  },
  gridWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listPanel: {
    flex: 1,
  },
  detailPanel: {
    width: 410,
  },
  list: {
    gap: 10,
  },
  item: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.brandDark,
    fontSize: 16,
    fontWeight: '900',
  },
  itemText: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  itemMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  timeText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailAvatar: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailAvatarText: {
    color: colors.brand,
    fontSize: 17,
    fontWeight: '900',
  },
  detailText: {
    flex: 1,
    minWidth: 0,
  },
  detailName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  detailMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  infoBox: {
    width: '48%',
    minHeight: 78,
    borderRadius: radius.md,
    backgroundColor: colors.panelAlt,
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
    fontSize: 16,
    fontWeight: '900',
    marginTop: 7,
  },
  proofBox: {
    borderRadius: radius.md,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginTop: 12,
  },
  proofTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  proofTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  proofText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.78,
  },
});
