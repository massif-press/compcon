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
import {
  CounterController,
  ICounterSaveData,
} from './counters/CounterController';
import { SaveController } from '../save/SaveController';
import { ICounterContainer } from './counters/ICounterContainer';
import { IStatContainer } from './stats/IStatContainer';

class CombatData {
  stats: IStatData = {} as IStatData;
  statuses: { status: any; expires: any }[] = []; //expires should be a condition or round val
  damage: { type: DamageType; condition: string }[] = [];
  state: any;
  counters: ICounterSaveData[] = [];
  combatActions: string[] = [];

  history: any[] = [];
}

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant;

  public DamageStatuses: { type: DamageType; condition: string }[] = [];
  public CombatantState: any = {};
  public Statuses: { status: any; expires: any }[] = [];
  public Counters: Counter[] = [];
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
}
