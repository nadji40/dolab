export const darkColors = {
  background: '#0a0a0a',
  surface: 'rgba(45, 64, 84, 0.1)',
  surfaceElev: 'rgba(45, 64, 84, 0.2)',
  surfaceCard: 'rgba(45, 64, 84, 0.15)',
  border: 'rgba(210, 157, 89, 0.2)',
  borderLight: 'rgba(210, 157, 89, 0.3)',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#b0b0b0',
  accent: '#d29d59',
  accent2: '#2d4054',
  accentGold: '#d29d59',
  accentNavy: '#2d4054',
  accentBlue: '#4a9eff',
  accentGreen: '#00d4aa',
  accentPurple: '#8b5cf6',
  accentOrange: '#f59e0b',
  accentPink: '#ec4899',
  danger: '#ef4444',
  warn: '#f59e0b',
  success: '#10b981',
  muted: '#6b7280',
  glass: 'rgba(255, 255, 255, 0.1)',
  glassStrong: 'rgba(255, 255, 255, 0.15)',
  chartColors: {
    gold: '#d29d59',
    navy: '#2d4054',
    blue: '#4a9eff',
    green: '#00d4aa', 
    purple: '#8b5cf6',
    orange: '#f59e0b',
    pink: '#ec4899',
    cyan: '#06b6d4',
    yellow: '#eab308'
  }
};

export const lightColors = {
  background: '#ffffff',
  surface: 'rgba(210, 157, 89, 0.05)',
  surfaceElev: 'rgba(210, 157, 89, 0.1)',
  surfaceCard: 'rgba(255, 255, 255, 0.9)',
  border: 'rgba(45, 64, 84, 0.15)',
  borderLight: 'rgba(45, 64, 84, 0.1)',
  textPrimary: '#2d4054',
  textSecondary: '#495057',
  textMuted: '#6c757d',
  accent: '#d29d59',
  accent2: '#2d4054',
  accentGold: '#d29d59',
  accentNavy: '#2d4054',
  accentBlue: '#4a9eff',
  accentGreen: '#00d4aa',
  accentPurple: '#8b5cf6',
  accentOrange: '#f59e0b',
  accentPink: '#ec4899',
  danger: '#ef4444',
  warn: '#f59e0b',
  success: '#10b981',
  muted: '#6b7280',
  glass: 'rgba(255, 255, 255, 0.25)',
  glassStrong: 'rgba(255, 255, 255, 0.4)',
  chartColors: {
    gold: '#d29d59',
    navy: '#2d4054',
    blue: '#4a9eff',
    green: '#00d4aa', 
    purple: '#8b5cf6',
    orange: '#f59e0b',
    pink: '#ec4899',
    cyan: '#06b6d4',
    yellow: '#eab308'
  }
};

export const colors = darkColors; // Default to dark theme

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  glass: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  button: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const layout = {
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1200,
  },
  container: {
    mobile: '100%',
    tablet: 750,
    desktop: 970,
    wide: 1170,
  },
  header: {
    height: 60,
    mobileHeight: 56,
  },
  tabBar: {
    height: 60,
    mobileHeight: 56,
  },
  sidebar: {
    width: 280,
    collapsedWidth: 80,
  },
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4,
    },
    gap: {
      mobile: spacing.md,
      tablet: spacing.lg,
      desktop: spacing.xl,
    },
  },
};

export const glassMorphism = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dark: {
    backgroundColor: 'rgba(45, 64, 84, 0.25)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(210, 157, 89, 0.3)',
  },
  strong: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(15px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      backgroundColor: 'rgba(45, 64, 84, 0.4)',
      backdropFilter: 'blur(15px)',
      borderWidth: 1,
      borderColor: 'rgba(210, 157, 89, 0.5)',
    },
  },
};

export const animations = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Responsive utilities
export const responsive = {
  // Check if current screen width matches breakpoint
  isDesktop: (width: number) => width >= layout.breakpoints.desktop,
  isTablet: (width: number) => width >= layout.breakpoints.tablet && width < layout.breakpoints.desktop,
  isMobile: (width: number) => width < layout.breakpoints.tablet,
  
  // Get grid columns based on screen width
  getGridColumns: (width: number) => {
    if (width >= layout.breakpoints.wide) return layout.grid.columns.wide;
    if (width >= layout.breakpoints.desktop) return layout.grid.columns.desktop;
    if (width >= layout.breakpoints.tablet) return layout.grid.columns.tablet;
    return layout.grid.columns.mobile;
  },
  
  // Get grid gap based on screen width
  getGridGap: (width: number) => {
    if (width >= layout.breakpoints.desktop) return layout.grid.gap.desktop;
    if (width >= layout.breakpoints.tablet) return layout.grid.gap.tablet;
    return layout.grid.gap.mobile;
  },
};
