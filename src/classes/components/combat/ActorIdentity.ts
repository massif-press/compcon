import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'
import { Action } from '@/classes/Action'
import { ActivationType } from '../../enums'
import { CompendiumStore } from '@/features/compendium/store'
import { hasUsesRemaining } from './AttackRules'
import { ACTION_ID_ALIASES } from './actions/BaseActions'
import type { CombatController } from './CombatController'

export function rootActor(cc: CombatController): any {
  return cc.IsMech ? (cc.Parent as Mech).Parent : cc.Parent
}

export function activeActor(cc: CombatController): any {
  if ((cc.Parent as Pilot).ActiveMech && cc.Mounted) return (cc.Parent as Pilot).ActiveMech
  return cc.Parent
}

export function counterpart(cc: CombatController): CombatController | null {
  if (cc.IsPilot) return (cc.Parent as Pilot).ActiveMech?.CombatController ?? null
  if (cc.IsMech) return (cc.Parent as Mech).Pilot?.CombatController ?? null
  return null
}

export function combatName(cc: CombatController): string {
  return cc.Parent.Callsign || cc.Parent.Name
}

export function tier(cc: CombatController): number {
  if (cc.Parent.NpcClassController) return cc.Parent.NpcClassController.Tier
  return 1
}

export function limitedBonus(cc: CombatController): number {
  const val = (cc.Parent as any).LimitedBonus
  return val === undefined ? 0 : val
}

function templates(cc: CombatController): any[] {
  return (cc.Parent as any)?.NpcTemplateController?.Templates ?? []
}

export function hasTemplate(cc: CombatController, name: string): boolean {
  return templates(cc).some((t: any) => t?.Name?.toLowerCase() === name.toLowerCase())
}

export function isGrunt(cc: CombatController): boolean {
  return templates(cc).some((t: any) =>
    String(t?.ID ?? t?.Name ?? '')
      .toLowerCase()
      .includes('grunt')
  )
}

export function isBiological(cc: CombatController): boolean {
  return !!(cc.Parent as any)?.IsBiological
}

export function allEquipment(cc: CombatController): any[] {
  const p = cc.Parent as any
  const byKind: Record<string, () => any[]> = {
    mech: () => p.MechLoadoutController.ActiveLoadout.Equipment,
    pilot: () => p.PilotLoadoutController.ActiveLoadout.Items,
    npc: () => p.NpcFeatureController?.Features ?? [],
  }
  return (byKind[cc.Kind]() ?? []).filter(Boolean)
}

export function allActions(cc: CombatController, activation: `${ActivationType}`): Action[] {
  return cc.Parent.FeatureController.Actions.filter(a => a.Activation === activation)
}

function sourceIsAvailable(cc: CombatController, action: Action): boolean {
  if (!action.IsItemAction || !action.Origin) return true
  const source = allEquipment(cc).find((e: any) => e?.Name === action.Origin)
  if (!source) return true
  if (source.Destroyed) return false
  return hasUsesRemaining(source)
}

export function subActions(cc: CombatController, activation: `${ActivationType}`): Action[] {
  return [
    ...CompendiumStore().Actions.filter(a => a.Activation === activation),
    ...cc.AllActions(activation).filter(a => sourceIsAvailable(cc, a)),
  ].sort((a, b) => a.Name.localeCompare(b.Name))
}

export function findAction(cc: CombatController, actionId: string): Action | undefined {
  const lookup = (id: string) =>
    cc.Parent.FeatureController?.Actions.find(a => a.ID === id) ??
    CompendiumStore().Actions.find((a: Action) => a.ID === id)
  const alias = ACTION_ID_ALIASES[actionId]
  return lookup(actionId) ?? (alias ? lookup(alias) : undefined)
}
