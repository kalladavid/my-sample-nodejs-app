export const colors = {
  primary: '#2563EB',
  primaryDark: '#004ac6',
  primaryContainer: '#2563eb',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#eeefff',

  secondary: '#006b5f',
  secondaryContainer: '#6df5e1',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#006f64',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceContainer: '#eceef0',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainerHigh: '#e6e8ea',
  surfaceContainerHighest: '#e0e3e5',

  onBackground: '#191c1e',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434655',

  outline: '#737686',
  outlineVariant: '#c3c6d7',

  success: '#22C55E',
  error: '#EF4444',
  accent: '#F59E0B',

  textPrimary: '#111827',
  textSecondary: '#6B7280',

  primaryFixed: '#dbe1ff',
  inversePrimary: '#b4c5ff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const typography = {
  headlineLg: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 36 },
  headlineMd: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  labelMd: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  labelSm: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.5 },
};
