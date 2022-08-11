import { IStatContainer } from './IStatContainer'

interface IStatData {
  maxHP: number
  size: number
  sizes?: number[]
  armor: number
  evasion: number
  speed: number
  edef: number
  activations: number
  saveTarget?: number
  sensorRange?: number
  limitedBonus?: number
  attackBonus?: number
  techAttack?: number
  grapple?: number
  ram?: number
  saveBonus?: number
  hull?: number
  agi?: number
  sys?: number
  eng?: number
  maxStructure?: number
  heatCapacity?: number
  maxStress?: number
  repairCapacity?: number
  overchargeTrack?: string[]
}

class StatController {
  public Parent: IStatContainer

  public MaxHP = 0
  public Size = 1
  public Sizes = [1]
  public Armor = 0
  public Evasion = 0
  public Speed = 0
  public EDefense = 0
  public Activations = 0
  public SaveTarget = 0
  public SensorRange = 0
  public LimitedBonus = 0
  public AttackBonus = 0
  public TechAttack = 0
  public Grapple = 0
  public Ram = 0
  public SaveBonus = 0
  public Hull = 0
  public Agi = 0
  public Sys = 0
  public Eng = 0
  public MaxStructure = 0
  public HeatCapacity = 0
  public MaxStress = 0
  public RepairCapacity = 0
  public OverchargeTrack = []

  public constructor(parent: IStatContainer, source?: any) {
    if (source) this.Update(source)
    this.Parent = parent
  }

  public Update(source: any) {
    console.log('in statcontroller update')
    console.log(source)
    for (const key in this) {
      console.log(key, source[key])
      if (source[key]) this[key] = source[key]
    }
  }

  public get SizeIcon(): string {
    return `cci-size-${this.Size === 0.5 ? 'half' : this.Size}`
  }

  public static Serialize(parent: IStatContainer, target: any) {
    if (!target.stats) target.stats = {}
    target.stats.maxHP = parent.StatController.MaxHP
    target.stats.size = parent.StatController.Size
    target.stats.armor = parent.StatController.Armor
    target.stats.evasion = parent.StatController.Evasion
    target.stats.speed = parent.StatController.Speed
    target.stats.edef = parent.StatController.EDefense
    target.stats.activations = parent.StatController.Activations
    target.stats.saveTarget = parent.StatController.SaveTarget || null
    target.stats.sensorRange = parent.StatController.SensorRange || null
    target.stats.limitedBonus = parent.StatController.LimitedBonus || null
    target.stats.attackBonus = parent.StatController.AttackBonus || null
    target.stats.techAttack = parent.StatController.TechAttack || null
    target.stats.grapple = parent.StatController.Grapple || null
    target.stats.ram = parent.StatController.Ram || null
    target.stats.saveBonus = parent.StatController.SaveBonus || null
    target.stats.hull = parent.StatController.Hull || null
    target.stats.agi = parent.StatController.Agi || null
    target.stats.sys = parent.StatController.Sys || null
    target.stats.eng = parent.StatController.Eng || null
    target.stats.maxStructure = parent.StatController.MaxStructure || null
    target.stats.heatCapacity = parent.StatController.HeatCapacity || null
    target.stats.maxStress = parent.StatController.MaxStress || null
    target.stats.repairCapacity = parent.StatController.RepairCapacity || null
    target.stats.overchargeTrack = parent.StatController.OverchargeTrack || null
  }

  public static Deserialize(parent: IStatContainer, data: IStatData) {
    if (!parent.StatController)
      throw new Error(
        `StatController not found on parent (${typeof parent}). New StatControllers must be instantiated in the parent's constructor method.`
      )
    parent.StatController.MaxHP = data.maxHP
    parent.StatController.Size = data.size
    parent.StatController.Armor = data.armor
    parent.StatController.Evasion = data.evasion
    parent.StatController.Speed = data.speed
    parent.StatController.EDefense = data.edef
    parent.StatController.Activations = data.activations
    parent.StatController.SaveTarget = data.saveTarget
    parent.StatController.SensorRange = data.sensorRange
    parent.StatController.LimitedBonus = data.limitedBonus
    parent.StatController.AttackBonus = data.attackBonus
    parent.StatController.TechAttack = data.techAttack
    parent.StatController.Grapple = data.grapple
    parent.StatController.Ram = data.ram
    parent.StatController.SaveBonus = data.saveBonus
    parent.StatController.Hull = data.hull
    parent.StatController.Agi = data.agi
    parent.StatController.Sys = data.sys
    parent.StatController.Eng = data.eng
    parent.StatController.MaxStructure = data.maxStructure
    parent.StatController.HeatCapacity = data.heatCapacity
    parent.StatController.MaxStress = data.maxStress
    parent.StatController.RepairCapacity = data.repairCapacity
    parent.StatController.OverchargeTrack = data.overchargeTrack
  }
}

export { StatController, IStatData }
