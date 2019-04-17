declare interface PilotItem {
    id: string,
    type: string,
    name: string,
    description: string
}

declare interface PilotWeapon extends PilotItem {
    tags: TagList,
    range: WeaponRange[],
    damage: Damage[],
    type: "weapon",
    effect?: string
}

declare interface PilotArmor extends PilotItem {
    hp_bonus?: number,
    speed: number,
    speed_bonus?: number,
    armor: number,
    edef: number,
    evasion: number,
    evasion_bonus?: number,
    type: "armor",
}

declare interface PilotGear extends PilotItem {
    uses?: number,
    type: "gear",
}