class Stats {
  public static get DefaultStats(): any {
    return {
      activations: 1,
      size: 1,
      sizes: [0.5, 1, 2, 3],
      structure: 1,
      hp: 6,
      armor: 0,
      stress: 1,
      heat: 6,
      repairCapacity: 4,
      attackBonus: 0,
      techAttack: 0,
      limitedBonus: 0,
      speed: 4,
      evasion: 6,
      edef: 6,
      sensorRange: 1,
      saveBonus: 1,
      saveTarget: 1,
      grapple: 0,
      ram: 0,
      hull: 0,
      agi: 0,
      sys: 0,
      eng: 0,
    };
  }

  public static IconMap = {
    activations: 'cc:activate',
    size: 'cc:size_1',
    structure: 'cc:structure',
    hp: 'mdi-heart',
    armor: 'mdi-shield',
    stress: 'cc:reactor',
    heat: 'mdi-fire',
    heatCapacity: 'cc:heat',
    repairCapacity: 'cc:repair',
    attackBonus: 'cc:attack',
    techAttack: 'cc:tech_attack',
    limitedBonus: 'cc:limited',
    speed: 'mdi-arrow-right-bold-hexagon-outline',
    evasion: 'cc:evasion',
    edef: 'cc:e_def',
    sensorRange: 'cc:sensor',
    saveBonus: 'cc:save',
    saveTarget: 'cc:save',
    grapple: 'mdi-carabiner',
    ram: 'mdi-car-brake-low-pressure',
    hull: 'mdi-alpha-h-circle-outline',
    agi: 'mdi-alpha-a-circle-outline',
    sys: 'mdi-alpha-s-circle-outline',
    eng: 'mdi-alpha-e-circle-outline',
  };

  public static SortMap = {
    activations: 1,
    size: 2,
    structure: 4,
    hp: 5,
    armor: 6,
    stress: 7,
    heat: 8,
    heatCapacity: 9,
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
  };

  public static cleanKey(key: string): string {
    let k = key.replace(/[\s_\-]/g, '');

    switch (k.toLowerCase()) {
      case 'repcap':
        k = 'repairCapacity';
        break;
      case 'save':
        k = 'saveBonus';
        break;
      case 'target':
        k = 'saveTarget';
        break;
      case 'sensors':
        k = 'sensorRange';
        break;
      case 'edefense':
        k = 'edef';
        break;
      case 'agility':
        k = 'agi';
        break;
      case 'systems':
        k = 'sys';
        break;
      case 'engineering':
        k = 'eng';
        break;
    }

    return k.charAt(0).toLowerCase() + k.slice(1);
  }

  public static expandKey(key: string): string {
    let k = key;
    switch (key.toLowerCase()) {
      case 'hp':
        return 'HP';
      case 'heat':
        return 'Heat Capacity';
      case 'edef':
        return 'E-Defense';
      case 'grapple':
      case 'ram':
        k += ' bonus';
        break;
      case 'agi':
        return 'Agility';
      case 'sys':
        return 'Systems';
      case 'eng':
        return 'Engineering';
    }

    k = key.charAt(0).toUpperCase() + key.slice(1);
    k = k.replace(/([A-Z])/g, ' $1').trim();

    return k;
  }
}

export { Stats };
