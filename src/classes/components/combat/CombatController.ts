// this should hold/modify/manage stats
// this should hold statuses/conditions/damage vulns
// combat actions
// counters
// achievement watchers
// damage handlers
// manage destroy/cascade/ejected/etc state

import { Counter, DamageType, DiceRoller, Pilot, Rules } from '@/class';
import { ICombatant } from './ICombatant';
import { IStatData, StatController } from './stats/StatController';
import { CounterController, ICounterCollection } from './counters/CounterController';
import { SaveController } from '../save/SaveController';
import { ICounterContainer } from './counters/ICounterContainer';
import { IStatContainer } from './stats/IStatContainer';
import { Status } from '@/classes/Status';
import { ActiveEffect } from '../feature/active_effects/ActiveEffect';
import _ from 'lodash';

enum CoverType {
  None = 'none',
  Soft = 'soft',
  Hard = 'hard',
}

class CombatData {
  stats: IStatData = {} as IStatData;
  statuses: { status: any; expires: any }[] = []; //expires should be a condition or round val
  customStatuses: { status: string; expires: any }[] = [];
  specialStatuses: { status: any; expires: any }[] = [];
  damage: { type: DamageType; condition: string }[] = [];
  engaged: boolean = false;
  state: any;
  counters: ICounterCollection = {} as ICounterCollection;
  combatActions: string[] = [];
  cover: CoverType = CoverType.None;

  mounted: boolean = true;
  overwatch: boolean = false;
  braced: boolean = false;
  prepared: boolean = false;

  history: any[] = [];
}

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant;

  public Resistances: { type: string; condition: string }[] = [];
  public CustomStatuses: { status: string; expires: any }[] = [];
  public CombatantState: any = {};
  public Statuses: { status: Status; expires: any }[] = [];
  public SpecialStatuses: { status: Status; expires: any }[] = [];
  public Counters: Counter[] = [];
  public Cover: CoverType = CoverType.None;
  public Engaged: boolean = false;
  public CorePower: boolean = true;

  public Mounted: boolean = true;
  public Overwatch: boolean = false;
  public Braced: boolean = false;
  public Prepared: boolean = false;

  public StatController: StatController;
  public CounterController: CounterController;

  public CombatActions: any = {
    Protocol: true,
    Full: true,
    Quick1: true,
    Quick2: true,
    Overcharge: true,
    Reaction: true,
  };

  public get SaveController(): SaveController {
    return this.Parent.SaveController;
  }

  constructor(parent: ICombatant) {
    this.Parent = parent;
    this.StatController = new StatController(this);
    this.CounterController = new CounterController(this);
  }

  public get Activations(): number {
    return this.StatController.getStat('activations');
  }

  public get ActiveEffects(): ActiveEffect[] {
    return this.Parent.FeatureController?.ActiveEffects || [];
  }

  public get Name(): string {
    if ((this.Parent as any).Callsign)
      return `${(this.Parent as any).Callsign} (${this.Parent.Name})`;
    return this.Parent.Name;
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

  public get Tier(): number {
    if ((this.Parent as any).NpcClassController)
      return (this.Parent as any).NpcClassController.Tier;
    return 1;
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

  public CanActivate(action: string): boolean {
    const str = action.toLowerCase();
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
      case 'full':
      case 'full_tech':
      case 'fulltech':
        return this.CombatActions.Full && this.CombatActions.Quick1 && this.CombatActions.Quick2;
      case 'quick':
      case 'quick_tech':
      case 'quicktech':
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
        this.CombatActions.Full = !this.CombatActions.Full;
        break;
      case 'quick':
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

  public setStats(statArr: { key: string; val: number }[]): void {
    statArr.forEach((kvp) => {
      this.StatController.setMax(kvp.key, kvp.val);
    });
    this.StatController.resetCurrentStats();
  }

  public SetResistance(type: string, condition?: string): void {
    console.log(type, condition);
    condition = condition?.toLowerCase() || 'vulnerable';

    const existingIndex = this.Resistances.findIndex((s) => s.type === type);
    if (existingIndex === -1) this.Resistances.push({ type, condition });
    else if (condition) this.Resistances[existingIndex].condition = condition;
    else this.Resistances.splice(existingIndex, 1);
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

  public SetCustomStatus(name: string, expires?: any): void {
    if (!name || !name.trim().length) return;
    const existingIndex = this.CustomStatuses.findIndex((s) => s.status === name);
    if (existingIndex === -1) {
      this.CustomStatuses.push({ status: name, expires });
    } else if (expires) {
      this.CustomStatuses[existingIndex].expires = expires;
    } else {
      this.CustomStatuses.splice(existingIndex, 1);
    }
  }

  public ApplyOvercharge(): void {
    const track = (this.Parent as any).OverchargeTrack || Rules.Overcharge;
    const die = track[this.StatController.CurrentStats['overcharge'] || 0];
    const roll = DiceRoller.roll(die);
  }

  public ApplyDamage(type: DamageType, value: number, ap: boolean = false): void {
    let target = this as CombatController;
    if (this.Parent.ItemType === 'Pilot') {
      if (this.Mounted && (this.Parent as Pilot).ActiveMech)
        target = (this.Parent as Pilot).ActiveMech!.CombatController;
    }

    console.log('applying damage', type, value, ap);
    if (type === DamageType.Heat) {
      target.ApplyHeat(value);
      return;
    }
    let totalDamage =
      ap || type === DamageType.Burn
        ? value
        : Math.max(0, value - target.StatController.CurrentStats['armor']);
    if (target.Resistances.find((ds) => ds.type === type && ds.condition === 'immune')) {
      totalDamage = 0;
    } else if (target.Resistances.find((ds) => ds.type === type && ds.condition === 'vulnerable')) {
      totalDamage = Math.floor(totalDamage * 2);
    } else if (target.Resistances.find((ds) => ds.type === type && ds.condition === 'resistant')) {
      totalDamage = Math.floor(totalDamage / 2);
    }

    // subtract this damage from current hp
    target.StatController.CurrentStats['hp'] -= totalDamage;
    // if hull goes below 0, subtract 1 from structure and add max hp back to current hp
    while (
      target.StatController.CurrentStats['hp'] <= 0 &&
      target.StatController.CurrentStats['structure'] > 0
    ) {
      target.StatController.CurrentStats['structure'] -= 1;
      target.StatController.CurrentStats['hp'] += target.StatController.MaxStats['hp'];
    }

    // if structure goes below 0, set to 0
    if (target.StatController.CurrentStats['structure'] < 0) {
      target.StatController.CurrentStats['structure'] = 0;
    }
  }

  public ApplyHeat(value: number): void {
    this.StatController.CurrentStats['heatcap'] += value;

    // if heatcap goes above max, subtract 1 from stress and set heatcap to 0
    while (this.StatController.CurrentStats['heatcap'] > this.StatController.MaxStats['heatcap']) {
      this.StatController.CurrentStats['stress'] -= 1;
      this.StatController.CurrentStats['heatcap'] -= this.StatController.MaxStats['heatcap'];
    }

    // if stress goes below 0, set to 0
    if (this.StatController.CurrentStats['stress'] < 0) {
      this.StatController.CurrentStats['stress'] = 0;
    }
  }

  public static Serialize(controller: CombatController, target: any) {
    if (!target.stats) target.stats = {};
    if (!target.counters) target.counters = {};
    target.statuses = controller.Statuses;
    target.customStatuses = controller.CustomStatuses;
    target.damage = controller.Resistances;
    target.engaged = controller.Engaged;
    target.state = controller.CombatantState;
    target.cover = controller.Cover;
    target.mounted = controller.Mounted;
    target.overwatch = controller.Overwatch;
    target.braced = controller.Braced;
    target.prepared = controller.Prepared;
    StatController.Serialize(controller, target.stats);
    CounterController.Serialize(controller, target.counters);
  }

  public static Deserialize(controller: CombatController, data: CombatData) {
    if (!controller.StatController)
      throw new Error(
        `StatController not found on CombatController. New StatControllers must be instantiated in the CombatController's constructor method.`
      );

    controller.Statuses = data?.statuses || [];
    controller.CustomStatuses = data?.customStatuses || [];
    controller.Resistances = data?.damage || [];
    controller.Engaged = data?.engaged || false;
    controller.CombatantState = data?.state || {};
    controller.Cover = data?.cover || CoverType.None;
    controller.Mounted = data?.mounted || true;
    controller.Overwatch = data?.overwatch || false;
    controller.Braced = data?.braced || false;
    controller.Prepared = data?.prepared || false;
    StatController.Deserialize(controller, data?.stats || {});
    CounterController.Deserialize(controller, data?.counters || {});
  }
}

export { CombatController };
export type { CombatData };
