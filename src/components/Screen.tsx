import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  StyleProp,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { colors, radius, shadows, spacing } from './Theme';
import { formatDateLabel } from '../utils/date';

type ScreenProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
};

export const Screen = ({ title, subtitle, badge, children }: ScreenProps) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 920;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.graphite} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header dengan Gradient Background */}
        <View style={styles.header}>
          <View style={styles.accentStrip} />
          <View style={[styles.headerInner, isWide && styles.webContainer]}>
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 600 }}
              style={styles.headerText}
            >
              <Text style={styles.eyebrow}>SIAP Absensi Kantor</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>
                {subtitle ?? formatDateLabel(new Date())}
              </Text>
            </MotiView>

            {badge ? (
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 600, delay: 100 }}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeLabel}>Status</Text>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              </MotiView>
            ) : null}
          </View>
        </View>

        {/* Content Container */}
        <View style={[styles.content, isWide && styles.webContainer]}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: string;
};

export const SectionHeader = ({
  title,
  subtitle,
  action,
}: SectionHeaderProps) => (
  <MotiView
    from={{ opacity: 0, translateY: 10 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 400 }}
  >
    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  </MotiView>
);

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'glass' | 'elevated';
};

export const Card = ({
  children,
  style,
  variant = 'default',
}: CardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return styles.cardGlass;
      case 'elevated':
        return styles.cardElevated;
      default:
        return styles.cardDefault;
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <View style={[styles.card, getVariantStyles(), style]}>
        {children}
      </View>
    </MotiView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // ========== SAFE AREA & SCROLL ==========
  safeArea: {
    flex: 1,
    backgroundColor: colors.soft,
  },

  scrollContent: {
    paddingBottom: 92,
  },

  // ========== HEADER STYLES ==========
  header: {
    backgroundColor: colors.graphite,
    paddingBottom: 54,
    overflow: 'hidden',
  },

  accentStrip: {
    height: 5,
    backgroundColor: colors.accent,
    opacity: 0.95,
  },

  headerInner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },

  webContainer: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    color: '#A5F3FC',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 40,
  },

  subtitle: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: spacing.sm,
    lineHeight: 20,
    fontWeight: '500',
  },

  badge: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minWidth: 140,
    ...shadows.card,
  },

  badgeLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  badgeText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    marginTop: spacing.xs,
    lineHeight: 18,
  },

  // ========== CONTENT STYLES ==========
  content: {
    marginTop: -32,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },

  // ========== SECTION HEADER STYLES ==========
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  sectionText: {
    flex: 1,
    minWidth: 0,
  },

  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 24,
  },

  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
    fontWeight: '500',
  },

  sectionAction: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    backgroundColor: colors.brandSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    overflow: 'hidden',
  },

  // ========== CARD STYLES ==========
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },

  cardDefault: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    ...shadows.card,
  },

  cardGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    ...shadows.xs,
  },

  cardElevated: {
    backgroundColor: colors.panel,
    borderColor: 'transparent',
    ...shadows.lift,
  },
});
