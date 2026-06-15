import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';

import { colors, radius, requestTheme, statusTheme, shadows, spacing } from './Theme';
import type { AttendanceStatus, RequestStatus } from '../types/attendance';

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

// ============================================
// ATTENDANCE BADGE - Status Kehadiran
// ============================================
type AttendanceBadgeProps = {
  status: AttendanceStatus;
  variant?: 'default' | 'compact' | 'large';
  animated?: boolean;
};

export const AttendanceBadge = ({
  status,
  variant = 'default',
  animated = true,
}: AttendanceBadgeProps) => {
  const theme = statusTheme[status];

  const getSizeStyles = () => {
    switch (variant) {
      case 'compact':
        return styles.badgeCompact;
      case 'large':
        return styles.badgeLarge;
      default:
        return styles.badgeDefault;
    }
  };

  const content = (
    <View
      style={[
        styles.badge,
        getSizeStyles(),
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Animated Pulse Dot */}
      <MotiView
        animate={{
          scale: animated ? [1, 1.2, 1] : 1,
          opacity: animated ? [1, 0.8, 1] : 1,
        }}
        transition={{
          type: 'timing',
          duration: 2000,
          loop: true,
        }}
      >
        <View style={[styles.dot, { backgroundColor: theme.text }]} />
      </MotiView>

      <Text style={[styles.text, { color: theme.text }]}>
        {statusLabel[status]}
      </Text>
    </View>
  );

  if (!animated) return content;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      {content}
    </MotiView>
  );
};

// ============================================
// REQUEST BADGE - Status Pengajuan
// ============================================
type RequestBadgeProps = {
  status: RequestStatus;
  variant?: 'default' | 'compact' | 'large';
  animated?: boolean;
};

export const RequestBadge = ({
  status,
  variant = 'default',
  animated = true,
}: RequestBadgeProps) => {
  const theme = requestTheme[status];

  const getSizeStyles = () => {
    switch (variant) {
      case 'compact':
        return styles.badgeCompact;
      case 'large':
        return styles.badgeLarge;
      default:
        return styles.badgeDefault;
    }
  };

  const content = (
    <View
      style={[
        styles.badge,
        getSizeStyles(),
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Animated Pulse Dot */}
      <MotiView
        animate={{
          scale: animated && status === 'menunggu' ? [1, 1.3, 1] : 1,
          opacity: animated && status === 'menunggu' ? [1, 0.7, 1] : 1,
        }}
        transition={{
          type: 'timing',
          duration: status === 'menunggu' ? 1500 : 0,
          loop: status === 'menunggu',
        }}
      >
        <View style={[styles.dot, { backgroundColor: theme.text }]} />
      </MotiView>

      <Text style={[styles.text, { color: theme.text }]}>
        {requestLabel[status]}
      </Text>
    </View>
  );

  if (!animated) return content;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      {content}
    </MotiView>
  );
};

// ============================================
// CUSTOM BADGE - Flexible Badge Component
// ============================================
type CustomBadgeProps = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor?: string;
  variant?: 'default' | 'compact' | 'large';
};

export const CustomBadge = ({
  label,
  color,
  backgroundColor,
  borderColor,
  variant = 'default',
}: CustomBadgeProps) => {
  const getSizeStyles = () => {
    switch (variant) {
      case 'compact':
        return styles.badgeCompact;
      case 'large':
        return styles.badgeLarge;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <View
        style={[
          styles.badge,
          getSizeStyles(),
          {
            backgroundColor,
            borderColor: borderColor || backgroundColor,
          },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.text, { color }]}>{label}</Text>
      </View>
    </MotiView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Base Badge Styles
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.xs,
  },

  badgeDefault: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  badgeCompact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  badgeLarge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  text: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
