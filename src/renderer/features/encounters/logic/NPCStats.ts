
export default class NPCStats {
    hp: number
    evade: number
    edef: number
    heatcap: number
    hull: number
    agility: number
    systems: number
    engineering: number
    armor: number
    speed: number
    sensor: number
    save: number
    structure: number
    stress: number

    statcaps:  { [key: string]: number }
    

    constructor(stats: {
        hp: number
        evade: number
        edef: number
        heatcap: number
        hull: number
        agility: number
        systems: number
        engineering: number
        armor: number
        speed: number
        sensor: number
        save: number
        structure: number
        stress: number
        statcaps: { [key: string]: number }
      }) {
        for (const stat in stats) {
            this[stat] = stats[stat]
        }
    }
}

