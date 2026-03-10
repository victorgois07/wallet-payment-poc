import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { type TextInputProps, View } from 'react-native';
import { Input } from '../atoms/Input';

interface FormFieldProps<T extends FieldValues>
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  mask?: (text: string) => string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  mask,
  ...inputProps
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
          <Input
            label={label}
            value={value as string}
            onChangeText={(text) => {
              const masked = mask ? mask(text) : text;
              onChange(masked);
            }}
            onBlur={onBlur}
            {...(typeof error?.message === 'string' ? { error: error.message } : {})}
            {...inputProps}
          />
        </View>
      )}
    />
  );
}
