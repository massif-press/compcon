import type { IActorRef, IRef, ActorRefType } from './events'

const KIND_TO_TYPE: Record<string, ActorRefType> = {
  mech: 'mech',
  pilot: 'pilot',
  npc: 'npc',
}

function actorRef(cc: any, side?: string): IActorRef {
  if (!cc) return { id: '', name: 'Unknown', type: 'unknown' }
  const parent = cc.Parent ?? {}
  const templates = parent.NpcTemplateController?.Templates ?? []
  const npcClass = parent.NpcClassController?.Class ?? null

  const ref: IActorRef = {
    id: parent.ID ?? '',
    name: cc.CombatName ?? parent.Name ?? 'Unknown',
    type: KIND_TO_TYPE[cc.Kind] ?? typeFromItemType(parent.ItemType),
  }

  if (parent.OriginId) ref.originId = parent.OriginId
  if (side) ref.side = side
  if (typeof parent.Tier === 'number') ref.tier = parent.Tier
  else if (parent.NpcClassController) ref.tier = cc.Tier

  if (npcClass) {
    ref.npcClassId = npcClass.ID
    ref.npcClassName = npcClass.Name
  }
  if (templates.length) {
    ref.templateIds = templates.map((t: any) => t.ID)
    ref.templateNames = templates.map((t: any) => t.Name)
  }

  return ref
}

function typeFromItemType(itemType?: string): ActorRefType {
  const key = String(itemType ?? '').toLowerCase()
  if (key === 'pilot') return 'pilot'
  if (key === 'mech') return 'mech'
  if (key === 'eidolon') return 'eidolon'
  if (key === 'deployable') return 'deployable'
  if (key === 'doodad') return 'doodad'
  if (key === 'npc' || key === 'unit') return 'npc'
  return 'unknown'
}

function combatantRef(combatant: any): IActorRef {
  if (!combatant) return { id: '', name: 'Unknown', type: 'unknown' }
  const cc = combatant.actor?.CombatController
  const ref = actorRef(cc, combatant.side)
  if (combatant.id) ref.id = combatant.id
  if (combatant.type !== 'pilot' && combatant.type !== 'placeholder' && combatant.number > 0)
    ref.name = `${ref.name} #${combatant.number}`
  return ref
}

function itemRef(item: any): IRef {
  if (!item) return { id: '', name: 'Unknown' }
  return { id: item.InstanceID ?? item.ID ?? '', name: item.Name ?? 'Unknown' }
}

function actionRef(id: string, name?: string): IRef {
  if (name) return { id, name }
  return {
    id,
    name: id
      .replace(/^act_/, '')
      .split(/[_\s]+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  }
}

function statusRef(status: any): IRef {
  if (!status) return { id: '', name: 'Unknown' }
  if (typeof status === 'string') return { id: status, name: status }
  return { id: status.ID ?? status.Attribute ?? '', name: status.Name ?? status.Attribute ?? '' }
}

export { actorRef, combatantRef, itemRef, actionRef, statusRef }
