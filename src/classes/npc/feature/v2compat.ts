import type { IBonusData } from '@/classes/components/feature/bonus/Bonus'

const V2_STAT_TO_BONUS_ID: Record<string, string> = {
  hp: 'hp',
  armor: 'armor',
  size: 'size',
  structure: 'structure',
  stress: 'stress',
  speed: 'speed',
  evasion: 'evasion',
  edef: 'edef',
  edefense: 'edef',
  heatcap: 'heatcap',
  heatcapacity: 'heatcap',
  repcap: 'repcap',
  repaircapacity: 'repcap',
  save: 'save',
  savetarget: 'save',
  sensor: 'sensor',
  sensors: 'sensor',
  sensorrange: 'sensor',
  techattack: 'tech_attack',
  tech_attack: 'tech_attack',
  activations: 'activations',
  grapple: 'grapple',
  ram: 'ram',
  hull: 'hull',
  agi: 'agility',
  agility: 'agility',
  sys: 'systems',
  systems: 'systems',
  eng: 'engineering',
  engineering: 'engineering',
  attack: 'attack',
  attackbonus: 'attack',
}

function normKey(key: string): string {
  return key.toLowerCase().replace(/[\s_-]/g, '')
}

function resolveBonusId(v2Key: string): string {
  return V2_STAT_TO_BONUS_ID[normKey(v2Key)] ?? normKey(v2Key)
}

function flatObjectToBonuses(
  obj: Record<string, unknown>,
  flags: { overwrite?: boolean; replace?: boolean }
): IBonusData[] {
  return Object.entries(obj).map(([key, val]) => ({
    id: resolveBonusId(key),
    val: val as IBonusData['val'],
    ...flags,
  }))
}

// transforms v2 bonus/override/replace flat objects into a v3 bonuses array
// safe to call on v3 data
export function transformV2NpcFeatureData(data: Record<string, any>): void {
  const extra: IBonusData[] = []

  if (data.bonus && typeof data.bonus === 'object' && !Array.isArray(data.bonus)) {
    extra.push(...flatObjectToBonuses(data.bonus, {}))
    delete data.bonus
  }

  if (data.override && typeof data.override === 'object' && !Array.isArray(data.override)) {
    extra.push(...flatObjectToBonuses(data.override, { overwrite: true }))
    delete data.override
  }

  if (data.replace && typeof data.replace === 'object' && !Array.isArray(data.replace)) {
    extra.push(...flatObjectToBonuses(data.replace, { replace: true }))
    delete data.replace
  }

  if (extra.length) {
    data.bonuses = [...(data.bonuses ?? []), ...extra]
  }
}
