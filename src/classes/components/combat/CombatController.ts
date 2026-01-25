import { ActivationType, Counter, DamageType, DiceRoller, Mech, Pilot, Rules } from '@/class';
import { ICombatant } from './ICombatant';
import { IStatData, StatController } from './stats/StatController';
import { CounterController, ICounterCollection } from './counters/CounterController';
import { SaveController } from '../save/SaveController';
import { ICounterContainer } from './counters/ICounterContainer';
import { IStatContainer } from './stats/IStatContainer';
import { Status } from '@/classes/Status';
import { ActiveEffect } from '../feature/active_effects/ActiveEffect';
import _ from 'lodash';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import {
  EffectSpecial,
  IEffectSpecialData,
} from '../feature/active_effects/effect_subtype/EffectSpecial';
import { Action } from '@/classes/Action';
import { Bonus } from '../feature/bonus/Bonus';
import { CompendiumStore } from '@/stores';
import { expiration } from './Expiration';

enum CoverType {
  None = 'none',
  Soft = 'soft',
  Hard = 'hard',
}

type CombatLogEntry = {
  timestamp: number;
  round: number;
  action: string;
  source: string;
  details: string;
};

class CombatData {
  resistances: { type: DamageType; condition: string }[] = [];
  statuses: { status: string; expires: string }[] = [];
  customStatuses: { status: IEffectSpecialData; expires: string }[] = [];
  counters: ICounterCollection = {} as ICounterCollection;
  cover: CoverType = CoverType.None;
  corePower: boolean = true;

  mounted: boolean = true;
  overwatch: boolean = false;
  braced: boolean = false;
  prepared: boolean = false;
  coreActive: boolean = false;
  aiControl: boolean = false;

  selfDestructRound: number = 0;
  isInSelfDestruct: boolean = false;
  reactorDestroyed: boolean = false;
  isDead: boolean = false;

  stats: IStatData = {} as IStatData;

  combatActions: any = {};
  usedActions: string[] = [];

  history: CombatLogEntry[] = [];
}

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant;

  public Resistances: { type: string; condition: string }[] = [];
  public Statuses: { status: Status; expires: expiration }[] = [];
  public CustomStatuses: { status: EffectSpecial; expires: expiration }[] = [];
  public Counters: Counter[] = [];
  public Cover: CoverType = CoverType.None;
  public CorePower = true;

  public Mounted = true;
  public Overwatch = false;
  public Braced = false;
  public Prepared = false;
  public CoreActive = false;
  public AIControl = false;

  public IsInSelfDestruct = false;
  public SelfDestructRound: number = 0;
  public ReactorDestroyed: boolean = false;
  public IsDead: boolean = false;

  public StatController: StatController;
  public CounterController: CounterController;

  public History: CombatLogEntry[] = [];

  private _usedActions: string[] = [];

  // prevent applied events after successful saves. Must be disabled after effect iteration.
  public SaveLock: boolean = false;

  public CombatActions: any = {
    Protocol: true,
    Full: true,
    Quick1: true,
    Quick2: true,
    Overcharge: true,
    Reaction: true,
  };

  constructor(parent: ICombatant) {
    this.Parent = parent;
    this.StatController = new StatController(this, parent.IsEncounterInstance);
    this.CounterController = new CounterController(this);
  }

  // passthroughs ------------------------------------
  public get SaveController(): SaveController {
    return this.Parent.SaveController;
  }

  public get Grit(): number {
    console.log(this.RootActor);
    return this.RootActor.Grit || 0;
  }

  public AllActions(activation: ActivationType): Action[] {
    return this.Parent.FeatureController.Actions.filter((a) => a.Activation === activation);
  }

  public get AllSynergies(): any[] {
    return this.Parent.FeatureController.Synergies;
  }

  public get AllEquipment(): any[] {
    if (this.Parent instanceof Mech)
      return this.Parent.MechLoadoutController.ActiveLoadout.Equipment;
    if (this.Parent instanceof Pilot) return this.Parent.PilotLoadoutController.ActiveLoadout.Items;
    if ((this.Parent as any).NpcFeatureController)
      return (this.Parent as any).NpcFeatureController.Features;
    return [];
  }

  public get RootActor(): any {
    if (this.Parent instanceof Mech) return this.Parent.Parent;
    return this.Parent;
  }

  // use whenever access is needed to guarantee correct mounted pilot selection
  public get ActiveActor(): any {
    if ((this.Parent as Pilot).ActiveMech && this.Mounted) return (this.Parent as Pilot).ActiveMech;
    return this.Parent;
  }

  public get CombatName(): string {
    return (this.Parent as any).Callsign || this.Parent.Name;
  }

  public get Tier(): number {
    if ((this.Parent as any).NpcClassController)
      return (this.Parent as any).NpcClassController.Tier;
    return 1;
  }

  public get LimitedBonus(): number {
    if ((this.Parent as any).LimitedBonus !== undefined) return (this.Parent as any).LimitedBonus;
    return 0;
  }
  // ------------------------------------------------------
  public get Turn(): number {
    return 1;
  }

  public get Activations(): number {
    return this.StatController.getStat('activations');
  }

  public get ActiveEffects(): ActiveEffect[] {
    return this.Parent.FeatureController?.ActiveEffects || [];
  }

  public get Bonuses(): Bonus[] {
    return this.Parent.FeatureController?.Bonuses || [];
  }

  public get Name(): string {
    if ((this.Parent as any).Callsign)
      return `${(this.Parent as any).Callsign} (${this.Parent.Name})`;
    return this.Parent.Name;
  }

  public Activate(): void {
    this.StatController.CurrentStats['activations']--;
    if (this.StatController.CurrentStats['activations'] < 0) this.Reset();
  }

  public get HasRemainingActions(): boolean {
    // ignore overcharge and reaction for this check
    return this.CanActivate('protocol') || this.CanActivate('full') || this.CanActivate('quick');
  }

  public SortedActiveEffects(sort: string, dir: 'asc' | 'desc'): ActiveEffect[] {
    let effects = [...this.ActiveEffects];
    switch (sort) {
      case '':
        return _.orderBy(effects, ['Name'], [dir]);
      case 'name':
        return _.orderBy(effects, ['Name'], [dir]);
      case 'usage':
        return _.orderBy(effects, [(ae) => (ae.Applied ? 1 : 0)], [dir]);
      default:
        return effects;
    }
  }

  public getSavingThrowBonus(stat: string): number {
    // TODO
    let bonus = 0;
    return bonus;
  }

  public get SaveTarget(): number {
    // TODO: bonuses
    return this.StatController.CurrentStats.saveTarget;
  }

  public get IsAIControlled(): boolean {
    return !this.IsDestroyed && this.AIControl && (this.HasAISystems || !this.Mounted);
  }

  public get HasAISystems(): boolean {
    return (this.Parent as Mech).MechLoadoutController?.ActiveLoadout.AISystems.some(
      (x) => !x.Destroyed,
    );
  }

  public ToggleMounted(): void {
    this.Mounted = !this.Mounted;
    if (!this.Mounted && this.HasAISystems) {
      this.AIControl = true;
    }
  }

  public CanActivate(action: string): boolean {
    const str = action.toLowerCase().replace(' ', '');
    switch (str) {
      case 'free':
        return true;
      case 'protocol':
        return (
          this.CombatActions.Protocol &&
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full
        );
      case 'ordnance':
        return (
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full &&
          this.CombatActions.Overcharge &&
          this.StatController.CurrentStats['speed'] >= this.StatController.MaxStats['speed']
        );
      case 'full':
      case 'fulltech':
        return this.CombatActions.Full && this.CombatActions.Quick1 && this.CombatActions.Quick2;
      case 'quick':
      case 'quicktech':
      case 'invade':
        return this.CombatActions.Quick1 || this.CombatActions.Quick2;
      case 'overcharge':
        return this.CombatActions.Overcharge;
      case 'reaction':
        return this.CombatActions.Reaction;
      case 'move':
        return this.StatController.CurrentStats['speed'] > 0;
      default:
        return false;
    }
  }

  public ResetCombatActions(): void {
    this.CombatActions = {
      Protocol: true,
      Full: true,
      Quick1: true,
      Quick2: true,
      Overcharge: true,
      Reaction: true,
    };
  }

  public toggleCombatAction(action: string) {
    const str = action.toLowerCase();
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = !this.CombatActions.Protocol;
        break;
      case 'full':
      case 'fulltech':
        this.CombatActions.Full = !this.CombatActions.Full;
        this.CombatActions.Quick1 = this.CombatActions.Full;
        this.CombatActions.Quick2 = this.CombatActions.Full;
        break;
      case 'quick':
      case 'quicktech':
      case 'invade':
        if (this.CombatActions.Quick1) this.CombatActions.Quick1 = false;
        else if (this.CombatActions.Quick2) this.CombatActions.Quick2 = false;
        else if (!this.CombatActions.Quick1) this.CombatActions.Quick1 = true;
        else if (!this.CombatActions.Quick2) this.CombatActions.Quick2 = true;
        if (this.CombatActions.Quick1 && this.CombatActions.Quick2) this.CombatActions.Full = true;
        break;
      case 'overcharge':
        this.CombatActions.Overcharge = !this.CombatActions.Overcharge;
        break;
      case 'reaction':
        this.CombatActions.Reaction = !this.CombatActions.Reaction;
        break;
      default:
        break;
    }
  }

  public ResetActivation(action: string): void {
    const str = action.toLowerCase();
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = true;
        break;
      case 'full':
        this.CombatActions.Full = true;
        this.CombatActions.Quick1 = true;
        this.CombatActions.Quick2 = true;
        break;
      case 'quick':
        if (!this.CombatActions.Quick1) this.CombatActions.Quick1 = true;
        else if (!this.CombatActions.Quick2) this.CombatActions.Quick2 = true;
        break;
      case 'overcharge':
        this.CombatActions.Overcharge = true;
        break;
      case 'reaction':
        this.CombatActions.Reaction = true;
        break;
      default:
        break;
    }
  }

  public MarkActionUsed(actionId: string): void {
    if (!this._usedActions.includes(actionId)) this._usedActions.push(actionId);
  }

  public IsActionUsed(actionId: string): boolean {
    return this._usedActions.includes(actionId);
  }

  public ClearActionUsed(actionId: string): void {
    const index = this._usedActions.indexOf(actionId);
    if (index !== -1) this._usedActions.splice(index, 1);
  }

  public setStats(statArr: { key: string; val: number }[], encounter?: EncounterInstance): void {
    statArr.forEach((kvp) => {
      this.StatController.setMax(kvp.key, kvp.val);
    });

    this.StatController.resetCurrentStats();
  }

  public SetBonusStats(encounter): void {
    this.Bonuses.forEach((bonus) => {
      let statId = bonus.ID;
      if (typeof bonus.Value !== 'number') {
        console.log('Non-numeric bonus value detected:', bonus.Value);
        return;
      }

      let value = Number(bonus.Value);
      if (bonus.PerPc) {
        if (encounter.Combatants.filter((c) => c.type === 'pilot').length >= Number(bonus.Value)) {
          statId = bonus.ID.replace('_pct', '');
          value = 1;
        }
      }

      this.StatController.setMax(statId, this.StatController.getStat(statId) + value);
    });
  }

  public SetResistance(type: string, condition?: string): void {
    condition = condition?.toLowerCase() || 'vulnerable';

    const existingIndex = this.ActiveActor.CombatController.Resistances.findIndex(
      (s) => s.type === type,
    );
    if (existingIndex === -1)
      this.ActiveActor.CombatController.Resistances.push({ type, condition });
    else if (condition)
      this.ActiveActor.CombatController.Resistances[existingIndex].condition = condition;
    else this.Resistances.splice(existingIndex, 1);
  }

  public HasStatus(statusID: string): boolean {
    return this.Statuses.some((s) => s.status.ID === statusID);
  }

  public AddSimpleStatus(statusID: string): void {
    const status = CompendiumStore().Statuses.find((s) => s.ID === statusID);
    if (status) this.SetStatus(status);
  }

  public SetStatus(status: Status, expires?: any): void {
    if (!status) return;
    const existingIndex = this.Statuses.findIndex((s) => s.status.ID === status.ID);
    if (existingIndex === -1) {
      this.Statuses.push({ status, expires });
    } else if (expires) {
      this.Statuses[existingIndex].expires = expires;
    } else {
      this.Statuses.splice(existingIndex, 1);
    }
  }

  public get IsDestroyed(): boolean {
    return this.StatController.CurrentStats['structure'] <= 0;
  }

  public get IsInDangerZone(): boolean {
    if (!this.StatController.MaxStats['heatcap']) return false;
    return (
      this.StatController.CurrentStats['heatcap'] >=
      Math.ceil(this.StatController.MaxStats['heatcap'] / 2)
    );
  }

  public SetCustomStatus(special: EffectSpecial, expires?: any): void {
    if (!special) return;
    const existingIndex = this.CustomStatuses.findIndex(
      (s) => s.status.Attribute === special.Attribute,
    );
    if (existingIndex === -1) {
      this.CustomStatuses.push({ status: special, expires });
    } else if (expires) {
      this.CustomStatuses[existingIndex].expires = expires;
    } else {
      this.CustomStatuses.splice(existingIndex, 1);
    }
  }

  public get OverchargeTrack(): any[] {
    return (this.Parent as any).OverchargeTrack || Rules.Overcharge;
  }

  public get OverchargeLevel(): number {
    return this.StatController.CurrentStats['overcharge'] || 0;
  }

  public get OverchargeCost(): string | number {
    const track = (this.Parent as any).OverchargeTrack || Rules.Overcharge;
    return track[this.OverchargeLevel];
  }

  public IncreaseOverchargeLevel(): void {
    if (this.OverchargeLevel < this.OverchargeTrack.length - 1) {
      this.StatController.CurrentStats['overcharge'] += 1;
    }
  }

  // these are split out to furnish UI with more detailed breakdowns
  public CalculateArmorReduction(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean,
  ): number {
    if (irreducible || ap || type === DamageType.Heat || type === DamageType.Burn) return 0;
    return this.ActiveActor.StatController.CurrentStats['armor'] || 0;
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    reliable = 0,
  ): { total: number; resist: string[]; condition: string[] } {
    let out = { total: value, resist: [] as string[], condition: [] as string[] };

    if (reliable > 0 && out.total < reliable) {
      out.total = reliable;
    }

    if (this.HasStatus('exposed') && type !== DamageType.Heat && type !== DamageType.Burn) {
      out.total *= 2;
      out.condition.push('exposed');
    }

    if (this.HasStatus('shredded')) {
      out.condition.push('shredded');
      ap = true;
    }

    if (irreducible) return out;

    out.total = Math.max(0, out.total - this.CalculateArmorReduction(type, value, ap, irreducible));

    const resist = this.ActiveActor.CombatController.Resistances.find(
      (r) => r.type === type.toLowerCase(),
    );

    if (resist) {
      if (resist.condition === 'vulnerable') {
        out.total = Math.floor(out.total * 2);
        out.resist.push('vulnerable');
      } else if (!this.HasStatus('shredded') && resist.condition === 'resistance') {
        out.total = Math.floor(out.total / 2);
        out.resist.push('resistance');
      } else if (!this.HasStatus('shredded') && resist.condition === 'immunity') {
        out.total = 0;
        out.resist.push('immunity');
      }
    }

    return out;
  }

  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
  ): void {
    if (this.SaveLock) return;

    if (type === DamageType.Heat && !this.ActiveActor.StatController.MaxStats['stress']) {
      type = DamageType.Energy;
    }

    let damage = this.CalculateDamage(type, value, ap, irreducible);

    this.ApplyDamage(type, damage.total);
  }

  public ApplyDamage(type: DamageType, value: number) {
    if (type === DamageType.Heat) {
      this.ActiveActor.CombatController.ApplyHeat(value);
    }

    // subtract this damage from current hp
    this.ActiveActor.StatController.CurrentStats['hp'] -= value;
    // if hull goes below 0, subtract 1 from structure and add max hp back to current hp
    while (
      this.ActiveActor.StatController.CurrentStats['hp'] <= 0 &&
      this.ActiveActor.StatController.CurrentStats['structure'] > 0
    ) {
      this.ActiveActor.StatController.CurrentStats['structure'] -= 1;
      this.ActiveActor.StatController.CurrentStats['hp'] +=
        this.ActiveActor.StatController.MaxStats['hp'];
    }

    // if structure goes below 0, set to 0
    if (this.ActiveActor.StatController.CurrentStats['structure'] < 0) {
      this.ActiveActor.StatController.CurrentStats['structure'] = 0;
    }
  }

  public ApplyHeat(value: number): void {
    let totalValue = value;
    const target = this.ActiveActor.CombatController;

    target.StatController.CurrentStats['heatcap'] += totalValue;

    // if heatcap goes above max, subtract 1 from stress and set heatcap to 0
    while (this.StatController.CurrentStats['heatcap'] > this.StatController.MaxStats['heatcap']) {
      target.StatController.CurrentStats['stress'] -= 1;
      target.StatController.CurrentStats['heatcap'] -= target.StatController.MaxStats['heatcap'];
    }

    // if stress goes below 0, set to 0
    if (target.StatController.CurrentStats['stress'] < 0) {
      target.StatController.CurrentStats['stress'] = 0;
    }
  }

  public ApplyStatus(
    status: Status,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance,
  ): void {
    if (this.SaveLock) return;
    if (!status) return;
    const expirationObj = new expiration(expires, owner, target, encounter);
    const existingIndex = this.ActiveActor.CombatController.Statuses.findIndex(
      (s) => s.status.ID === status.ID,
    );
    if (existingIndex === -1) {
      this.ActiveActor.CombatController.Statuses.push({ status, expires: expirationObj });
    } else {
      this.ActiveActor.CombatController.Statuses[existingIndex].expires.Raw = expires;
    }
  }

  public RemoveStatus(statusID: string): void {
    const existingIndex = this.ActiveActor.CombatController.Statuses.findIndex(
      (s) => s.status.ID === statusID,
    );
    if (existingIndex !== -1) {
      this.ActiveActor.CombatController.Statuses.splice(existingIndex, 1);
    }
  }

  public ApplyCustomStatus(
    customStatus: EffectSpecial,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance,
  ): void {
    if (this.SaveLock) return;
    if (!customStatus) return;
    const expirationObj = new expiration(expires, owner, target, encounter);
    const existingIndex = this.ActiveActor.CombatController.CustomStatuses.findIndex(
      (s) => s.status.Attribute === customStatus.Attribute,
    );
    if (existingIndex === -1) {
      this.ActiveActor.CombatController.CustomStatuses.push({
        status: customStatus,
        expires: expirationObj,
      });
    } else {
      this.ActiveActor.CombatController.CustomStatuses[existingIndex].expires.Raw = expires;
    }
  }

  public RemoveCustomStatus(attribute: string): void {
    const existingIndex = this.ActiveActor.CombatController.CustomStatuses.findIndex(
      (s) => s.status.Attribute === attribute,
    );
    if (existingIndex !== -1) {
      this.ActiveActor.CombatController.CustomStatuses.splice(existingIndex, 1);
    }
  }

  public AddStatVal(stat, val): void {
    const osVal = Number(val);
    if (isNaN(osVal)) return;
    if (!this.StatController.CurrentStats[stat]) this.StatController.CurrentStats[stat] = 0;
    this.StatController.CurrentStats[stat] += osVal;
    if (
      this.StatController.MaxStats[stat] &&
      this.StatController.CurrentStats[stat] > this.StatController.MaxStats[stat]
    ) {
      this.StatController.CurrentStats[stat] = this.StatController.MaxStats[stat];
    }
  }

  public SetCore(active: boolean, round: number): void {
    this.CoreActive = active;
    this.CorePower = false;
    this.History.push({
      timestamp: Date.now(),
      round,
      action: active ? 'Core Activated' : 'Core Deactivated',
      source: this.CombatName,
      details: '',
    });
  }

  public Stabilize(
    action: 'cool' | 'repair' | 'reload' | 'clear_burn' | 'clear self' | 'clear ally' | 'npc',
  ): void {
    switch (action) {
      case 'cool':
        this.StatController.CurrentStats['heatcap'] = 0;
        this.RemoveStatus('exposed');
        break;
      case 'repair':
        this.StatController.CurrentStats['hp'] = this.StatController.MaxStats['hp'];
        this.StatController.CurrentStats['repcap'] -= 1;
        break;
      case 'reload':
        this.Reload();
        break;
      case 'clear_burn':
        this.StatController.CurrentStats['burn'] = 0;
        break;
      case 'npc':
        this.Reload();
        this.StatController.CurrentStats['heatcap'] = 0;
        this.RemoveStatus('exposed');
        break;
      case 'clear self':
      case 'clear ally':
      default:
        break;
    }
  }

  public RegisterEvent(
    eventData: string[],
    effect: Action | ActiveEffect,
    encounter: EncounterInstance,
  ): void {
    this.History.push({
      timestamp: Date.now(),
      round: encounter.Round,
      action: effect.Name,
      source: effect.Origin.Name,
      details: eventData.join('; '),
    });
  }

  public getExpiredStatuses(
    currentRound: number,
    currentActorID: string,
  ): { status: Status; expires: expiration }[] {
    return this.Statuses.filter((s) =>
      s.expires.HasExpired(currentRound, currentActorID, this.Turn),
    );
  }

  public EndRound(encounter): void {
    if (this.Braced) {
      this.Braced = false;
      this.CustomStatuses.push({
        status: new EffectSpecial({
          attribute: 'Brace Cooldown',
          detail:
            'Due to the stress of bracing, until the end of this turn you can only take one quick action – you cannot take reactions, overcharge, move normally, take full actions, or take free actions.',
        }),
        expires: new expiration('end_turn_self', this.Parent.CombatController, this, encounter),
      });
      this.CombatActions = {
        Protocol: false,
        Full: false,
        Quick1: true,
        Quick2: false,
        Overcharge: false,
        Reaction: false,
      };
    } else {
      this.StatController.CurrentStats['speed'] = this.StatController.MaxStats['speed'];
      this.CombatActions = {
        Protocol: true,
        Full: true,
        Quick1: true,
        Quick2: true,
        Overcharge: true,
        Reaction: true,
      };
    }
    this.StatController.CurrentStats['activations'] = this.StatController.MaxStats['activations'];
    this._usedActions = [];
    this.AllEquipment.forEach((eq) => {
      if (!eq.IsReloading) return;
      if (eq.Recharge < 0) return;
      eq.IsUsed = false;
    });
  }

  public Reset(): void {
    this.ResetCombatActions();
    this.StatController.CurrentStats['activations'] = this.StatController.MaxStats['activations'];
    this.StatController.CurrentStats['speed'] = this.StatController.MaxStats['speed'];
    this._usedActions = [];
    this.AllEquipment.forEach((eq) => {
      if (!eq.IsReloading) return;
      if (eq.Recharge < 0) return;
      eq.IsUsed = false;
    });
    if (this.Parent instanceof Pilot) {
      if (this.Parent.ActiveMech) this.Parent.ActiveMech.CombatController.Reset();
    }
  }

  public Reload(): void {
    this.AllEquipment.forEach((eq) => {
      if (eq.IsReloading) eq.IsUsed = false;
    });
  }

  public CommitSelfDestruct(): void {
    this.StatController.CurrentStats['structure'] = 0;
    this.StatController.CurrentStats['hp'] = 0;
    this.StatController.CurrentStats['heatcap'] = 0;
    this.StatController.CurrentStats['stress'] = 0;
    this.IsInSelfDestruct = false;
    this.SelfDestructRound = 0;
    this.ReactorDestroyed = true;
    if (this.Mounted && this.Parent instanceof Mech) {
      const pilot = this.Parent.Parent;
      pilot.CombatController.Kill();
    }
  }

  public Kill(): void {
    this.StatController.CurrentStats['hp'] = 0;
    this.IsDead = true;
  }

  public static Serialize(controller: CombatController, target: any) {
    if (!target.stats) target.stats = {};
    if (!target.counters) target.counters = {};
    target.statuses = controller.Statuses.map((s) => ({
      status: s.status.ID,
      expires: expiration.Serialize(s.expires),
    }));
    target.customStatuses = controller.CustomStatuses.map((s) => ({
      status: EffectSpecial.Serialize(s.status),
      expires: s.expires.Raw,
    }));
    target.resistances = controller.Resistances;
    target.cover = controller.Cover;
    target.mounted = controller.Mounted;
    target.overwatch = controller.Overwatch;
    target.braced = controller.Braced;
    target.prepared = controller.Prepared;
    target.coreActive = controller.CoreActive;
    target.corePower = controller.CorePower;
    target.aiControl = controller.AIControl;

    target.selfDestructRound = controller.SelfDestructRound;
    target.isInSelfDestruct = controller.IsInSelfDestruct;
    target.reactorDestroyed = controller.ReactorDestroyed;
    target.isDead = controller.IsDead;

    target.combatActions = controller.CombatActions;

    target.history = controller.History;

    target.usedActions = controller._usedActions;

    StatController.Serialize(controller, target.stats);
    CounterController.Serialize(controller, target.counters);
  }

  public static Deserialize(controller: CombatController, data: CombatData) {
    if (!controller.StatController)
      throw new Error(
        `StatController not found on CombatController. New StatControllers must be instantiated in the CombatController's constructor method.`,
      );

    controller.Resistances = data?.resistances || [];
    controller.Statuses = (data?.statuses || []).map((s) => ({
      status: CompendiumStore().Statuses.find((st) => st.ID === s.status)!,
      expires: expiration.Deserialize(s.expires),
    }));
    controller.CustomStatuses = (data?.customStatuses || []).map((s) => ({
      status: EffectSpecial.Deserialize(s.status),
      expires: expiration.Deserialize(s.expires),
    }));

    controller.Cover = data?.cover || CoverType.None;
    controller.Mounted = data?.mounted || true;
    controller.Overwatch = data?.overwatch || false;
    controller.Braced = data?.braced || false;
    controller.Prepared = data?.prepared || false;
    controller.CorePower = data?.corePower !== undefined ? data.corePower : true;
    controller.CoreActive = data?.coreActive || false;
    controller.AIControl = data?.aiControl || false;

    controller.SelfDestructRound = data?.selfDestructRound || 0;
    controller.IsInSelfDestruct = data?.isInSelfDestruct || false;
    controller.ReactorDestroyed = data?.reactorDestroyed || false;
    controller.IsDead = data?.isDead || false;

    if (data?.combatActions) controller.CombatActions = data.combatActions;

    controller._usedActions = data?.usedActions || [];

    controller.History = data?.history || [];

    StatController.Deserialize(controller, data?.stats || {});
    CounterController.Deserialize(controller, data?.counters || {});
  }
}

const SelfDestructAction = new Action({
  id: 'self_destruct_internal',
  name: 'Self Destruct',
  activation: ActivationType.Free,
  detail: '',
  damage: [
    {
      type: DamageType.Explosive,
      val: '4d6',
      aoe: 'Burst 2',
      save: 'agility',
      save_half: true,
    },
  ],
});

export { CombatController, SelfDestructAction };
export type { CombatData, CoverType, CombatLogEntry };
