import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {colors} from './Theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export const Button = ({label, onPress, variant = 'primary'}: ButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'danger' && styles.buttonDanger,
      pressed && styles.pressed,
    ]}>
    <Text
      style={[
        styles.buttonText,
        variant === 'secondary' && styles.buttonTextSecondary,
      ]}>
      {label}
    </Text>
  </Pressable>
);

export const Field = (props: TextInputProps) => (
  <TextInput
    placeholderTextColor="#8A97A6"
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
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  buttonSecondary: {
    backgroundColor: '#E9F6EE',
    borderWidth: 1,
    borderColor: '#B7DEC7',
  },
  buttonDanger: {
    backgroundColor: colors.red,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  buttonTextSecondary: {
    color: colors.green,
  },
  input: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E1EA',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 13,
    color: colors.ink,
    fontSize: 14,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5DFE8',
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  segmentButtonActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  segmentText: {
    color: '#52616B',
    fontSize: 12,
    fontWeight: '900',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.76,
  },
});
