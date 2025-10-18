// this should hold/modify/manage stats
// this should hold statuses/conditions/damage vulns
// combat actions
// counters
// achievement watchers
// damage handlers
// manage destroy/cascade/ejected/etc state

import { Counter, DamageType, DiceRoller, Rules } from '@/class';
import { ICombatant } from './ICombatant';
import { IStatData, StatController } from './stats/StatController';
import { CounterController, ICounterCollection } from './counters/CounterController';
import { SaveController } from '../save/SaveController';
import { ICounterContainer } from './counters/ICounterContainer';
import { IStatContainer } from './stats/IStatContainer';
import { Status } from '@/classes/Status';

enum CoverType {
  None = 'none',
  Soft = 'soft',
  Hard = 'hard',
}

class CombatData {
  stats: IStatData = {} as IStatData;
  statuses: { status: any; expires: any }[] = []; //expires should be a condition or round val
  customStatuses: { status: string; expires: any }[] = [];
  customDamageStatuses: { type: string; condition: string }[] = [];
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

  public DamageStatuses: { type: string; condition: string }[] = [];
  public CustomStatuses: { status: string; expires: any }[] = [];
  public CustomDamageStatuses: { type: string; condition: string }[] = [];
  public CombatantState: any = {};
  public Statuses: { status: Status; expires: any }[] = [];
  public SpecialStatuses: { status: Status; expires: any }[] = [];
  public Counters: Counter[] = [];
  public Cover: CoverType = CoverType.None;
  public Engaged: boolean = false;

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

  public CanActivate(action: string): boolean {
    const str = action.toLowerCase();
    switch (str) {
      case 'protocol':
        return (
          this.CombatActions.Protocol &&
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full
        );
      case 'full':
        return this.CombatActions.Full && this.CombatActions.Quick1 && this.CombatActions.Quick2;
      case 'quick':
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

  public SetDamageStatus(type: string, condition?: string): void {
    const existingIndex = this.DamageStatuses.findIndex((s) => s.type === type);
    if (existingIndex === -1)
      this.DamageStatuses.push({ type, condition: condition || 'vulnerable' });
    else if (condition) this.DamageStatuses[existingIndex].condition = condition;
    else this.DamageStatuses.splice(existingIndex, 1);
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

  public static Serialize(controller: CombatController, target: any) {
    if (!target.stats) target.stats = {};
    if (!target.counters) target.counters = {};
    target.statuses = controller.Statuses;
    target.customStatuses = controller.CustomStatuses;
    target.customDamageStatuses = controller.CustomDamageStatuses;
    target.damage = controller.DamageStatuses;
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
    controller.CustomDamageStatuses = data?.customDamageStatuses || [];
    controller.DamageStatuses = data?.damage || [];
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
