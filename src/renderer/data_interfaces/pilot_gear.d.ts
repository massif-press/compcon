declare interface PilotWeapon {
    id: string,
    type: "weapon",
    name: string,
    tags: TagList,
    range: WeaponRange[],
    damage: Damage[],
    description: string,
    effect?: string
}
declare interface PilotArmor {
    id: string,
    type: "armor",
    name: string,
    hp_bonus?: number,
    speed: number,
    speed_bonus?: number,
    armor: number,
    edef: number,
    evasion: number,
    evasion_bonus?: number,
    description: string
}
declare interface PilotGear {
    id: string,
    type: "gear",
    uses?: number,
    name: string,
    description: string
}