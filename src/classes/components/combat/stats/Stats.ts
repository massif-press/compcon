export const StatKey = {
  ACTIVATIONS: 'activations',
  SIZE: 'size',
  SIZES: 'sizes',
  STRUCTURE: 'structure',
  HP: 'hp',
  ARMOR: 'armor',
  STRESS: 'stress',
  HEAT: 'heat',
  HEATCAP: 'heatcap',
  REPAIR_CAPACITY: 'repairCapacity',
  ATTACK_BONUS: 'attackBonus',
  TECH_ATTACK: 'techAttack',
  LIMITED_BONUS: 'limitedBonus',
  SPEED: 'speed',
  EVASION: 'evasion',
  EDEF: 'edef',
  SENSOR_RANGE: 'sensorRange',
  SAVE_BONUS: 'saveBonus',
  SAVE_TARGET: 'saveTarget',
  GRAPPLE: 'grapple',
  RAM: 'ram',
  HULL: 'hull',
  AGI: 'agi',
  SYS: 'sys',
  ENG: 'eng',
  OVERCHARGE: 'overcharge',
  BURN: 'burn',
  OVERSHIELD: 'overshield',
} as const

export type StatKeyType = (typeof StatKey)[keyof typeof StatKey]

class Stats {
  public static get DefaultStats(): any {
    return {
      activations: 1,
      size: 1,
      sizes: [0.5, 1, 2, 3],
      structure: 0,
      hp: 0,
      armor: 0,
      stress: 0,
      heat: 0,
      heatcap: 0,
      repairCapacity: 0,
      attackBonus: 0,
      techAttack: 0,
      limitedBonus: 0,
      speed: 0,
      evasion: 0,
      edef: 0,
      sensorRange: 0,
      saveBonus: 0,
      saveTarget: 0,
      grapple: 0,
      ram: 0,
      hull: 0,
      agi: 0,
      sys: 0,
      eng: 0,
      overcharge: 0,
      burn: 0,
      overshield: 0,
    }
  }

  public static IconMap = {
    activations: 'cc:activate',
    size: 'cc:size_1',
    structure: 'cc:structure',
    hp: 'mdi-heart',
    armor: 'mdi-shield',
    stress: 'cc:reactor',
    burn: 'mdi-fire',
    heat: 'cc:heat',
    heatcap: 'cc:heat',
    repairCapacity: 'cc:repair',
    attackBonus: 'cc:weapon',
    techAttack: 'cc:quick_tech',
    limitedBonus: 'cc:ammo',
    speed: 'mdi-arrow-right-bold-hexagon-outline',
    evasion: 'cc:evasion',
    edef: 'cc:edef',
    sensorRange: 'cc:sensor',
    saveBonus: 'cc:save',
    saveTarget: 'cc:save',
    grapple: 'mdi-carabiner',
    ram: 'mdi-car-brake-low-pressure',
    hull: 'mdi-alpha-h-box-outline',
    agi: 'mdi-alpha-a-box-outline',
    sys: 'mdi-alpha-s-box-outline',
    eng: 'mdi-alpha-e-box-outline',
    overshield: 'mdi-hexagon-multiple-outline',
    overcharge: 'cc:overcharge',
    grit: 'mdi-star-four-points-outline',
  }

  public static TieredDefaults: Record<string, string> = {
    activations: '0/0/0',
    size: '1/1/1',
    sizes: '0/0/0',
    structure: '0/0/0',
    hp: '0/0/0',
    armor: '0/0/0',
    stress: '0/0/0',
    heat: '0/0/0',
    heatcap: '0/0/0',
    repairCapacity: '0/0/0',
    attackBonus: '1/2/3',
    techAttack: '0/0/0',
    limitedBonus: '0/0/0',
    speed: '0/0/0',
    evasion: '0/0/0',
    edef: '0/0/0',
    sensorRange: '0/0/0',
    saveBonus: '0/0/0',
    saveTarget: '0/0/0',
    grapple: '1/2/3',
    ram: '1/2/3',
    hull: '0/0/0',
    agi: '0/0/0',
    sys: '0/0/0',
    eng: '0/0/0',
    overcharge: '0/0/0',
    burn: '0/0/0',
    overshield: '0/0/0',
  }

  public static SortMap = {
    activations: 1,
    size: 2,
    structure: 4,
    hp: 5,
    overshield: 6,
    armor: 6,
    stress: 7,
    heat: 8,
    heatcap: 8,
    repairCapacity: 10,
    attackBonus: 11,
    techAttack: 12,
    limitedBonus: 13,
    speed: 14,
    evasion: 15,
    edef: 16,
    sensorRange: 17,
    saveBonus: 18,
    saveTarget: 19,
    grapple: 20,
    ram: 21,
    hull: 22,
    agi: 23,
    sys: 24,
    eng: 25,
    burn: 26,
  }

  public static cleanKey(key: string): string {
    let k = key.replace(/[\s_-]/g, '')

    switch (k.toLowerCase()) {
      case 'repcap':
      case 'repaircapacity':
        k = 'repairCapacity'
        break
      case 'savebonus':
        k = 'saveBonus'
        break
      case 'save':
      case 'savetarget':
        k = 'saveTarget'
        break
      case 'sensor':
      case 'sensors':
      case 'sensorrange':
        k = 'sensorRange'
        break
      case 'edefense':
        k = 'edef'
        break
      case 'agility':
        k = 'agi'
        break
      case 'systems':
        k = 'sys'
        break
      case 'engineering':
        k = 'eng'
        break
      case 'techattack':
        k = 'techAttack'
        break
      case 'limitedbonus':
        k = 'limitedBonus'
        break
      case 'attackbonus':
        k = 'attackBonus'
        break
      case 'heatcapacity':
        k = 'heatcap'
        break
    }

    return k.charAt(0).toLowerCase() + k.slice(1)
  }

  public static expandKey(key: string): string {
    let k = key
    switch (key.toLowerCase()) {
      case 'hp':
        return 'HP'
      case 'heat':
      case 'heatcap':
      case 'heatcapacity':
        return 'Heat Capacity'
      case 'techattack':
        return 'Tech Attack'
      case 'edef':
        return 'E-Defense'
      case 'grapple':
      case 'ram':
        k += ' bonus'
        break
      case 'agi':
        return 'Agility'
      case 'sys':
        return 'Systems'
      case 'eng':
        return 'Engineering'
    }

    k = k.charAt(0).toUpperCase() + k.slice(1)
    k = k.replace(/([A-Z])/g, ' $1').trim()

    return k
  }
}

export { Stats }
