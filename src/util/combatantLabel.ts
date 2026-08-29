import type { CombatantData } from '@/classes/encounter/Encounter'

export function combatantLabel(combatant?: CombatantData | null): string {
  if (!combatant) return ''
  const name = combatant.actor?.CombatController?.CombatName || ''
  const numbered = combatant.type === 'unit' || combatant.type === 'doodad'
  return numbered && combatant.number > 0 ? `${name} #${combatant.number}` : name
}
