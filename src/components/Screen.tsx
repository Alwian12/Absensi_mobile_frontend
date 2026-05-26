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
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors} from './Theme';
import {formatDateLabel} from '../utils/date';

type ScreenProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
};

export const Screen = ({title, subtitle, badge, children}: ScreenProps) => {
  const {width} = useWindowDimensions();
  const isWide = width >= 920;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brand} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.headerInner, isWide && styles.webContainer]}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>SIAP Absensi Kantor</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>
                {subtitle ?? formatDateLabel(new Date())}
              </Text>
            </View>
            {badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Mode</Text>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={[styles.content, isWide && styles.webContainer]}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const SectionHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionText}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
    {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
  </View>
);

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.soft,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: colors.brand,
    paddingBottom: 62,
  },
  headerInner: {
    paddingHorizontal: 18,
    paddingTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
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
    color: '#A7D1E8',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#D6E6F2',
    fontSize: 14,
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#F4C64D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: 170,
  },
  badgeLabel: {
    color: '#634304',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  badgeText: {
    color: '#352400',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 3,
  },
  content: {
    marginTop: -42,
    paddingHorizontal: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  sectionText: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionAction: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    shadowColor: '#0A2540',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
});
