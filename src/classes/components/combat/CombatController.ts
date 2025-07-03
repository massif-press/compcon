// this should hold/modify/manage stats
// this should hold statuses/conditions/damage vulns
// combat actions
// counters
// achievement watchers
// damage handlers
// manage destroy/cascade/ejected/etc state

import { Counter, DamageType } from '@/class';
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
  specialStatuses: { status: any; expires: any }[] = [];
  damage: { type: DamageType; condition: string }[] = [];
  state: any;
  counters: ICounterCollection = {} as ICounterCollection;
  combatActions: string[] = [];
  cover: CoverType = CoverType.None;

  history: any[] = [];
}

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant;

  public DamageStatuses: { type: string; condition: string }[] = [];
  public CombatantState: any = {};
  public Statuses: { status: Status; expires: any }[] = [];
  public SpecialStatuses: { status: Status; expires: any }[] = [];
  public Counters: Counter[] = [];
  public Cover: CoverType = CoverType.None;
  private _combatActions: string[] = [];

  public StatController: StatController;
  public CounterController: CounterController;

  public get SaveController(): SaveController {
    return this.Parent.SaveController;
  }

  constructor(parent: ICombatant) {
    this.Parent = parent;
    this.StatController = new StatController(this);
    this.CounterController = new CounterController(this);
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

  public static Serialize(controller: CombatController, target: any) {
    if (!target.stats) target.stats = {};
    if (!target.counters) target.counters = {};
    target.statuses = controller.Statuses;
    target.damage = controller.DamageStatuses;
    target.state = controller.CombatantState;
    target.combatActions = controller._combatActions;
    target.cover = controller.Cover;
    StatController.Serialize(controller, target.stats);
    CounterController.Serialize(controller, target.counters);
  }

  public static Deserialize(controller: CombatController, data: CombatData) {
    if (!controller.StatController)
      throw new Error(
        `StatController not found on CombatController. New StatControllers must be instantiated in the CombatController's constructor method.`
      );

    controller.Statuses = data?.statuses || [];
    controller.DamageStatuses = data?.damage || [];
    controller.CombatantState = data?.state || {};
    controller._combatActions = data?.combatActions || [];
    controller.Cover = data?.cover || CoverType.None;
    StatController.Deserialize(controller, data?.stats || {});
    CounterController.Deserialize(controller, data?.counters || {});
  }
}

export { CombatController };
export type { CombatData };
