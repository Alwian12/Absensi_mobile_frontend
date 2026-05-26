import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {requestTheme, statusTheme} from './Theme';
import type {AttendanceStatus, RequestStatus} from '../types/attendance';

const statusLabel: Record<AttendanceStatus, string> = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  izin: 'Izin',
  alpa: 'Alpa',
};

const requestLabel: Record<RequestStatus, string> = {
  menunggu: 'Menunggu',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

export const AttendanceBadge = ({status}: {status: AttendanceStatus}) => {
  const theme = statusTheme[status];

  return (
    <View style={[styles.badge, {backgroundColor: theme.container}]}>
      <Text style={[styles.text, {color: theme.text}]}>
        {statusLabel[status]}
      </Text>
    </View>
  );
};

export const RequestBadge = ({status}: {status: RequestStatus}) => {
  const theme = requestTheme[status];

  return (
    <View style={[styles.badge, {backgroundColor: theme.container}]}>
      <Text style={[styles.text, {color: theme.text}]}>
        {requestLabel[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '900',
  },
});
