import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  // Primary colors
  primary: {
    light: '#E8E1FF', // Light lavender
    main: '#9F8FEF',  // Main lavender
    dark: '#7A6CD8',  // Dark lavender
  },
  // Secondary colors
  secondary: {
    light: '#CFFAFF',
    main: '#7FE4DD', // Teal
    dark: '#49C7BD',
  },
  // Accent colors
  accent: {
    light: '#FFF2CC',
    main: '#FFD466', // Yellow
    dark: '#F5B800',
  },
  // System colors
  success: {
    light: '#D1F7E0',
    main: '#5ED797',
    dark: '#36AC70',
  },
  error: {
    light: '#FFE2E0',
    main: '#FF7A73',
    dark: '#E64C42',
  },
  warning: {
    light: '#FFF2DD',
    main: '#FFCC75',
    dark: '#F5AA3C',
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    background: '#F8F9FB',
    lightGray: '#EEF1F7',
    mediumGray: '#C6CED9',
    gray: '#8997AB',
    darkGray: '#59606D',
    black: '#1E232C',
  },
  // Special UI colors
  ui: {
    cardBg: '#FFFFFF',
    divider: '#EEF1F7',
    inputBg: '#F8F9FB',
    placeholder: '#C6CED9',
    overlay: 'rgba(30, 35, 44, 0.5)',
  },
  // Gradients (endpoints)
  gradients: {
    primaryGradient: ['#9F8FEF', '#7FE4DD'] as const,
    secondaryGradient: ['#7FE4DD', '#49C7BD'] as const,
    accentGradient: ['#FFD466', '#FF7A73'] as const,
    darkGradient: ['#1E232C', '#3D4456'] as const,
  }
};

// Typography
export const typography = {
  font: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semiBold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

// Spacing (8px system)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 999,
};

// Shadows
export const shadows = StyleSheet.create({
  small: {
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
});

// Animation timings
export const animationDurations = {
  short: 200,
  medium: 350,
  long: 500,
};