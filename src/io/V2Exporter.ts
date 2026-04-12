function stripBrew(brew: any): any {
  const { Status: _, ...rest } = brew
  return rest
}

function transformSkill(s: any): any {
  return { id: s.id, rank: s.rank }
}

function transformTalent(t: any): any {
  return { id: t.id, rank: t.rank }
}

function buildDefaultCombatHistory(): any {
  return {
    moves: 0,
    kills: 0,
    damage: 0,
    hp_damage: 0,
    structure_damage: 0,
    overshield: 0,
    heat_damage: 0,
    reactor_damage: 0,
    overcharge_uses: 0,
    core_uses: 0,
  }
}

function buildDefaultState(activeMechId: string): any {
  return {
    active_mech_id: activeMechId,
    remote_mech_id: '',
    stage: 'Narrative',
    turn: 1,
    mission: 0,
    actions: 2,
    braced: false,
    overcharged: false,
    prepare: false,
    bracedCooldown: false,
    redundant: false,
    stats: buildDefaultCombatHistory(),
    deployed: [],
  }
}

function transformPilotItem(item: any): any {
  const { data: _, type: __, isUsed: ___, maxUses: ____, currentUses, ...rest } = item
  return {
    ...rest,
    uses: currentUses ?? 0,
    cascading: false,
    customDamageType: rest.customDamageType ?? null,
  }
}

function transformPilotLoadout(loadout: any): any {
  if (!loadout) {
    return {
      id: '',
      name: 'Primary',
      armor: [],
      weapons: [],
      gear: [],
      extendedWeapons: [null],
      extendedGear: [null, null],
    }
  }
  return {
    id: loadout.id,
    name: loadout.name,
    armor: (loadout.armor ?? []).map(transformPilotItem),
    weapons: (loadout.weapons ?? []).map(transformPilotItem),
    gear: (loadout.gear ?? []).map(transformPilotItem),
    extendedWeapons: [null],
    extendedGear: [null, null],
  }
}

// ---------------------------------------------------------------------------
// Mech helpers
// ---------------------------------------------------------------------------

function transformMechWeapon(weapon: any): any {
  if (!weapon) return null
  const { data: _, isUsed: __, maxUses: ___, currentUses, ...rest } = weapon
  return {
    ...rest,
    uses: currentUses ?? 0,
    cascading: false,
    loaded: true,
    mod: rest.mod ?? null,
    customDamageType: rest.customDamageType ?? null,
  }
}

function transformMechSystem(sys: any): any {
  const { data: _, isUsed: __, maxUses: ___, note: ____, currentUses, ...rest } = sys
  return {
    ...rest,
    uses: currentUses ?? 0,
    cascading: false,
  }
}

function transformSlots(slots: any[]): any[] {
  return (slots ?? []).map((s: any) => ({
    size: s.size,
    weapon: transformMechWeapon(s.weapon),
  }))
}

function transformMount(mount: any): any {
  return {
    mount_type: mount.mount_type,
    lock: mount.lock ?? false,
    slots: transformSlots(mount.slots),
    extra: transformSlots(mount.extra),
    bonus_effects: mount.bonus_effects ?? [],
    modifiable: true,
  }
}

function transformIntegratedMount(entry: any): any {
  return {
    mount_type: 'Integrated',
    lock: false,
    slots: [{ size: 'Main', weapon: transformMechWeapon(entry.weapon) }],
    extra: [],
    bonus_effects: [],
    modifiable: false,
  }
}

function transformMechLoadout(loadout: any): any {
  return {
    id: loadout.id,
    name: loadout.name,
    systems: (loadout.systems ?? []).map(transformMechSystem),
    integratedSystems: loadout.integratedSystems ?? [],
    mounts: (loadout.mounts ?? []).map(transformMount),
    integratedMounts: (loadout.integratedMounts ?? []).map(transformIntegratedMount),
    improved_armament: loadout.improved_armament
      ? transformMount(loadout.improved_armament)
      : undefined,
    superheavy_mounting: loadout.superheavy_mounting
      ? transformMount(loadout.superheavy_mounting)
      : undefined,
    integratedWeapon: loadout.integratedWeapon
      ? transformMount(loadout.integratedWeapon)
      : undefined,
    extraMounts: [],
    extraIntegratedMounts: [],
  }
}

function transformMech(mech: any): any {
  const cur = mech.stats?.current ?? {}
  const max = mech.stats?.max ?? {}

  return {
    id: mech.id,
    name: mech.name,
    notes: mech.notes ?? '',
    gm_note: '',
    frame: mech.frame,
    active: false,
    current_structure: cur.structure ?? max.structure ?? 4,
    current_move: max.speed ?? 4,
    boost: 0,
    current_hp: cur.hp ?? max.hp ?? 0,
    overshield: cur.overshield ?? 0,
    current_stress: cur.stress ?? max.stress ?? 4,
    current_heat: cur.heat ?? 0,
    current_repairs: cur.repairCapacity ?? max.repairCapacity ?? 0,
    current_overcharge: cur.overcharge ?? 0,
    current_core_energy: mech.corePower ? 1 : 0,
    statuses: mech.statuses ?? [],
    conditions: [],
    resistances: mech.resistances ?? [],
    reactions: [],
    burn: cur.burn ?? 0,
    destroyed: mech.isDead ?? false,
    defeat: '',
    activations: max.activations ?? 1,
    meltdown_imminent: mech.isInSelfDestruct ?? false,
    reactor_destroyed: mech.reactorDestroyed ?? false,
    core_active: mech.coreActive ?? false,
    portrait: mech.img?.portrait ?? '',
    cloud_portrait: mech.img?.cloud_portrait ?? '',
    cc_ver: 'ERR',
    lastModified: new Date().toString(),
    isDeleted: false,
    expireTime: '',
    deleteTime: '',
    counter_data: mech.counters?.counter_data ?? [],
    custom_counters: mech.counters?.custom_counters ?? [],
    loadouts: (mech.loadouts ?? []).map(transformMechLoadout),
    active_loadout_index: mech.active_loadout_index ?? 0,
  }
}

export const convertTov2Pilot = function (input: any): any {
  // Unwrap export envelope if present
  const d = input?.EXPORT_TYPE ? input.data : input

  const activeLoadoutIndex = d.active_index ?? 0
  const activeLoadout = d.loadouts?.[activeLoadoutIndex]
  const lastModifiedStr = new Date(d.save?.lastModified ?? Date.now()).toString()
  const deleteTimeStr = d.save?.deleteTime > 0 ? new Date(d.save.deleteTime).toString() : ''
  const activeMechId = d.mechs?.[0]?.id ?? ''

  return {
    id: d.id,
    level: d.level ?? 0,
    callsign: d.callsign ?? '',
    name: d.name ?? '',
    player_name: d.player_name ?? '',
    status: d.status ?? 'Active',
    dead: d.le ?? false,
    text_appearance: d.text_appearance ?? '',
    notes: d.notes ?? '',
    history: d.history ?? '',
    quirks: d.quirks ?? [],
    current_hp: d.stats?.current?.hp ?? 0,
    background: d.background ?? '',
    resistances: [],
    portrait: d.img?.portrait ?? '',
    cloud_portrait: d.img?.cloud_portrait ?? '',
    group: '',
    sort_index: d.sortIndex ?? -1,
    cc_ver: '',
    isDeleted: false,
    expireTime: '',
    deleteTime: deleteTimeStr,
    lastModified: lastModifiedStr,
    lastUpdate_cloud: lastModifiedStr,
    lastSync: lastModifiedStr,
    skills: (d.skills ?? []).map(transformSkill),
    talents: (d.talents ?? []).map(transformTalent),
    mechSkills: d.mechSkills ?? [0, 0, 0, 0],
    core_bonuses: d.core_bonuses ?? [],
    licenses: d.licenses ?? [],
    reserves: d.reserves ?? [],
    orgs: d.orgs ?? [],
    counter_data: d.counters?.counter_data ?? [],
    custom_counters: d.counters?.custom_counters ?? [],
    special_equipment: d.special_equipment ?? {
      PilotGear: [],
      Frames: [],
      MechWeapons: [],
      WeaponMods: [],
      MechSystems: [],
      SystemMods: [],
    },
    bondId: '',
    xp: d.bond?.xp ?? 0,
    stress: d.bond?.stress ?? 0,
    isBroken: d.bond?.isBroken ?? false,
    burdens: d.bond?.burdens ?? [],
    bondPowers: d.bond?.bondPowers ?? [],
    powerSelections: d.bond?.powerSelections ?? 0,
    maxStress: d.bond?.maxStress ?? 8,
    bondAnswers: d.bond?.bondAnswers ?? ['', ''],
    minorIdeal: d.bond?.minorIdeal ?? '',
    clocks: d.bond?.clocks ?? [],
    combat_history: buildDefaultCombatHistory(),
    state: buildDefaultState(activeMechId),
    loadout: transformPilotLoadout(activeLoadout),
    mechs: (d.mechs ?? []).map(transformMech),
    brews: (d.brews ?? []).map(stripBrew),
  }
}

// ---------------------------------------------------------------------------
// NPC helpers
// ---------------------------------------------------------------------------

const V3_NPC_STAT_RENAME: Record<string, string> = {
  evasion: 'evade',
  sensorRange: 'sensor',
  saveTarget: 'save',
  agi: 'agility',
  sys: 'systems',
  eng: 'engineering',
}

const V3_NPC_STAT_DROP = new Set([
  'attackBonus',
  'techAttack',
  'limitedBonus',
  'saveBonus',
  'grapple',
  'ram',
  'overshield',
  'overcharge',
  'burn',
  'heat',
  'repairCapacity',
  'stat_version',
  'stats',
])

function remapNpcStatFields(v3Stats: any): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [k, v] of Object.entries(v3Stats)) {
    if (V3_NPC_STAT_DROP.has(k)) continue
    const v2Key = V3_NPC_STAT_RENAME[k] ?? k
    result[v2Key] = v
  }
  return result
}

function zeroNpcBonuses(base: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [k, v] of Object.entries(base)) {
    result[k] = Array.isArray(v) ? [] : 0
  }
  return result
}

function buildV2NpcStats(max: any): any {
  const base = remapNpcStatFields(max)
  const zeroed = zeroNpcBonuses(base)
  return { ...base, reactions: ['Overwatch'], bonuses: zeroed, overrides: zeroed }
}

function buildV2NpcCurrentStats(current: any, max: any): any {
  const base = remapNpcStatFields(current)
  // heatcap in currentStats tracks heat taken (not the cap); speed tracks expended movement
  base.heatcap = current.heat ?? 0
  base.speed = 0
  const zeroed = zeroNpcBonuses(remapNpcStatFields(max))
  return { ...base, reactions: ['Overwatch'], bonuses: zeroed, overrides: zeroed }
}

function transformNpcFeature(feature: any, tier: number): any {
  return {
    itemID: feature.id,
    tier,
    flavorName: '',
    description: '',
    destroyed: false,
    charged: !(feature.data?.isUsed ?? false),
    uses: 0,
    collapsed: false,
  }
}

// ---------------------------------------------------------------------------
// NPC export
// ---------------------------------------------------------------------------

export const convertTov2Npc = function (input: any): any {
  const cd = input.combat_data ?? {}
  const cur = cd.stats?.current ?? {}
  const max = cd.stats?.max ?? {}
  const lastModifiedStr = new Date(input.save?.lastModified ?? Date.now()).toString()
  const deleteTimeStr = input.save?.deleteTime > 0 ? new Date(input.save.deleteTime).toString() : ''

  return {
    active: false,
    id: input.id,
    class: input.class?.id ?? input.class,
    tier: input.tier,
    name: input.name,
    subtitle: '',
    campaign: '',
    labels: [],
    tag: input.tag ?? '',
    templates: input.templates ?? [],
    items: (input.features ?? []).map((f: any) => transformNpcFeature(f, input.tier)),
    stats: buildV2NpcStats(max),
    currentStats: buildV2NpcCurrentStats(cur, max),
    note: input.note ?? '',
    side: 'Enemy',
    cloudImage: '',
    localImage: '',
    portrait: input.img?.portrait ?? '',
    cloud_portrait: input.img?.cloud_portrait ?? '',
    statuses: cd.statuses ?? [],
    conditions: [],
    resistances: cd.resistances ?? [],
    burn: cur.burn ?? 0,
    overshield: cur.overshield ?? 0,
    destroyed: cd.isDead ?? false,
    defeat: '',
    actions: 2,
    cc_ver: 'UNKNOWN',
    lastModified: lastModifiedStr,
    isDeleted: false,
    expireTime: '',
    deleteTime: deleteTimeStr,
    lastUpdate_cloud: '',
    lastSync: '',
    brews: (input.brews ?? []).map(stripBrew),
    counter_data: cd.counters?.counter_data ?? [],
    custom_counters: cd.counters?.custom_counters ?? [],
  }
}
