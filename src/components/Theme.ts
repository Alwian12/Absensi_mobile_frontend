export const colors = {
  ink: '#17202A',
  muted: '#64748B',
  faint: '#94A3B8',
  soft: '#F6F7F9',
  surface: '#FFFFFF',
  panel: '#FFFFFF',
  panelAlt: '#F9FAFB',
  line: '#E5E7EB',
  lineStrong: '#CBD5E1',
  brand: '#0F766E',
  brandDark: '#134E4A',
  brandSoft: '#E6FFFB',
  accent: '#F97316',
  accentSoft: '#FFF3E8',
  green: '#15803D',
  amber: '#B45309',
  blue: '#2563EB',
  red: '#B42318',
  danger: '#B42318',
  graphite: '#111827',
  white: '#FFFFFF',
};

export const radius = {
  sm: 6,
  md: 8,
};

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  lift: {
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
};

export const statusTheme = {
  hadir: {
    container: '#E9F8EF',
    text: colors.green,
  },
  terlambat: {
    container: '#FFF6E7',
    text: colors.amber,
  },
  izin: {
    container: '#EAF1FF',
    text: colors.blue,
  },
  alpa: {
    container: '#FEECEC',
    text: colors.red,
  },
};

export const requestTheme = {
  menunggu: {
    container: '#FFF6E7',
    text: colors.amber,
  },
  disetujui: {
    container: '#E9F8EF',
    text: colors.green,
  },
  ditolak: {
    container: '#FEECEC',
    text: colors.red,
  },
};
