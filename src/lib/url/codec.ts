export function encodeTheme(presetId: string): string {
  return presetId
}

export function decodeTheme(encoded: string): string | null {
  if (!encoded || encoded.trim() === '') return null
  return encoded
}
