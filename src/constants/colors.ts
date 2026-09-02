export const COLORS = {
  dark: {
    ink: '#060610',
    surface: '#0A0A18',
    panel: '#0E0E1C',
    panel2: '#141428',
    panel3: '#1A1A34',
    gold: '#C9A84C',
    goldDim: '#8B6914',
    goldBright: '#F0D080',
    goldFaint: 'rgba(201,168,76,0.08)',
    text: '#CCC8B4',
    textDim: '#807C6A',
    muted: '#484560',
    border: 'rgba(201,168,76,0.13)',
    border2: 'rgba(201,168,76,0.28)',
    red: '#C05555',
    green: '#4A9870',
    blue: '#4878C0',
    purple: '#7850B0',
  },
  light: {
    ink: '#F5F5F7',
    surface: '#FFFFFF',
    panel: '#F8F8FA',
    panel2: '#F0F0F4',
    panel3: '#E8E8EE',
    gold: '#C9A84C',
    goldDim: '#A68B3E',
    goldBright: '#DDBF5C',
    goldFaint: 'rgba(201,168,76,0.08)',
    text: '#1A1A2E',
    textDim: '#4A4A5E',
    muted: '#8A8A9E',
    border: 'rgba(0,0,0,0.08)',
    border2: 'rgba(0,0,0,0.15)',
    red: '#C05555',
    green: '#4A9870',
    blue: '#4878C0',
    purple: '#7850B0',
  }
};

export type Theme = 'dark' | 'light';
export const DEFAULT_THEME: Theme = 'dark';

export const getColors = (theme: Theme = DEFAULT_THEME) => COLORS[theme];

/**
 * Kozmik gradient tanımları — arka planlar, kartlar ve premium vurgular için.
 * expo-linear-gradient ile <GradientBackground/> ve <GlowCard/> bileşenlerinde kullanılır.
 */
export const GRADIENTS = {
  cosmos: ['#060610', '#120A28', '#1D0F3A', '#0A0A18'] as const,
  goldGlow: ['rgba(201,168,76,0.28)', 'rgba(201,168,76,0.04)', 'transparent'] as const,
  purpleGlow: ['rgba(120,80,176,0.32)', 'rgba(120,80,176,0.05)', 'transparent'] as const,
  cardShine: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)'] as const,
  auroraGold: ['#F0D080', '#C9A84C', '#8B6914'] as const,
};

export const GLOW = {
  gold: { shadowColor: '#C9A84C', shadowOpacity: 0.55, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 12 },
  purple: { shadowColor: '#7850B0', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 12 },
};
