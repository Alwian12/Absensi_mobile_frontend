import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors, radius, requestTheme, statusTheme} from './Theme';
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
      <View style={[styles.dot, {backgroundColor: theme.text}]} />
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
      <View style={[styles.dot, {backgroundColor: theme.text}]} />
      <Text style={[styles.text, {color: theme.text}]}>
        {requestLabel[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '900',
  },
});
