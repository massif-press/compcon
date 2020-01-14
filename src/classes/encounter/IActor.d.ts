declare interface IActor {
  ID: string
  EncounterName: string
  Image: string
  Conditions: string[]
  Statuses: string[]
  Resistances: string[]
  Burn: number
  Destroyed: boolean
  Defeat: string
  Activations: number
  Actions: number
  CurrentStructure: number
  CurrentHP: number
  CurrentStress: number
  CurrentHeat: number
  MaxStructure: number
  MaxHP: number
  MaxStress: number
  HeatCapacity: number
  CurrentMove: number
  MaxMove: number
  Reactions: string[]
  Icon: string
  NewTurn: () => void
  FullRepair: () => void
}
