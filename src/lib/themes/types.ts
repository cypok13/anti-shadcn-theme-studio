export interface ThemeTokens {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  radius: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

export interface ThemePreset {
  id: string
  name: string
  tagline: string
  vibe: string[]
  light: ThemeTokens
  dark: ThemeTokens
  fonts: {
    heading: string
    body: string
    mono: string
  }
  radius: string
  shadowStyle: 'none' | 'flat' | 'soft' | 'dramatic' | 'glow'
  aiPersonality: {
    tone: string
    doList: string[]
    dontList: string[]
    componentStyle: string
    colorPhilosophy: string
  }
}
