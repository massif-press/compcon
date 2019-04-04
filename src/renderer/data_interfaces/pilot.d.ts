declare interface PilotLicense {
    name: string, source: string, level: number
}

type ItemID = { id: string }

declare interface PilotLoadout {
    id: string,
    items: {
        armor: (ItemID | null)[],
        gear: (ItemID | null)[],
        weapon: (ItemID | null)[]
    },
    name: string
}

declare interface PilotSkill {
    id: string, bonus: number
}

declare interface PilotInvocation {
    trigger: string,
    accuracy?: true,
    difficulty?: true,
}

declare interface PilotTalent {
    id: string, rank: number
}

declare interface MechMount {
    mount_type: string,
    weapons: { id: string, mod?: string }[],
    bonuses: string[],
    imparm?: true
}

declare interface MechLoadout {
    id: string,
    name: string,
    systems: ItemID[],
    mounts: MechMount[]
}

declare interface MechConfig {
    id: string,
    pilot_id: string,
    name: string,
    frame_id: string,
    loadouts: MechLoadout[]
}

declare interface Pilot {
    id: string,
    callsign: string,
    name: string,
    level: number,
    background: string,
    notes: string,
    history?: string | null,
    contacts: object[],
    licenses: PilotLicense[],
    loadouts: PilotLoadout[],
    skills: PilotSkill[],
    invocations: PilotInvocation[],
    talents: PilotTalent[],
    mechSkills: {
        hull: number,
        agi: number,
        sys: number,
        eng: number
    },
    core_bonuses: String[],
    configs: MechConfig[],
    portrait?: string,
    avatar?: string
}