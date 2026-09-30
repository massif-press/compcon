import type { Action } from '@/classes/Action'
import type { ActivationType } from '@/classes/enums'
import type { CombatController } from '@/classes/components/combat/CombatController'

export type PaletteSection =
  | 'top'
  | 'attack'
  | 'quick'
  | 'quickGranted'
  | 'full'
  | 'fullGranted'
  | 'reaction'

export type PaletteEntry = { action: Action; section: PaletteSection }

export type PaletteActionIds = {
  quickAttack?: string[]
  fullAttack?: string[]
  quick: string[]
  full: string[]
  reactions?: string[]
  lastReactions?: string[]
}

const TYPE_ORDER = ['Protocol', 'Free', 'Quick', 'Quick Tech', 'Full', 'Full Tech', 'Reaction']

export const EXHAUSTIBLE = TYPE_ORDER.filter(t => t !== 'Free')

export const MARKABLE = ['Quick', 'Full']

export function isActionAvailable(controller: CombatController, a: Action): boolean {
  return (
    !!a.Deployable || !!controller.UsedCount(a.ID) || controller.CanActivate(a.Activation, a.ID)
  )
}

export function paletteEntries(
  controller: CombatController,
  ids: PaletteActionIds,
  simple: boolean,
  actionById: Map<string, Action>
): PaletteEntry[] {
  const base = (section: PaletteSection, list: string[] = []): PaletteEntry[] =>
    list
      .map(id => actionById.get(id))
      .filter(Boolean)
      .map(action => ({ action: action as Action, section }))
  const granted = (section: PaletteSection, ...types: `${ActivationType}`[]): PaletteEntry[] =>
    types.flatMap(t => controller.AllActions(t)).map(action => ({ action, section }))

  if (simple)
    return [
      ...granted('top', 'Protocol'),
      ...base('attack', ids.quickAttack),
      ...base('quick', ids.quick),
      ...granted('quickGranted', 'Quick', 'Quick Tech'),
      ...base('attack', ids.fullAttack),
      ...base('full', ids.full),
      ...granted('fullGranted', 'Full', 'Full Tech'),
      ...granted('top', 'Free'),
      ...base('reaction', ids.reactions),
      ...granted('reaction', 'Reaction'),
      ...base('reaction', ids.lastReactions),
    ]

  return [
    ...granted('top', 'Protocol', 'Free'),
    ...base('attack', [...(ids.quickAttack || []), ...(ids.fullAttack || [])]),
    ...base('quick', ids.quick),
    ...granted('quickGranted', 'Quick', 'Quick Tech'),
    ...base('full', ids.full),
    ...granted('fullGranted', 'Full', 'Full Tech'),
    ...base('reaction', ids.reactions),
    ...granted('reaction', 'Reaction'),
    ...base('reaction', ids.lastReactions),
  ]
}

export function groupByActivation(
  entries: PaletteEntry[],
  always: string[] = []
): [string, PaletteEntry[]][] {
  const groups = new Map<string, PaletteEntry[]>(TYPE_ORDER.map(t => [t, []]))
  for (const e of entries) {
    if (!groups.has(e.action.Activation)) groups.set(e.action.Activation, [])
    groups.get(e.action.Activation)!.push(e)
  }
  return [...groups].filter(([type, list]) => list.length || always.includes(type))
}

export function standardRows(entries: PaletteEntry[]): PaletteEntry[][][][] {
  const of = (...sections: PaletteSection[]) =>
    sections.map(s => entries.filter(e => e.section === s)).filter(seg => seg.length)
  return [
    [of('top')],
    [of('attack')],
    [of('quick', 'quickGranted'), of('full', 'fullGranted')],
    [of('reaction')],
  ]
    .map(row => row.filter(col => col.length))
    .filter(row => row.length)
}
