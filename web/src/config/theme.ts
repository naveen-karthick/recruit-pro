import type { ThemePreset } from '@/themes/registry'

/**
 * Central theme configuration — change `preset` here to switch themes.
 * Add new presets in `src/themes/registry.ts` and their CSS in `src/themes/`.
 */
export const themeConfig = {
  /** Theme preset id (must match a key in themes/registry.ts) */
  preset: 'vercel' satisfies ThemePreset,
  /** Default color mode (light only for now; system/dark switching disabled) */
  defaultMode: 'light' as 'light' | 'dark' | 'system',
  /** localStorage key for color mode preference */
  storageKey: 'recruitpro-theme',
} as const
