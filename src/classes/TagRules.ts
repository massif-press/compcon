const TAG = {
  AI: 'tg_ai',
  Accurate: 'tg_accurate',
  AP: 'tg_ap',
  DangerZone: 'tg_danger_zone',
  Exotic: 'tg_exotic',
  Grenade: 'tg_grenade',
  HeatSelf: 'tg_heat_self',
  Hidden: 'tg_hidden',
  Inaccurate: 'tg_inaccurate',
  Indestructible: 'tg_indestructible',
  Irreducible: 'tg_irreducible',
  Limited: 'tg_limited',
  Loading: 'tg_loading',
  Mine: 'tg_mine',
  NoCascade: 'tg_no_cascade',
  Ordnance: 'tg_ordnance',
  Overkill: 'tg_overkill',
  Recharging: 'tg_recharge',
  Reliable: 'tg_reliable',
  SetDamageType: 'tg_set_damage_type',
  SetMaxUses: 'tg_set_max_uses',
  Shield: 'tg_shield',
  Sidearm: 'tg_sidearm',
  Smart: 'tg_smart',
  Thrown: 'tg_thrown',
  Unique: 'tg_unique',
} as const

type TagId = (typeof TAG)[keyof typeof TAG]

type TagLike = { id?: string; ID?: string; Value?: any; val?: any } | null | undefined

function tagId(tag: TagLike): string {
  return String(tag?.ID ?? tag?.id ?? '').toLowerCase()
}

function findTag(tags: TagLike[] | undefined, id: TagId): TagLike {
  return (tags || []).find(t => tagId(t) === id)
}

function hasTag(tags: TagLike[] | undefined, id: TagId): boolean {
  return !!findTag(tags, id)
}

function tagValue(tags: TagLike[] | undefined, id: TagId): any {
  const tag = findTag(tags, id)
  return tag?.Value ?? tag?.val
}

export { TAG, tagId, findTag, hasTag, tagValue }
export type { TagId, TagLike }
