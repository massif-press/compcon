type IntegratedWeapon = {
    name: string,
    mount: string,
    type: string,
    damage?: Damage[],
    range?: WeaponRange[],
    tags?: Tag[],
    effect?: string,
    description?: string,
}

declare interface Trait { name: string, description: string }

declare interface Frame {
    id: string,
    source: string,
    name: string,
    mechtype: string,
    description: string,
    mounts: ('Main' | 'Heavy' | 'Aux/Aux' | 'Main/Aux' | 'Flex')[],
    stats: {
        size: 0.5 | 1 | 2 | 3 | 4,
        armor: number,
        hp: number,
        evasion: number,
        edef: number,
        heatcap: number,
        repcap: number,
        sensor_range: number,
        tech_attack: number,
        save: number,
        speed: number,
        sp: number
    },
    traits: Trait[],
    core_system: {
        name: string,
        description: string,
        integrated?: IntegratedWeapon,
        passive?: string,
        active_name: string,
        effect: string,
        tags: string[]
    },
    data_type: "frame",
    aptitude: {}
}