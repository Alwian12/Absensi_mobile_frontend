import React from 'react';
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
} from 'react-native';

import {Icon, IconName} from './Icon';
import {colors, radius} from './Theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled || loading}
    onPress={onPress}
    style={({pressed}) => [
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'danger' && styles.buttonDanger,
      (disabled || loading) && styles.buttonDisabled,
      pressed && !disabled && !loading && styles.pressed,
      style,
    ]}>
    {loading ? (
      <ActivityIndicator
        color={variant === 'secondary' ? colors.brand : colors.white}
      />
    ) : icon ? (
      <Icon
        name={icon}
        size={18}
        color={variant === 'secondary' ? colors.brand : colors.white}
        strokeWidth={2.3}
      />
    ) : null}
    <Text
      style={[
        styles.buttonText,
        variant === 'secondary' && styles.buttonTextSecondary,
        (disabled || loading) &&
          (variant === 'secondary'
            ? styles.buttonTextSecondaryDisabled
            : styles.buttonTextDisabled),
      ]}>
      {label}
    </Text>
  </Pressable>
);

export const Field = (props: TextInputProps) => (
  <TextInput
    placeholderTextColor={colors.faint}
    {...props}
    style={[styles.input, props.style]}
  />
);

export const Segmented = <T extends string>({
  items,
  value,
  onChange,
}: {
  items: T[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <View style={styles.segmented}>
    {items.map(item => {
      const active = item === value;

      return (
        <Pressable
          key={item}
          onPress={() => onChange(item)}
          style={({pressed}) => [
            styles.segmentButton,
            active && styles.segmentButtonActive,
            pressed && styles.pressed,
          ]}>
          <Text
            style={[
              styles.segmentText,
              active && styles.segmentTextActive,
            ]}>
            {item}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  buttonDanger: {
    backgroundColor: colors.red,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    flexShrink: 1,
  },
  buttonTextSecondary: {
    color: colors.brand,
  },
  buttonTextDisabled: {
    color: colors.white,
  },
  buttonTextSecondaryDisabled: {
    color: colors.muted,
  },
  input: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panelAlt,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    borderRadius: radius.md,
    backgroundColor: '#EEF2F5',
    padding: 4,
  },
  segmentButton: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'transparent',
  },
  segmentButtonActive: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  segmentTextActive: {
    color: colors.brandDark,
  },
  pressed: {
    opacity: 0.76,
  },
});
