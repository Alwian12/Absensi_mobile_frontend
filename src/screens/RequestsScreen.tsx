import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';

import {RequestBadge} from '../components/Badge';
import {Button, Field, Segmented} from '../components/FormControls';
import {Card, Screen, SectionHeader} from '../components/Screen';
import {colors} from '../components/Theme';
import {useAppStore} from '../state/AppStore';

const requestTypes = ['Izin', 'Sakit', 'Lembur', 'Koreksi Absensi'] as const;

const RequestsScreen = () => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;
  const {requests, addRequest, decideRequest, user, activeEmployee} =
    useAppStore();
  const [type, setType] = useState<(typeof requestTypes)[number]>('Izin');
  const [date, setDate] = useState('26 Mei 2026');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('Pengajuan baru akan masuk antrean HR');

  const isManager = user?.role !== 'pegawai';

  const visibleRequests = useMemo(
    () =>
      isManager
        ? requests
        : requests.filter(request => request.employeeId === activeEmployee.id),
    [activeEmployee.id, isManager, requests],
  );

  const submit = () => {
    const result = addRequest({
      type,
      date,
      reason,
    });
    setReason('');
    setMessage(result);
  };

  return (
    <Screen title="Pengajuan Absensi" badge="Izin, lembur, koreksi">
      <View style={[styles.grid, isWide && styles.gridWide]}>
        <View style={styles.mainColumn}>
          <Card>
            <SectionHeader
              title="Form Pengajuan"
              subtitle="Data tersimpan lokal selama sesi frontend"
            />
            <View style={styles.formGap}>
              <Segmented
                items={[...requestTypes]}
                value={type}
                onChange={setType}
              />
              <Field value={date} onChangeText={setDate} placeholder="Tanggal" />
              <Field
                value={reason}
                onChangeText={setReason}
                placeholder="Alasan atau catatan"
                multiline
              />
              <Button label="Kirim Pengajuan" onPress={submit} />
              <Text style={styles.message}>{message}</Text>
            </View>
          </Card>
        </View>

        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <Card>
            <SectionHeader
              title="Daftar Pengajuan"
              subtitle={
                isManager
                  ? 'Admin dan atasan dapat memberi keputusan'
                  : 'Pengajuan milik pegawai aktif'
              }
              action={`${visibleRequests.length} data`}
            />
            <View style={styles.requestList}>
              {visibleRequests.map(item => (
                <View key={item.id} style={styles.requestCard}>
                  <View style={styles.requestTop}>
                    <View style={styles.requestText}>
                      <Text style={styles.requestType}>{item.type}</Text>
                      <Text style={styles.requestEmployee}>
                        {item.employee} - {item.date}
                      </Text>
                    </View>
                    <RequestBadge status={item.status} />
                  </View>
                  <Text style={styles.reason}>{item.reason}</Text>
                  {isManager && item.status === 'menunggu' ? (
                    <View style={styles.decisionRow}>
                      <Button
                        label="Setujui"
                        onPress={() => decideRequest(item.id, 'disetujui')}
                      />
                      <Button
                        label="Tolak"
                        onPress={() => decideRequest(item.id, 'ditolak')}
                        variant="danger"
                      />
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
};

export default RequestsScreen;

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
    width: 520,
  },
  formGap: {
    gap: 10,
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  requestList: {
    gap: 10,
  },
  requestCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 10,
  },
  requestTop: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  requestText: {
    flex: 1,
    minWidth: 0,
  },
  requestType: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  requestEmployee: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  reason: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
