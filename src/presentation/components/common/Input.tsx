import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  disabled = false,
  multiline = false,
  numberOfLines = 1,
}: InputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TextInput
            label={label}
            placeholder={placeholder || ''}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            disabled={disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            error={!!error}
            mode="outlined"
            style={{ marginBottom: 8 }}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </>
      )}
    />
  );
}