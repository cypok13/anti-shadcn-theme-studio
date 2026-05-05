export const COLOR_TOKEN_KEYS = [
  'background', 'foreground',
  'primary', 'primaryForeground',
  'secondary', 'secondaryForeground',
  'accent', 'accentForeground',
  'muted', 'mutedForeground',
  'destructive', 'destructiveForeground',
  'border', 'input', 'ring',
] as const

export type ColorTokenKey = typeof COLOR_TOKEN_KEYS[number]

export const COLOR_CSS_VAR: Record<ColorTokenKey, string> = {
  background: '--background',
  foreground: '--foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
}
