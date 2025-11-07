
"use client"

import * as React from "react"
import { useAtom, atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const THEME_STORAGE_KEY = "theme"
const FONT_SIZE_STORAGE_KEY = "font-size"

type Theme = "light" | "dark" | "high-contrast"
type SetTheme = (theme: Theme) => void
type FontSize = number
type SetFontSize = (fontSize: FontSize) => void

type ThemeContext = {
  theme: Theme
  setTheme: SetTheme
  fontSize: FontSize
  setFontSize: SetFontSize
}

const ThemeContext = React.createContext<ThemeContext | null>(null)

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

const themeAtom = atomWithStorage<Theme>(THEME_STORAGE_KEY, "light")
const fontSizeAtom = atomWithStorage<FontSize>(FONT_SIZE_STORAGE_KEY, 1)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useAtom(themeAtom)
  const [fontSize, setFontSize] = useAtom(fontSizeAtom)

  React.useEffect(() => {
    document.body.classList.remove("light", "dark", "high-contrast")
    document.body.classList.add(theme)
  }, [theme])

  React.useEffect(() => {
    document.body.style.fontSize = `${fontSize}rem`
  }, [fontSize])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  )
}
