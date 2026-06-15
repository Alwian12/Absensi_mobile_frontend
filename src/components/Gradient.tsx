import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { gradients, colors } from './Theme';

type GradientOverlayProps = {
  variant?: 'brand' | 'accent' | 'blue' | 'purple' | 'softBrand' | 'softAccent' | 'softPurple';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  opacity?: number;
};

/**
 * Modern Gradient Overlay Component
 * Wraps content with beautiful linear gradients
 */
export const GradientOverlay = ({
  variant = 'brand',
  style,
  children,
  opacity = 1,
}: GradientOverlayProps) => {
  const getGradientColors = () => {
    const gradient = gradients[variant];
    return [gradient[0], gradient[1]];
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradient,
        { opacity },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

/**
 * Glassmorphic Card with Blur Effect
 * Modern frosted glass appearance
 */
type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export const GlassCard = ({
  children,
  style,
  intensity = 0.8,
}: GlassCardProps) => {
  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: `rgba(255, 255, 255, ${intensity})`,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * Animated Background Gradient
 * Dynamic gradient background for screens
 */
type AnimatedGradientBgProps = {
  variant?: 'soft' | 'vibrant';
  children: React.ReactNode;
};

export const AnimatedGradientBg = ({
  variant = 'soft',
  children,
}: AnimatedGradientBgProps) => {
  const isVibrant = variant === 'vibrant';
  const startColor = isVibrant ? '#06B6D4' : '#E0F2FE';
  const endColor = isVibrant ? '#0891B2' : '#F0F9FF';

  return (
    <LinearGradient
      colors={[startColor, endColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fullScreen}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: '100%',
  },
  glassCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
  },
});
