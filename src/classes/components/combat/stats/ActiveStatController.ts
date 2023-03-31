import { Action } from '@/classes/Action';
import { IStatContainer } from './IStatContainer';

interface IActiveStatData {
  currentStructure: number;
  currentHP: number;
  currentHeat: number;
  currentStress: number;
  currentRepairs: number;
  currentMove: number;
  burn: number;
  overshield: number;
  activations: number;
  turnActions: number;
  currentOvercharge: number;
  conditions: string[];
  statuses: string[];
  resistances: string[];
  isBraced: boolean;
  isBraceCooldown: boolean;
  isOvercharged: boolean;
}

class ActiveStatController {
  public Parent: IStatContainer;

  private _currentStructure: number;
  private _currentHP: number;
  private _currentHeat: number;
  private _currentStress: number;
  private _currentRepairs: number;
  private _currentMove!: number;
  private _burn: number;
  private _overshield: number;
  private _activations: number;
  private _turnActions: number;
  private _currentOvercharge: number;
  private _conditions: string[];
  private _statuses: string[];
  private _resistances: string[];
  private _isBraced: boolean;
  private _isBraceCooldown: boolean;
  private _isOvercharged: boolean;

  public Reactions!: Action[];

  public constructor(parent: IStatContainer) {
    this.Parent = parent;

    this._currentStructure = parent.StatController.MaxStructure || 1;
    this._currentHP = parent.StatController.MaxHP || 1;
    this._currentHeat = 0;
    this._currentStress = 0;
    this._currentRepairs = parent.StatController.RepairCapacity || 0;
    this._burn = 0;
    this._overshield = 0;
    this._activations = 1;
    this._turnActions = 2;
    this._currentOvercharge = 0;
    this._conditions = [];
    this._statuses = [];
    this._resistances = [];
    this._isBraced = false;
    this._isBraceCooldown = false;
    this._isOvercharged = false;
  }

  public get CurrentStructure(): number {
    return this._currentStructure;
  }

  public get CurrentHP(): number {
    return this._currentHP;
  }

  public set CurrentHP(val: number) {
    if (val > this.Parent.StatController.MaxHP)
      this._currentHP = this.Parent.StatController.MaxHP;
    else if (val <= 0) {
      this._currentHP = this.Parent.StatController.MaxHP + val;
      this._currentStructure -= 1;
    } else this._currentHP = val;
  }

  public get CurrentHeat(): number {
    return this._currentHeat;
  }

  public set CurrentHeat(val: number) {
    if (val > this.Parent.StatController.HeatCapacity) {
      this.CurrentStress -= 1;
      this.Parent.StatController.HeatCapacity =
        val - this.Parent.StatController.HeatCapacity;
    } else this.Parent.StatController.HeatCapacity = val;
  }

  public get CurrentStress(): number {
    return this._currentStress;
  }

  public set CurrentStress(val: number) {
    this._currentStress = val;
    if (this._currentStress === 0 && !this.Statuses.includes('EXPOSED')) {
      this.Statuses.push('EXPOSED');
    }
  }

  public get CurrentRepairs(): number {
    return this._currentRepairs;
  }

  public get Burn(): number {
    return this._burn;
  }

  public set Burn(burn: number) {
    this._burn = burn;
    if (this._burn < 0) this._burn = 0;
  }

  public get Overshield(): number {
    return this._overshield;
  }

  public set Overshield(val: number) {
    this._overshield = val;
  }

  public get Activations(): number {
    return this._activations;
  }

  public set Activations(val: number) {
    this.Parent.StatController.Activations = val;
  }

  public get TurnActions(): number {
    return this._turnActions;
  }

  public set TurnActions(val: number) {
    this._turnActions = val;
  }

  public get CurrentOvercharge(): number {
    return this._currentOvercharge;
  }

  public set CurrentOvercharge(overcharge: number) {
    this._currentOvercharge = overcharge;
    if (this._currentOvercharge < 0) this._currentOvercharge = 0;
    if (
      this._currentOvercharge >
      this.Parent.StatController.OverchargeTrack.length - 1
    )
      this._currentOvercharge =
        this.Parent.StatController.OverchargeTrack.length - 1;
  }

  public get Conditions(): string[] {
    return this._conditions;
  }

  public set Conditions(conditions: string[]) {
    this._conditions = conditions;
  }

  public get Statuses(): string[] {
    return this._statuses;
  }

  public set Statuses(statuses: string[]) {
    this._statuses = statuses;
  }

  public get Resitances(): string[] {
    return this._resistances;
  }

  public set Resistances(resistances: string[]) {
    this._resistances = resistances;
  }

  public get IsDestroyed(): boolean {
    return !this.CurrentHP && !this.CurrentStructure;
  }

  public get IsStunned(): boolean {
    return this.Conditions.includes('STUNNED');
  }

  public get IsShutDown(): boolean {
    return this.Statuses.includes('SHUT DOWN');
  }

  public get IsDangerZone(): boolean {
    return (
      this._currentHeat >=
      Math.ceil(this.Parent.StatController.HeatCapacity / 2)
    );
  }

  public get IsBraced(): boolean {
    return this._isBraced;
  }

  public get IsBraceCooldown(): boolean {
    return this._isBraceCooldown;
  }

  public get IsOvercharged(): boolean {
    return this._isOvercharged;
  }

  public get CurrentMove(): number {
    return this._currentMove;
  }

  public set CurrentMove(val: number) {
    this._currentMove = val;
  }

  public get MaxMove(): number {
    if (this.IsStunned || this.IsDestroyed) return 0;
    return this.Parent.StatController.Speed;
  }

  public static Serialize(parent: IStatContainer, target: any) {
    if (!parent.ActiveStatController) {
      throw new Error('ActiveStatController is not defined');
    }
    if (!target.current_stats) target.current_stats = {};
    target.current_stats.currentStructure =
      parent.ActiveStatController.CurrentStructure;
    target.current_stats.currentHP = parent.ActiveStatController.CurrentHP;
    target.current_stats.currentHeat = parent.ActiveStatController.CurrentHeat;
    target.current_stats.currentStress =
      parent.ActiveStatController.CurrentStress;
    target.current_stats.currentRepairs =
      parent.ActiveStatController.CurrentRepairs;
    target.current_stats.currentMove = parent.ActiveStatController.CurrentMove;
    target.current_stats.burn = parent.ActiveStatController.Burn;
    target.current_stats.overshield = parent.ActiveStatController.Overshield;
    target.current_stats.activations = parent.ActiveStatController.Activations;
    target.current_stats.turnActions = parent.ActiveStatController.TurnActions;
    target.current_stats.currentOvercharge =
      parent.ActiveStatController.CurrentOvercharge;
    target.current_stats.conditions = parent.ActiveStatController.Conditions;
    target.current_stats.statuses = parent.ActiveStatController.Statuses;
    target.current_stats.resistances = parent.ActiveStatController.Resistances;
    target.current_stats.isBraced = parent.ActiveStatController.IsBraced;
    target.current_stats.isBraceCooldown =
      parent.ActiveStatController.IsBraceCooldown;
    target.current_stats.isOvercharged =
      parent.ActiveStatController.IsOvercharged;
  }

  public static Deserialize(parent: IStatContainer, data: IActiveStatData) {
    if (!parent.ActiveStatController)
      throw new Error(
        `StatsController not found on parent (${typeof parent}). New StatsControllers must be instantiated in the parent's constructor method.`
      );

    parent.ActiveStatController._currentStructure = data.currentStructure;
    parent.ActiveStatController._currentHP = data.currentStress;
    parent.ActiveStatController._currentHeat = data.currentHeat;
    parent.ActiveStatController._currentStress = data.currentStress;
    parent.ActiveStatController._currentRepairs = data.currentRepairs;
    parent.ActiveStatController._currentMove = data.currentMove;
    parent.ActiveStatController._burn = data.burn;
    parent.ActiveStatController._overshield = data.overshield;
    parent.ActiveStatController._activations = data.activations;
    parent.ActiveStatController._turnActions = data.turnActions;
    parent.ActiveStatController._currentOvercharge = data.currentOvercharge;
    parent.ActiveStatController._conditions = data.conditions;
    parent.ActiveStatController._statuses = data.statuses;
    parent.ActiveStatController._resistances = data.resistances;
    parent.ActiveStatController._isBraced = data.isBraced;
    parent.ActiveStatController._isBraceCooldown = data.isBraceCooldown;
    parent.ActiveStatController._isOvercharged = data.isOvercharged;
  }
}

export { ActiveStatController };
export type { IActiveStatData };
