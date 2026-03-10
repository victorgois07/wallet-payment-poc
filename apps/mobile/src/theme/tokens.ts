export const colors = {
  primary: {
    DEFAULT: '#1A237E',
    50: '#E8EAF6',
    100: '#C5CAE9',
    200: '#9FA8DA',
    300: '#7986CB',
    400: '#5C6BC0',
    500: '#3F51B5',
    600: '#3949AB',
    700: '#303F9F',
    800: '#283593',
    900: '#1A237E',
  },
  accent: {
    DEFAULT: '#FFD600',
    light: '#FFF176',
    dark: '#F9A825',
  },
  success: { DEFAULT: '#4CAF50', light: '#81C784', dark: '#388E3C' },
  error: { DEFAULT: '#F44336', light: '#E57373', dark: '#D32F2F' },
  warning: { DEFAULT: '#FF9800', light: '#FFB74D', dark: '#F57C00' },
  surface: { DEFAULT: '#FFFFFF', secondary: '#F5F5F5', tertiary: '#EEEEEE' },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const borderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const statusColors: Record<string, string> = {
  APPROVED: colors.success.DEFAULT,
  REFUSED: colors.error.DEFAULT,
  ERROR: colors.error.dark,
  PROCESSING: colors.primary.DEFAULT,
};
