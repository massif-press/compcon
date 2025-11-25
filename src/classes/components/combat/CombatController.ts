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
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { EffectSpecial, IEffectSpecialData } from '../feature/active_effects/EffectSpecial';
import { IEffectStatusData } from '../feature/active_effects/EffectStatus';
import { Action } from '@/classes/Action';
import { Bonus } from '../feature/bonus/Bonus';

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

class expiration {
  private _raw: string = '';
  public Period: 'round' | 'turn' | 'encounter' = 'encounter';
  public EndsOn: 'start' | 'end' = 'end';

  // this is the actor that references the self/target whose turn it is for turn-based expirations
  public ExpirationActorID: string | null = null;
  public ExpirationActorTurn: number | null = null;

  // for round-only expirations
  public RoundEndNumber: number | null = null;
  public Raw: string;
  public Text: string = '';

  constructor(
    expiration: string,
    source: CombatController,
    target: CombatController,
    encounter: EncounterInstance
  ) {
    const str = expiration.toLowerCase();
    this.Raw = expiration;
    let text = '';

    if (str.includes('round')) this.Period = 'round';
    else if (str.includes('turn')) this.Period = 'turn';

    if (str.includes('start')) this.EndsOn = 'start';

    if (this.Period === 'turn') {
      if (str.includes('target')) {
        this.ExpirationActorID = target.Parent.ID;
        this.ExpirationActorTurn = target.Turn;
        text = `Ends at the ${this.EndsOn} of your (${target.CombatName}) turn`;
      } else {
        this.ExpirationActorID = source.Parent.ID;
        this.ExpirationActorTurn = source.Turn;
        text = `Ends at the ${this.EndsOn} of ${source.CombatName}'s turn`;
      }
    } else if (this.Period === 'round') {
      const currentRound = encounter.Round;
      const roundOffset = Number(str.split('_').pop() || '1');
      this.RoundEndNumber = currentRound + roundOffset;
      text = `Ends at the ${this.EndsOn} of round ${this.RoundEndNumber}`;
    }

    this.Text = text;
  }

  HasExpired(currentRound: number, currentActorID: string, currentActorTurn: number): boolean {
    if (this.Period === 'round') {
      if (this.RoundEndNumber !== null && currentRound >= this.RoundEndNumber) {
        return true;
      }
    } else if (this.Period === 'turn') {
      if (
        this.ExpirationActorID === currentActorID &&
        this.ExpirationActorTurn !== null &&
        currentActorTurn >= this.ExpirationActorTurn
      ) {
        return true;
      }
    }
    return false;
  }

  public static Serialize(exp: expiration): any {
    return {
      Raw: exp.Raw,
      Period: exp.Period,
      EndsOn: exp.EndsOn,
      ExpirationActorID: exp.ExpirationActorID,
      ExpirationActorTurn: exp.ExpirationActorTurn,
      RoundEndNumber: exp.RoundEndNumber,
      Text: exp.Text,
    };
  }

  public static Deserialize(data: any): expiration {
    const exp = new expiration(data.Raw, {} as any, {} as any, {} as any);
    exp.Period = data.Period;
    exp.EndsOn = data.EndsOn;
    exp.ExpirationActorID = data.ExpirationActorID;
    exp.ExpirationActorTurn = data.ExpirationActorTurn;
    exp.RoundEndNumber = data.RoundEndNumber;
    exp.Text = data.Text;
    return exp;
  }
}

class CombatData {
  stats: IStatData = {} as IStatData;
  statuses: { status: IEffectStatusData; expires: string }[] = [];
  customStatuses: { status: IEffectSpecialData; expires: string }[] = [];
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

  history: CombatLogEntry[] = [];
  turn: any = 0;
}

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant;

  public Resistances: { type: string; condition: string }[] = [];
  public CustomStatuses: { status: EffectSpecial; expires: expiration }[] = [];
  public CombatantState: any = {};
  public Statuses: { status: Status; expires: expiration }[] = [];
  public Counters: Counter[] = [];
  public Cover: CoverType = CoverType.None;
  public Engaged: boolean = false;
  public CorePower: boolean = true;

  public Mounted: boolean = true;
  public Overwatch: boolean = false;
  public Braced: boolean = false;
  public Prepared: boolean = false;
  public CoreActive: boolean = false;
  public AIControl: boolean = false;

  public StatController: StatController;
  public CounterController: CounterController;

  public Turn: number = 0;
  public History: CombatLogEntry[] = [];

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
    this.StatController = new StatController(this);
    this.CounterController = new CounterController(this);
  }

  // passthroughs ------------------------------------
  public get SaveController(): SaveController {
    return this.Parent.SaveController;
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
  // ------------------------------------------------------

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
      case 'full':
      case 'fulltech':
        return this.CombatActions.Full && this.CombatActions.Quick1 && this.CombatActions.Quick2;
      case 'quick':
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

  public ResetActivation(action: string): void {
    const str = action.toLowerCase();
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = true;
        break;
      case 'full':
        this.CombatActions.Full = true;
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

  public setStats(statArr: { key: string; val: number }[]): void {
    statArr.forEach((kvp) => {
      this.StatController.setMax(kvp.key, kvp.val);
    });
    this.StatController.resetCurrentStats();
  }

  public SetResistance(type: string, condition?: string): void {
    condition = condition?.toLowerCase() || 'vulnerable';

    const existingIndex = this.ActiveActor.Resistances.findIndex((s) => s.type === type);
    if (existingIndex === -1) this.ActiveActor.Resistances.push({ type, condition });
    else if (condition) this.ActiveActor.Resistances[existingIndex].condition = condition;
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

  public SetCustomStatus(special: EffectSpecial, expires?: any): void {
    if (!special) return;
    const existingIndex = this.CustomStatuses.findIndex(
      (s) => s.status.Attribute === special.Attribute
    );
    if (existingIndex === -1) {
      this.CustomStatuses.push({ status: special, expires });
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
    if (this.SaveLock) return;
    if (type === DamageType.Heat) {
      this.ActiveActor.ApplyHeat(value);
      return;
    }
    let totalDamage =
      ap || type === DamageType.Burn
        ? value
        : Math.max(0, value - this.ActiveActor.StatController.CurrentStats['armor']);
    if (
      this.ActiveActor.CombatController.Resistances.find(
        (ds) => ds.type === type && ds.condition === 'immune'
      )
    ) {
      totalDamage = 0;
    } else if (
      this.ActiveActor.CombatController.Resistances.find(
        (ds) => ds.type === type && ds.condition === 'vulnerable'
      )
    ) {
      totalDamage = Math.floor(totalDamage * 2);
    } else if (
      this.ActiveActor.CombatController.Resistances.find(
        (ds) => ds.type === type && ds.condition === 'resistant'
      )
    ) {
      totalDamage = Math.floor(totalDamage / 2);
    }

    // subtract this damage from current hp
    this.ActiveActor.StatController.CurrentStats['hp'] -= totalDamage;
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

    if (
      this.ActiveActor.CombatController.Resistances.find(
        (ds) => ds.type === 'heat' && ds.condition === 'immune'
      )
    ) {
      totalValue = 0;
    } else if (
      this.ActiveActor.CombatController.Resistances.find(
        (ds) => ds.type === 'heat' && ds.condition === 'vulnerable'
      )
    ) {
      totalValue = Math.floor(totalValue * 2);
    } else if (
      this.ActiveActor.CombatController.Resistances.find(
        (ds) => ds.type === 'heat' && ds.condition === 'resistant'
      )
    ) {
      totalValue = Math.floor(totalValue / 2);
    }

    this.StatController.CurrentStats['heatcap'] += totalValue;

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

  public ApplyStatus(
    status: Status,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance
  ): void {
    if (this.SaveLock) return;
    if (!status) return;
    const expirationObj = new expiration(expires, owner, target, encounter);
    const existingIndex = this.ActiveActor.CombatController.Statuses.findIndex(
      (s) => s.status.ID === status.ID
    );
    if (existingIndex === -1) {
      this.ActiveActor.CombatController.Statuses.push({ status, expires: expirationObj });
    } else {
      this.ActiveActor.CombatController.Statuses[existingIndex].expires.Raw = expires;
    }
  }

  public ApplyCustomStatus(
    customStatus: EffectSpecial,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance
  ): void {
    if (this.SaveLock) return;
    if (!customStatus) return;
    const expirationObj = new expiration(expires, owner, target, encounter);
    const existingIndex = this.ActiveActor.CombatController.CustomStatuses.findIndex(
      (s) => s.status.Attribute === customStatus.Attribute
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
      (s) => s.status.Attribute === attribute
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

  public RegisterEvent(
    eventData: string[],
    effect: Action | ActiveEffect,
    encounter: EncounterInstance
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
    currentActorID: string
  ): { status: Status; expires: expiration }[] {
    return this.Statuses.filter((s) =>
      s.expires.HasExpired(currentRound, currentActorID, this.Turn)
    );
  }

  public EndRound(): void {
    this.StatController.CurrentStats['activations'] = this.StatController.MaxStats['activations'];
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

    controller.Statuses = [];
    controller.CustomStatuses = [];
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
