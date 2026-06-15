import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import { MotiView } from 'moti';

import { Icon, IconName } from './Icon';
import { colors, radius, shadows, spacing, gradients } from './Theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md' | 'lg';
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
  size = 'md',
}: ButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'danger':
        return styles.buttonDanger;
      case 'ghost':
        return styles.buttonGhost;
      case 'outline':
        return styles.buttonOutline;
      default:
        return styles.buttonPrimary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.buttonSm;
      case 'lg':
        return styles.buttonLg;
      default:
        return styles.buttonMd;
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary' || variant === 'ghost' || variant === 'outline') {
      return colors.brand;
    }
    return colors.white;
  };

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{ scale: pressed && !disabled ? 0.95 : 1 }}
      transition={{ type: 'timing', duration: 100 }}
    >
      <Pressable
        accessibilityRole="button"
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          styles.button,
          getVariantStyles(),
          getSizeStyles(),
          (disabled || loading) && styles.buttonDisabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : icon ? (
          <Icon
            name={icon}
            size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
            color={getTextColor()}
            strokeWidth={2.3}
          />
        ) : null}
        <Text
          style={[
            styles.buttonText,
            size === 'sm' && styles.buttonTextSm,
            size === 'lg' && styles.buttonTextLg,
            (variant === 'secondary' || variant === 'ghost' || variant === 'outline') && 
              styles.buttonTextSecondary,
            (disabled || loading) && styles.buttonTextDisabled,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </MotiView>
  );
};

type FieldProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: IconName;
  variant?: 'default' | 'glass';
};

export const Field = ({
  label,
  error,
  icon,
  variant = 'default',
  ...props
}: FieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <MotiView
        animate={{
          borderColor: focused ? colors.brand : (error ? colors.red : colors.line),
          scale: focused ? 1.02 : 1,
        }}
        transition={{ type: 'timing', duration: 150 }}
        style={[
          styles.fieldWrapper,
          variant === 'glass' && styles.fieldGlass,
          error && styles.fieldError,
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={18}
            color={focused ? colors.brand : colors.faint}
          />
        )}
        <TextInput
          placeholderTextColor={colors.faint}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            props.style,
          ]}
        />
      </MotiView>
      {error && <Text style={styles.fieldErrorText}>{error}</Text>}
    </View>
  );
};

type SegmentedProps<T extends string> = {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'default' | 'glass';
};

export const Segmented = <T extends string>({
  items,
  value,
  onChange,
  variant = 'default',
}: SegmentedProps<T>) => (
  <MotiView
    style={[
      styles.segmented,
      variant === 'glass' && styles.segmentedGlass,
    ]}
    animate={{ opacity: 1 }}
    from={{ opacity: 0 }}
    transition={{ type: 'timing', duration: 300 }}
  >
    {items.map((item, index) => {
      const active = item === value;

      return (
        <MotiView
          key={item}
          animate={{
            scale: active ? 1.05 : 1,
          }}
          transition={{ type: 'timing', duration: 150 }}
        >
          <Pressable
            onPress={() => onChange(item)}
            style={[
              styles.segmentButton,
              active && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                active && styles.segmentTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        </MotiView>
      );
    })}
  </MotiView>
);

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // ========== BUTTON STYLES ==========
  button: {
    minHeight: 50,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  buttonPrimary: {
    backgroundColor: colors.brand,
    ...shadows.card,
  },

  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.brand,
  },

  buttonDanger: {
    backgroundColor: colors.red,
    ...shadows.card,
  },

  buttonGhost: {
    backgroundColor: 'transparent',
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.line,
  },

  buttonSm: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },

  buttonMd: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
  },

  buttonLg: {
    minHeight: 60,
    paddingHorizontal: spacing.xl,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    flexShrink: 1,
  },

  buttonTextSm: {
    fontSize: 13,
  },

  buttonTextLg: {
    fontSize: 16,
  },

  buttonTextSecondary: {
    color: colors.brand,
  },

  buttonTextDisabled: {
    color: colors.muted,
  },

  // ========== FIELD STYLES ==========
  fieldContainer: {
    gap: spacing.xs,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.xs,
  },

  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadows.xs,
  },

  fieldGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    backdropFilter: 'blur(10px)',
  },

  fieldError: {
    borderColor: colors.red,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },

  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: spacing.sm,
  },

  inputWithIcon: {
    marginLeft: spacing.xs,
  },

  fieldErrorText: {
    color: colors.red,
    fontSize: 12,
    fontWeight: '600',
  },

  // ========== SEGMENTED STYLES ==========
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.panelAlt,
    padding: spacing.xs,
    ...shadows.xs,
  },

  segmentedGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.1)',
  },

  segmentButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'transparent',
  },

  segmentButtonActive: {
    backgroundColor: colors.surface,
    borderColor: colors.brand,
    ...shadows.xs,
  },

  segmentText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  segmentTextActive: {
    color: colors.brand,
  },
});
