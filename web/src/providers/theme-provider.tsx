import { createContext, useContext, useEffect, useMemo } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { themeConfig } from '@/config/theme'
import { themeRegistry, type ThemePreset } from '@/themes/registry'

interface ThemePresetContextValue {
  preset: ThemePreset
}

const ThemePresetContext = createContext<ThemePresetContextValue>({
  preset: themeConfig.preset,
})

export function useThemePreset() {
  return useContext(ThemePresetContext)
}

function ThemePresetApplier({ preset }: { preset: ThemePreset }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preset)
  }, [preset])

  return null
}

interface ThemeProviderProps {
  children: React.ReactNode
  /** Override preset from config (optional) */
  preset?: ThemePreset
}

export function ThemeProvider({
  children,
  preset = themeConfig.preset,
}: ThemeProviderProps) {
  const value = useMemo(() => ({ preset }), [preset])

  if (!themeRegistry[preset]) {
    console.warn(`Unknown theme preset "${preset}". Falling back to vercel.`)
  }

  return (
    <ThemePresetContext.Provider value={value}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={themeConfig.defaultMode}
        enableSystem
        storageKey={themeConfig.storageKey}
        disableTransitionOnChange
      >
        <ThemePresetApplier preset={preset} />
        {children}
      </NextThemesProvider>
    </ThemePresetContext.Provider>
  )
}

export { useTheme }
