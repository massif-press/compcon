// declare interface Damage {
//     type?: 'variable' | 'explosive' | 'kinetic' | 'energy' | 'burn' | 'heat',
//     val: number | string,
//     override?: true
// }

// declare interface WeaponRange {
//     type?: 'range' | 'threat' | 'thrown' | 'blast' | 'burst' | 'cone' | 'line',
//     val: number | string,
//     override?: true
// }

// declare interface Weapon extends CCItem {
//     sp?: number,
//     mount: 'Auxiliary' | 'Main' | 'Heavy' | 'Superheavy' | 'Integrated',
//     type: string,
//     damage: Damage[],
//     range: WeaponRange[],
//     tags: TagList,
//     effect: string,
//     description: string,
//     data_type: "weapon",
//     aptitude: Aptitude,
//     talent_item?: true,
//     talent_id?: string,
//     talent_rank?: number
// }