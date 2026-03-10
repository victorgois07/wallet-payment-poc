import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

function isLuhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  const sum = [...digits].reverse().reduce<number>((acc, char, index) => {
    let digit = Number.parseInt(char, 10);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    return acc + digit;
  }, 0);
  return sum % 10 === 0;
}

function isExpirationDateInFuture(value: string): boolean {
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (match === null) return false;
  const month = Number.parseInt(match[1], 10);
  const year = 2000 + Number.parseInt(match[2], 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(19, 'Numero do cartao invalido')
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Formato: 0000 0000 0000 0000')
    .refine(isLuhnValid, 'Numero do cartao invalido'),
  holderName: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .refine((v) => v.trim().split(/\s+/).filter(Boolean).length >= 2, 'Informe nome e sobrenome'),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato: MM/AA')
    .refine(isExpirationDateInFuture, 'Validade deve ser uma data futura'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 digitos'),
  amount: z
    .string()
    .min(1, 'Informe o valor')
    .refine(
      (v) => Number(v.replace(/[^\d,]/g, '').replace(',', '.')) > 0,
      'Valor deve ser maior que zero',
    ),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}

function maskCardNumber(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function maskExpirationDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function maskCvv(text: string): string {
  return text.replace(/\D/g, '').slice(0, 4);
}

function maskAmount(text: string): string {
  return text.replace(/[^\d,.]/g, '');
}

export function PaymentForm({ onSubmit, isLoading = false }: PaymentFormProps) {
  const { control, handleSubmit } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      holderName: '',
      expirationDate: '',
      cvv: '',
      amount: '',
    },
  });

  return (
    <View
      className="px-4 py-6"
      accessibilityRole="none"
      accessibilityLabel="Formulario de pagamento"
    >
      <FormField
        control={control}
        name="cardNumber"
        label="Numero do Cartao"
        placeholder="0000 0000 0000 0000"
        keyboardType="numeric"
        mask={maskCardNumber}
        maxLength={19}
        accessibilityHint="Insira os 16 digitos do cartao"
      />
      <FormField
        control={control}
        name="holderName"
        label="Nome do Titular"
        placeholder="NOME COMO NO CARTAO"
        autoCapitalize="characters"
        accessibilityHint="Insira o nome impresso no cartao"
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            control={control}
            name="expirationDate"
            label="Validade"
            placeholder="MM/AA"
            keyboardType="numeric"
            mask={maskExpirationDate}
            maxLength={5}
          />
        </View>
        <View className="flex-1">
          <FormField
            control={control}
            name="cvv"
            label="CVV"
            placeholder="000"
            keyboardType="numeric"
            mask={maskCvv}
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
      <FormField
        control={control}
        name="amount"
        label="Valor (R$)"
        placeholder="0,00"
        keyboardType="decimal-pad"
        mask={maskAmount}
        accessibilityHint="Insira o valor do pagamento em reais"
      />
      <Button
        title="Pagar"
        variant="primaryDarkText"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
}
