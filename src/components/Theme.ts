// ============================================
// MODERN & VIBRANT COLOR PALETTE
// ============================================

export const colors = {
  // Neutrals
  ink: '#0F172A',
  muted: '#64748B',
  faint: '#94A3B8',
  soft: '#F8FAFC',
  surface: '#FFFFFF',
  panel: '#FFFFFF',
  panelAlt: '#F8FAFC',
  line: '#E2E8F0',
  lineStrong: '#CBD5E1',
  graphite: '#1E293B',
  white: '#FFFFFF',
  
  // Primary Brand - Modern Teal/Cyan
  brand: '#06B6D4',
  brandDark: '#0891B2',
  brandLight: '#A5F3FC',
  brandSoft: '#E0F2FE',
  
  // Accent - Vibrant Pink/Magenta
  accent: '#EC4899',
  accentDark: '#BE185D',
  accentLight: '#F472B6',
  accentSoft: '#FCE7F3',
  
  // Status Colors
  green: '#10B981',
  amber: '#F59E0B',
  blue: '#3B82F6',
  red: '#EF4444',
  purple: '#A855F7',
  
  // Legacy Names (for backward compatibility)
  danger: '#EF4444',
  brandSoft: '#E0F2FE',
};

// ============================================
// GRADIENTS
// ============================================
export const gradients = {
  // Brand gradient (Teal to Cyan)
  brand: ['#06B6D4', '#0891B2'],
  
  // Accent gradient (Pink to Magenta)
  accent: ['#EC4899', '#D946EF'],
  
  // Modern blue gradient
  blue: ['#3B82F6', '#1D4ED8'],
  
  // Vibrant purple gradient
  purple: ['#A855F7', '#7C3AED'],
  
  // Soft gradients for backgrounds
  softBrand: ['#E0F2FE', '#F0F9FF'],
  softAccent: ['#FCE7F3', '#FDF2F8'],
  softPurple: ['#F3E8FF', '#FAF5FF'],
};

// ============================================
// BORDER RADIUS
// ============================================
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============================================
// SHADOWS - Modern & Subtle
// ============================================
export const shadows = {
  // Small subtle shadow
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Standard card shadow
  card: {
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  
  // Elevated card shadow
  lift: {
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  
  // Large elevation
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
};

// ============================================
// GLASSMORPHISM (for future use with Blur)
// ============================================
export const glass = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dark: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
};

// ============================================
// STATUS THEME - Enhanced Colors
// ============================================
export const statusTheme = {
  hadir: {
    container: '#D1FAE5',
    text: '#059669',
    background: '#F0FDF4',
    border: '#86EFAC',
  },
  terlambat: {
    container: '#FEF3C7',
    text: '#D97706',
    background: '#FFFBEB',
    border: '#FCD34D',
  },
  izin: {
    container: '#DBEAFE',
    text: '#2563EB',
    background: '#F0F9FF',
    border: '#93C5FD',
  },
  alpa: {
    container: '#FECACA',
    text: '#DC2626',
    background: '#FEF2F2',
    border: '#FCA5A5',
  },
};

// ============================================
// REQUEST THEME - Enhanced Colors
// ============================================
export const requestTheme = {
  menunggu: {
    container: '#FEF3C7',
    text: '#D97706',
    background: '#FFFBEB',
    border: '#FCD34D',
  },
  disetujui: {
    container: '#D1FAE5',
    text: '#059669',
    background: '#F0FDF4',
    border: '#86EFAC',
  },
  ditolak: {
    container: '#FECACA',
    text: '#DC2626',
    background: '#FEF2F2',
    border: '#FCA5A5',
  },
};

// ============================================
// SPACING SYSTEM
// ============================================
export const spacing = {
  0: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  2xl: 32,
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '900' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};
