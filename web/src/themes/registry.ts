export interface ThemeDefinition {
  id: string
  label: string
  description: string
}

/**
 * Registered theme presets. To add a theme:
 * 1. Create `src/themes/{id}.css` with CSS variables
 * 2. Import it in `src/index.css`
 * 3. Add an entry here
 * 4. Set `themeConfig.preset` in `src/config/theme.ts`
 */
export const themeRegistry = {
  vercel: {
    id: 'vercel',
    label: 'Vercel',
    description: 'Minimal black & white Geist-inspired palette',
  },
} as const satisfies Record<string, ThemeDefinition>

export type ThemePreset = keyof typeof themeRegistry

export const themePresets = Object.values(themeRegistry)
