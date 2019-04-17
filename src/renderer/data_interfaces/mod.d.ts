declare interface WeaponMod extends CCItem {
    sp: number,
    applied_to: ('rifle' | 'cannon' | 'launcher' | 'cqb' | 'nexus' | 'melee')[],
    applied_string: string,
    effect: string,
    data_type: "mod",
    description: string,
    tags?: TagList
}