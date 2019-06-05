export module NPCSystem {
  interface Base {
    name: string;
    class: string;
    effect?: string;
    effect_short?: string;
    hide_on_card?: boolean;
    base: boolean;
    tags?: {
      id: string;
      val?: number | number[];
    }[];
  }

  export interface Roll {
    flat?: {
      val: number;
      pertier: boolean;
    };
    accdiff?: {
      val: number;
      pertier: boolean;
    };
  }

  export interface NonWeapon extends Base {
    recharge?: number;
    type: 'system' | 'trait';
    action?:
      | 'free'
      | 'quick'
      | 'full'
      | 'protocol'
      | 'reaction'
      | 'quicktech'
      | 'fulltech';
    tech_roll?: Roll;
    stat_bonuses?: {
      [key: string]: number;
    };
  }

  export interface Weapon extends Base {
    type: 'weapon';
    weapon_type: [
      'Auxiliary' | 'Main' | 'Heavy' | 'Superheavy',
      'CQB' | 'Rifle' | 'Cannon' | 'Nexus' | 'Launcher' | 'Melee'
    ];
    weapon_roll: Roll;
    smart?: true;
    weapon_range: {
      type: string;
      val: number;
    }[];
    damage?: {
      val: number[];
      type: string;
    }[];
  }
  export type Any = NonWeapon | Weapon;
}

// const mySystems: NPCSystem.Any[] =
