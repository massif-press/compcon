declare interface Brew {
    info: { active: boolean }, dir: string
}

declare interface CCLicense {
    source: string,
    license: string,
    unlocks: (CCItem | Frame)[][],
    brew: any | null
}

declare interface AppState {
    presearch: string,
    UserDataPath: string,
    Backgrounds: object[],
    Talents: PilotTalent[],
    Skills: PilotSkill[],
    CoreBonuses: CoreBonus[],
    Frames: Frame[],
    Manufacturers: object[],
    MechWeapons: Weapon[],
    WeaponMods: WeaponMod[],
    MechSystems: System[],
    PilotGear: PilotGear[],
    Tags: Tag[],
    Statuses: Status[],
    Brews: Brew[],
    Licenses: CCLicense[],
    activeConfigID: string,
    Pilots: Pilot[],
    activePilotID: string,
    printOptions: object
}

declare interface AppContext {
    commit: (a: string, b?: any) => void,
    dispatch: (a: string, b?: any, c?: any) => void,
    state: AppState,
    getters: any
}