import { CompendiumStore } from '@/stores';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { Rules, Pilot, Frame, CoreBonus, Mount } from '@/class';
import { ImageTag } from '@/io/ImageManagement';
import { Bonus } from '../components/feature/bonus/Bonus';
import { IMechLoadoutData } from './components/loadout/MechLoadout';
import {
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components';
import { IFeatureController } from '../components/feature/IFeatureController';
import { FeatureController } from '../components/feature/FeatureController';
import {
  IMechLoadoutSaveData,
  MechLoadoutController,
} from './components/loadout/MechLoadoutController';
import { CompendiumItem } from '../CompendiumItem';
import { ILicenseRequirement } from '../pilot/components/license/LicensedItem';
import { IFrameData } from '@/interface';
import {
  IStatData,
  StatController,
} from '../components/combat/stats/StatController';

class IMechData implements IMechLoadoutSaveData {
  img: IPortraitData = {} as IPortraitData;
  id: string = '';
  name: string = '';
  notes: string = '';
  frame: string = '';
  frameData: IFrameData = {} as IFrameData;
  loadouts: IMechLoadoutData[] = [];
  stats: IStatData = {} as IStatData;
  active_loadout_index: number = 0;
}

class Mech implements IPortraitContainer, IFeatureController {
  public readonly ItemType: string = 'mech';
  public readonly StorageType: string = 'Mechs';

  public PortraitController: PortraitController;
  public ImageTag = ImageTag.Mech;
  public FeatureController: FeatureController;
  public MechLoadoutController: MechLoadoutController;
  public StatController: StatController;

  private _id: string;
  private _name: string;
  private _notes: string;
  private _frame: Frame;
  private _pilot: Pilot;

  public constructor(frame: Frame, pilot: Pilot) {
    this._id = uuid();
    this._frame = frame;
    this._pilot = pilot;

    this.PortraitController = new PortraitController(this);
    this.FeatureController = new FeatureController(this);
    this.MechLoadoutController = new MechLoadoutController(this);
    this.StatController = new StatController(this);

    this._name = '';
    this._notes = '';

    this.FeatureController.Register(
      this.Frame,
      this.MechLoadoutController,
      this.Parent.CoreBonusController,
      this.Parent.ReservesController
    );

    this.MechLoadoutController.UpdateLoadouts();
  }

  // -- Passthroughs ------------------------------------------------------------------------------
  public get SaveController(): SaveController {
    return this._pilot.SaveController;
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  public get BrewableItems(): CompendiumItem[] {
    return [
      this.Frame,
      ...this.MechLoadoutController.Loadouts.flatMap((l) => l.Equipment),
    ] as CompendiumItem[];
  }

  public get Created(): number {
    return this.SaveController.Created;
  }

  public get SpecialEquipment(): CompendiumItem[] {
    return this.FeatureController.IntegratedSpecialEquipment.concat(
      this.Pilot.SpecialEquipment
    );
  }

  // -- Info --------------------------------------------------------------------------------------
  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(name: string) {
    this._name = name;
    this.SaveController.save();
  }

  public get EncounterName(): string {
    return this.Pilot.Callsign;
  }

  public get Icon(): string {
    return 'cc:pilot';
  }

  public get Notes(): string {
    return this._notes;
  }

  public set Notes(notes: string) {
    this._notes = notes;
    this.SaveController.save();
  }

  public get Frame(): Frame {
    return this._frame;
  }

  public get Pilot(): Pilot {
    return this._pilot;
  }

  public get Parent(): Pilot {
    return this._pilot;
  }

  public get RequiredLicenses(): ILicenseRequirement[] {
    const requirements = this.MechLoadoutController.ActiveLoadout
      ? this.MechLoadoutController.ActiveLoadout.RequiredLicenses
      : ([] as ILicenseRequirement[]);

    if (this._frame.LicenseLevel === 0) {
      const LL0Idx = requirements.findIndex((x) => x.rank === 0);
      if (LL0Idx > -1)
        requirements[LL0Idx].items.push(`${this.Frame.Name} Frame`);
      else requirements.push(this.Frame.RequiredLicense);
    } else {
      requirements.push(this.Frame.RequiredLicense);
    }

    for (const l of requirements) {
      if (l.rank !== 0)
        l.missing = !this._pilot.has('License', l.license_id, l.rank);
    }

    return requirements.sort((a, b) => {
      return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;
    });
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get SizeIcon(): string {
    return `cc:size_${this.Size === 0.5 ? 'half' : this.Size}`;
  }

  public get Size(): number {
    let size =
      this._frame.Size >= Rules.MaxFrameSize
        ? this._frame.Size
        : Bonus.Int(this._frame.Size, 'size', this);
    if (size < 0.5) size = 0.5;
    if (size > 0.5 && size % 1 !== 0) size = Math.floor(size);
    return size;
  }

  public get SizeContributors(): string[] {
    const output = [`FRAME Base Size: ${this.Frame.Size}`];
    Bonus.Contributors('size', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get Armor(): number {
    const armor = Bonus.Int(this._frame.Armor, 'armor', this);
    return armor > Rules.MaxMechArmor ? Rules.MaxMechArmor : armor;
  }

  public get ArmorContributors(): string[] {
    const output = [`FRAME Base Armor: ${this.Frame.Armor}`];
    Bonus.Contributors('armor', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get SaveTarget(): number {
    return Bonus.Int(this._frame.SaveTarget, 'save', this) + this._pilot.Grit;
  }

  public get SaveTargetContributors(): string[] {
    const output = [
      `FRAME Base Save Target: ${this.Frame.SaveTarget}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
    ];
    Bonus.Contributors('save', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get Evasion(): number {
    // if (this.IsStunned) return 5
    return Bonus.Int(this._frame.Evasion + this.Agi, 'evasion', this);
  }

  public get EvasionContributors(): string[] {
    const output = [
      `FRAME Base Evasion: ${this.Frame.Evasion}`,
      `Pilot AGILITY Bonus: +${this.Agi}`,
    ];
    Bonus.Contributors('evasion', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get Speed(): number {
    return Bonus.Int(
      this._frame.Speed + Math.floor(this.Agi / 2),
      'speed',
      this
    );
  }

  public get SpeedContributors(): string[] {
    const output = [
      `FRAME Base Speed: ${this.Frame.Speed}`,
      `Pilot AGILITY Bonus: +${Math.floor(this.Agi / 2)}`,
    ];
    Bonus.Contributors('speed', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get SensorRange(): number {
    return Bonus.Int(this._frame.SensorRange, 'sensor', this);
  }

  public get SensorRangeContributors(): string[] {
    const output = [`FRAME Base Sensor Range: ${this.Frame.SensorRange}`];
    Bonus.Contributors('sensor', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get EDefense(): number {
    return Bonus.Int(this._frame.EDefense + this.Sys, 'edef', this);
  }

  public get EDefenseContributors(): string[] {
    const output = [
      `FRAME Base E-Defense: ${this.Frame.EDefense}`,
      `Pilot SYSTEMS Bonus: +${this.Sys}`,
    ];
    Bonus.Contributors('edef', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get LimitedBonus(): number {
    return Bonus.Int(Math.floor(this.Eng / 2), 'limited_bonus', this);
  }

  public get LimitedContributors(): string[] {
    const output = [`Pilot ENGINEERING Bonus: +${Math.floor(this.Eng / 2)}`];
    Bonus.Contributors('limited_bonus', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get AttackBonus(): number {
    return Bonus.Int(this._pilot.Grit, 'attack', this);
  }

  public get AttackBonusContributors(): string[] {
    const output = [`Pilot GRIT Bonus: ${this._pilot.Grit}`];
    Bonus.Contributors('attack', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get TechAttack(): number {
    return Bonus.Int(this._frame.TechAttack + this.Sys, 'tech_attack', this);
  }

  public get TechAttackContributors(): string[] {
    const output = [
      `FRAME Base Tech Attack: ${this.Frame.TechAttack}`,
      `Pilot SYSTEMS Bonus: +${this.Sys}`,
    ];
    Bonus.Contributors('tech_attack', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get Grapple(): number {
    return Bonus.Int(Rules.BaseGrapple, 'grapple', this);
  }

  public get GrappleContributors(): string[] {
    const output = [`Base Grapple Value: ${this.Grapple}`];
    Bonus.Contributors('grapple', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get Ram(): number {
    return Bonus.Int(Rules.BaseRam, 'ram', this);
  }

  public get RamContributors(): string[] {
    const output = [`Base Ram Value: ${this.Ram}`];
    Bonus.Contributors('ram', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get SaveBonus(): number {
    return Bonus.Int(this._pilot.Grit, 'save', this);
  }

  public get SaveBonusContributors(): string[] {
    const output = [`Pilot GRIT Bonus: ${this._pilot.Grit}`];
    Bonus.Contributors('save', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  // -- HASE passthroughs -------------------------------------------------------------------------
  public get Hull(): number {
    return this._pilot.MechSkillsController.MechSkills.Hull;
  }

  public get Agi(): number {
    return this._pilot.MechSkillsController.MechSkills.Agi;
  }

  public get Sys(): number {
    return this._pilot.MechSkillsController.MechSkills.Sys;
  }

  public get Eng(): number {
    return this._pilot.MechSkillsController.MechSkills.Eng;
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get MaxStructure(): number {
    return Bonus.Int(this._frame.Structure, 'structure', this);
  }

  public get StructureContributors(): string[] {
    const output = [`FRAME Base Structure: ${this.Frame.Structure}`];
    Bonus.Contributors('structure', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get MaxHP(): number {
    return Bonus.Int(
      this._frame.HP + this._pilot.Grit + this.Hull * 2,
      'hp',
      this
    );
  }

  public get HPContributors(): string[] {
    const output = [
      `FRAME Base HP: ${this.Frame.HP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot HULL Bonus: +${this.Hull * 2}`,
    ];
    Bonus.Contributors('hp', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get CurrentSP(): number {
    if (!this.MechLoadoutController.ActiveLoadout) return this.MaxSP;
    return this.MechLoadoutController.ActiveLoadout.TotalSP;
  }

  public get MaxSP(): number {
    return Bonus.Int(
      this.Frame.SP + this._pilot.Grit + Math.floor(this.Sys / 2),
      'sp',
      this
    );
  }

  public get FreeSP(): number {
    return this.MaxSP - this.CurrentSP;
  }

  public get SPContributors(): string[] {
    const output = [
      `FRAME Base SP: ${this.Frame.SP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot SYSTEMS Bonus: +${Math.floor(this.Sys / 2)}`,
    ];
    Bonus.Contributors('sp', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get HeatCapacity(): number {
    return Bonus.Int(this._frame.HeatCap + this.Eng, 'heatcap', this);
  }

  public get HeatCapContributors(): string[] {
    const output = [
      `FRAME Base Heat Capacity: ${this.Frame.HeatCap}`,
      `Pilot ENGINEERING Bonus: +${this.Eng}`,
    ];
    Bonus.Contributors('heatcap', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get MaxStress(): number {
    return Bonus.Int(this._frame.HeatStress, 'stress', this);
  }

  public get StressContributors(): string[] {
    const output = [`FRAME Base Reactor Stress: ${this.Frame.HeatStress}`];
    Bonus.Contributors('stress', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get RepairCapacity(): number {
    return Bonus.Int(
      this._frame.RepCap + Math.floor(this.Hull / 2),
      'repcap',
      this
    );
  }

  public get RepCapContributors(): string[] {
    const output = [
      `FRAME Base Repair Capacity: ${this.Frame.RepCap}`,
      `Pilot HULL Bonus: +${Math.floor(this.Hull / 2)}`,
    ];
    Bonus.Contributors('repcap', this).forEach((b) => {
      const sign = b.val > -1 ? '+' : '';
      output.push(`${b.name}: ${sign}${b.val}`);
    });
    return output;
  }

  public get OverchargeTrack(): string[] {
    const b = Bonus.getUneval('overcharge', this);
    return b.length ? b[0].Value : Rules.Overcharge;
  }

  public setStats() {
    this.StatController.setMax('size', this.Size);
    this.StatController.setMax('armor', this.Armor);
    this.StatController.setMax('save', this.SaveTarget);
    this.StatController.setMax('structure', this.MaxStructure);
    this.StatController.setMax('hull', this.Hull);
    this.StatController.setMax('agi', this.Agi);
    this.StatController.setMax('sys', this.Sys);
    this.StatController.setMax('eng', this.Eng);
    this.StatController.setMax('evasion', this.Evasion);
    this.StatController.setMax('speed', this.Speed);
    this.StatController.setMax('sensors', this.SensorRange);
    this.StatController.setMax('edef', this.EDefense);
    this.StatController.setMax('limited_bonus', this.LimitedBonus);
    this.StatController.setMax('attack', this.AttackBonus);
    this.StatController.setMax('tech_attack', this.TechAttack);
    this.StatController.setMax('grapple', this.Grapple);
    this.StatController.setMax('ram', this.Ram);
    this.StatController.setMax('hp', this.MaxHP);
    this.StatController.setMax('sp', this.MaxSP);
    this.StatController.setMax('heatcap', this.HeatCapacity);
    this.StatController.setMax('stress', this.MaxStress);
    this.StatController.setMax('repcap', this.RepairCapacity);
    this.StatController.setMax('saveTarget', this.SaveTarget);

    this.StatController.resetCurrentStats();
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get ActiveMounts(): Mount[] {
    return this.MechLoadoutController.ActiveLoadout.AllActiveMounts(this);
  }

  // -- Mountable CORE Bonuses --------------------------------------------------------------------
  public get PilotBonuses(): CoreBonus[] {
    return this.Pilot.CoreBonusController.CoreBonuses.filter(
      (x) => x.IsMountable
    );
  }

  public get AppliedBonuses(): CoreBonus[] {
    return _.flatten(
      this.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        true,
        true
      ).map((x) => x.Bonuses)
    );
  }

  public get AvailableBonuses(): CoreBonus[] {
    return this.PilotBonuses.filter((x) => !this.AppliedBonuses.includes(x));
  }

  public HasCompatibleMods(): boolean {
    for (const w of this.MechLoadoutController.ActiveLoadout.Weapons.filter(
      (x) => !!x.Mod
    )) {
      if (
        !w.Mod!.AllowedTypes.includes(w.ModType) ||
        !w.Mod!.AllowedSizes.includes(w.ModSize) ||
        w.Mod!.RestrictedTypes.includes(w.ModType) ||
        w.Mod!.RestrictedSizes.includes(w.ModSize)
      ) {
        return false;
      }
    }
    return true;
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: Mech): IMechData {
    const data = {
      id: m.ID,
      name: m.Name,
      notes: m.Notes,
      frame: m.Frame.ID,
      frameData: m.Frame.ItemData,
    };

    PortraitController.Serialize(m, data);
    MechLoadoutController.Serialize(m, data);
    StatController.Serialize(m, data);

    return data as IMechData;
  }

  Serialize(): IMechData {
    return Mech.Serialize(this);
  }

  Clone(): ISaveable {
    const itemData = Mech.Serialize(this);
    const newItem = Mech.Deserialize(itemData, this.Pilot);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem;
  }

  public static Deserialize(data: IMechData, pilot: Pilot): Mech {
    let frame;

    if (CompendiumStore().has('Frames', data.frame))
      frame = CompendiumStore().referenceByID('Frames', data.frame) as Frame;
    else {
      frame = new Frame(data.frameData);
      frame.FromInstance = true;
    }

    const m = new Mech(frame, pilot);

    m._id = data.id;
    try {
      MechLoadoutController.Deserialize(m, data);
    } catch (e) {
      pilot.LoadError(e, 'Mech Loadouts');
      pilot.BrewController.MissingContent = true;
    }

    m._name = data.name;
    m._notes = data.notes;

    PortraitController.Deserialize(m, data.img);
    StatController.Deserialize(m, data.stats);

    return m;
  }
}

export { Mech, IMechData };
