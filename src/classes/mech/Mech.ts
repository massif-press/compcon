import { CompendiumStore } from '@/features/compendium/store'
import * as _ from 'lodash-es'
import { Frame, IFrameData } from './components/frame/Frame'
import Mount from './components/mount/Mount'
import { CoreBonus } from '../pilot/components/corebonus/CoreBonus'
import { Pilot } from '../pilot/Pilot'
import { Rules } from '../utility/Rules'
import { ImageTag } from '@/io/ImageManagement'
import { IMechLoadoutData } from './components/loadout/MechLoadout'
import {
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  PortraitController,
  SaveController,
} from '../components'
import { IFeatureController } from '../components/feature/IFeatureController'
import { FeatureController } from '../components/feature/FeatureController'
import {
  IMechLoadoutSaveData,
  MechLoadoutController,
} from './components/loadout/MechLoadoutController'
import { CompendiumItem } from '../CompendiumItem'
import { ILicenseRequirement } from '../pilot/components/license/LicensedItem'
import { CombatController, CombatData } from '../components/combat/CombatController'
import { ICombatant } from '../components/combat/ICombatant'
import { StatController } from '../components/combat/stats/StatController'
import { ExpressionContext } from '../utility/ExpressionContext'
import { MechStatProvider } from './components/MechStatProvider'

class IMechData implements IMechLoadoutSaveData {
  img: IPortraitData = {} as IPortraitData
  id: string = ''
  name: string = ''
  notes: string = ''
  frame: string = ''
  frameData: IFrameData = {} as IFrameData
  loadouts: IMechLoadoutData[] = []
  combat_data: CombatData = {} as CombatData
  active_loadout_index: number = 0
}

class Mech implements IPortraitContainer, IFeatureController, ICombatant {
  public readonly ItemType: string = 'mech'
  public readonly StorageType: string = 'Mechs'

  public PortraitController: PortraitController
  public ImageTag = ImageTag.Mech
  public FeatureController: FeatureController
  public MechLoadoutController: MechLoadoutController
  public CombatController: CombatController
  public StatProvider: MechStatProvider

  private _id: string
  private _name: string
  private _notes: string
  private _frame: Frame
  private _pilot: Pilot

  public IsEncounterInstance = false

  public constructor(frame: Frame, pilot: Pilot) {
    this._id = crypto.randomUUID()
    this._frame = frame
    this._pilot = pilot

    this.PortraitController = new PortraitController(this)
    this.FeatureController = new FeatureController(this)
    this.MechLoadoutController = new MechLoadoutController(this)
    this.CombatController = new CombatController(this)
    this.StatProvider = new MechStatProvider(this)

    this._name = ''
    this._notes = ''

    this.FeatureController.Register(
      this.Frame,
      this.MechLoadoutController,
      this.Parent.CoreBonusController,
      this.Parent.ReservesController,
      this.Parent.TalentsController
    )

    this.MechLoadoutController.UpdateLoadouts()
  }

  // -- Passthroughs ------------------------------------------------------------------------------
  public get SaveController(): SaveController {
    return this._pilot.SaveController
  }

  public get StatController(): StatController {
    return this.CombatController.StatController
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public get BrewableItems(): CompendiumItem[] {
    return [
      this.Frame,
      ...this.MechLoadoutController.Loadouts.flatMap(l => l.Equipment),
    ] as CompendiumItem[]
  }

  public get Created(): number {
    return this.SaveController.Created
  }

  public get SpecialEquipment(): CompendiumItem[] {
    return this.FeatureController.IntegratedSpecialEquipment.concat(this.Pilot.SpecialEquipment)
  }

  // -- Info --------------------------------------------------------------------------------------
  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = crypto.randomUUID()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(name: string) {
    this._name = name
    this.SaveController.save()
  }

  public get EncounterName(): string {
    return this.Pilot.Callsign
  }

  public get Icon(): string {
    return 'cc:pilot'
  }

  public get Notes(): string {
    return this._notes
  }

  public set Notes(notes: string) {
    this._notes = notes
    this.SaveController.save()
  }

  public get Frame(): Frame {
    return this._frame
  }

  public get Pilot(): Pilot {
    return this._pilot
  }

  public get Parent(): Pilot {
    return this._pilot
  }

  public get RequiredLicenses(): ILicenseRequirement[] {
    const requirements = this.MechLoadoutController.ActiveLoadout
      ? this.MechLoadoutController.ActiveLoadout.RequiredLicenses
      : ([] as ILicenseRequirement[])

    if (this._frame.LicenseLevel === 0) {
      const LL0Idx = requirements.findIndex(x => x.rank === 0)
      if (LL0Idx > -1) requirements[LL0Idx].items.push(`${this.Frame.Name} Frame`)
      else requirements.push(this.Frame.RequiredLicense)
    } else {
      requirements.push(this.Frame.RequiredLicense)
    }

    for (const l of requirements) {
      if (l.rank !== 0) l.missing = !this._pilot.has('License', l.license_id || l.name, l.rank)
      if (this.Parent.SpecialEquipment.some(x => l.items.some(n => n === x.Name))) l.missing = false
    }

    return requirements.sort((a, b) => {
      return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0
    })
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get SizeIcon(): string {
    return Rules.SizeIcon(this.Size)
  }

  public get Size(): number { return this.StatProvider.Size }
  public get SizeContributors(): string[] { return this.StatProvider.SizeContributors }
  public get Armor(): number { return this.StatProvider.Armor }
  public get ArmorContributors(): string[] { return this.StatProvider.ArmorContributors }
  public get SaveTarget(): number { return this.StatProvider.SaveTarget }
  public get SaveTargetContributors(): string[] { return this.StatProvider.SaveTargetContributors }
  public get Evasion(): number { return this.StatProvider.Evasion }
  public get EvasionContributors(): string[] { return this.StatProvider.EvasionContributors }
  public get Speed(): number { return this.StatProvider.Speed }
  public get SpeedContributors(): string[] { return this.StatProvider.SpeedContributors }
  public get SensorRange(): number { return this.StatProvider.SensorRange }
  public get SensorRangeContributors(): string[] { return this.StatProvider.SensorRangeContributors }
  public get EDefense(): number { return this.StatProvider.EDefense }
  public get EDefenseContributors(): string[] { return this.StatProvider.EDefenseContributors }
  public get LimitedBonus(): number { return this.StatProvider.LimitedBonus }
  public get LimitedContributors(): string[] { return this.StatProvider.LimitedContributors }
  public get AttackBonus(): number { return this.StatProvider.AttackBonus }
  public get AttackBonusContributors(): string[] { return this.StatProvider.AttackBonusContributors }
  public get TechAttack(): number { return this.StatProvider.TechAttack }
  public get TechAttackContributors(): string[] { return this.StatProvider.TechAttackContributors }
  public get Grapple(): number { return this.StatProvider.Grapple }
  public get GrappleContributors(): string[] { return this.StatProvider.GrappleContributors }
  public get Ram(): number { return this.StatProvider.Ram }
  public get RamContributors(): string[] { return this.StatProvider.RamContributors }
  public get SaveBonus(): number { return this.StatProvider.SaveBonus }
  public get SaveBonusContributors(): string[] { return this.StatProvider.SaveBonusContributors }

  // -- HASE passthroughs -------------------------------------------------------------------------
  public get Hull(): number {
    return this._pilot.MechSkillsController.MechSkills.Hull
  }

  public get Agi(): number {
    return this._pilot.MechSkillsController.MechSkills.Agi
  }

  public get Sys(): number {
    return this._pilot.MechSkillsController.MechSkills.Sys
  }

  public get Eng(): number {
    return this._pilot.MechSkillsController.MechSkills.Eng
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get MaxStructure(): number { return this.StatProvider.MaxStructure }
  public get StructureContributors(): string[] { return this.StatProvider.StructureContributors }
  public get MaxHP(): number { return this.StatProvider.MaxHP }
  public get HPContributors(): string[] { return this.StatProvider.HPContributors }

  public get CurrentSP(): number {
    if (!this.MechLoadoutController.ActiveLoadout) return this.MaxSP
    return this.MechLoadoutController.ActiveLoadout.TotalSP
  }

  public get MaxSP(): number { return this.StatProvider.MaxSP }
  public get FreeSP(): number { return this.MaxSP - this.CurrentSP }
  public get SPContributors(): string[] { return this.StatProvider.SPContributors }
  public get HeatCapacity(): number { return this.StatProvider.HeatCapacity }
  public get HeatCapContributors(): string[] { return this.StatProvider.HeatCapContributors }
  public get MaxStress(): number { return this.StatProvider.MaxStress }
  public get StressContributors(): string[] { return this.StatProvider.StressContributors }
  public get RepairCapacity(): number { return this.StatProvider.RepairCapacity }
  public get RepCapContributors(): string[] { return this.StatProvider.RepCapContributors }
  public get OverchargeTrack(): string[] { return this.StatProvider.OverchargeTrack }

  public getExpressionContext(): ExpressionContext {
    return this.StatProvider.getExpressionContext()
  }

  public getEntityRef(name: string): IFeatureController | null {
    return this.StatProvider.getEntityRef(name)
  }

  public SetStats(): void {
    this.StatProvider.SetStats()
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get ActiveMounts(): Mount[] {
    return this.MechLoadoutController.ActiveLoadout.AllActiveMounts(this)
  }

  // -- Mountable CORE Bonuses --------------------------------------------------------------------
  public get PilotBonuses(): CoreBonus[] {
    return this.Pilot.CoreBonusController.CoreBonuses.filter(x => x.IsMountable)
  }

  public get AppliedBonuses(): CoreBonus[] {
    return _.flatten(
      this.MechLoadoutController.ActiveLoadout.AllEquippableMounts(true, true).map(x => x.Bonuses)
    )
  }

  public get AvailableBonuses(): CoreBonus[] {
    return this.PilotBonuses.filter(x => !this.AppliedBonuses.includes(x))
  }

  public HasCompatibleMods(): boolean {
    for (const w of this.MechLoadoutController.ActiveLoadout.Weapons.filter(x => !!x.Mod)) {
      if (!w.Mod!.AllowedTypes.includes(w.ModType) || !w.Mod!.AllowedSizes.includes(w.ModSize)) {
        return false
      }
    }
    return true
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: Mech, asInstance = false): IMechData {
    const data = {
      id: m.ID,
      name: m.Name,
      notes: m.Notes,
      frame: m.Frame.ID,
      frameData: m.Frame.ItemData,
    }

    PortraitController.Serialize(m, data)
    MechLoadoutController.Serialize(m, data, asInstance)
    CombatController.Serialize(m.CombatController, data)

    return data as IMechData
  }

  Serialize(asInstance = false): IMechData {
    return Mech.Serialize(this, asInstance)
  }

  Clone(): ISaveable {
    const itemData = Mech.Serialize(this)
    const newItem = Mech.Deserialize(itemData, this.Pilot)
    newItem.RenewID()
    newItem.Name += ' (COPY)'
    return newItem
  }

  public static Deserialize(data: IMechData, pilot: Pilot): Mech {
    let frame

    if (CompendiumStore().has('Frames', data.frame))
      frame = CompendiumStore().referenceByID('Frames', data.frame) as Frame
    else {
      frame = new Frame(data.frameData)
      frame.FromInstance = true
    }

    const m = new Mech(frame, pilot)

    m._id = data.id
    try {
      MechLoadoutController.Deserialize(m, data)
    } catch (e) {
      pilot.LoadError(e, 'Mech Loadouts')
      pilot.BrewController.MissingContent = true
    }

    m._name = data.name
    m._notes = data.notes

    PortraitController.Deserialize(m, data.img)
    CombatController.Deserialize(m.CombatController, data as any)

    return m
  }
}

export { Mech, IMechData }
