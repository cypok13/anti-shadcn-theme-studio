import type { ThemePreset } from './types'
import { zincViolet } from './presets/zinc-violet'
import { concreteBrutalist } from './presets/concrete-brutalist'
import { quietTokyo } from './presets/quiet-tokyo'
import { lateNightTerminal } from './presets/late-night-terminal'
import { broadsheet } from './presets/broadsheet'
import { vcPitchDeck } from './presets/vc-pitch-deck'
import { gardenParty } from './presets/garden-party'
import { researchLab } from './presets/research-lab'
import { cassetteFuturism } from './presets/cassette-futurism'

export const PRESETS: ThemePreset[] = [
  zincViolet,
  concreteBrutalist,
  quietTokyo,
  lateNightTerminal,
  broadsheet,
  vcPitchDeck,
  gardenParty,
  researchLab,
  cassetteFuturism,
]

export function getPreset(id: string): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id)
}
