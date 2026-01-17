import { v4 as uuid } from 'uuid';
import { CombatantData } from '@/classes/encounter/Encounter';
import { SaveController } from '../..';
import { CombatController } from '../../combat/CombatController';
import { Deployable, IDeployableData } from './Deployable';
import { ICombatant } from '../../combat/ICombatant';
import { FeatureController } from '../FeatureController';

interface IDeployableInstanceData {
  name: string;
  data: IDeployableData;
}

class DeployableInstance implements ICombatant {
  private _number: number;
  public CombatController: CombatController;
  public readonly ItemData: IDeployableData;
  public readonly Base: Deployable;
  public readonly Owner: CombatantData;
  public readonly ID: string = '';
  public name: string;
  public readonly type: string = 'deployable';
  public readonly IsEncounterInstance: boolean = true;
  public readonly ItemType: string = 'Deployable';
  public FeatureController: FeatureController;
  public IsDeployed: boolean = true;

  // stubbed, as this is not required
  public SaveController = {
    save: () => {},
  } as SaveController;

  public constructor(data: IDeployableData, owner: CombatantData) {
    this.ID = `${data.type || 'deployable'}_${uuid()}`;
    this.ItemData = data;
    this.Base = new Deployable(data);
    this.Owner = owner;
    if (!owner.deployables) owner.deployables = [];
    this._number =
      owner.deployables.filter((d: DeployableInstance) => d.ItemData.id === data.id).length + 1;
    this.name = data.name;
    this.CombatController = new CombatController(this);
    this.FeatureController = new FeatureController(this);
    this.SetStats();
  }

  public get id(): string {
    return this.ID;
  }

  public get Name(): string {
    return (this.name || this.ItemData.name || `Deployable`) + ` #${this._number}`;
  }

  public get StatController() {
    return this.CombatController.StatController;
  }

  private stringEval(val: number | string | undefined): number {
    const ownerController = this.Owner.actor?.CombatController.ActiveActor.CombatController;
    if (!ownerController) {
      console.error('No CombatController found on Deployable owner.');
      return 0;
    }
    if (val === undefined) return 0;
    if (typeof val === 'number') return val;

    // Handle string expressions of format "x operator {key}"
    if (typeof val === 'string') {
      const expression = val.trim();

      // Match pattern: optional number and operator, followed by {key}
      const match = expression.match(
        /^(?:(\d+)\s*([\+\-\*\/\%\*\*\&\|\^\<\>\=]+)\s*)?\{([^}]+)\}$/,
      );

      if (!match) {
        const parsed = parseInt(expression);
        return isNaN(parsed) ? 0 : parsed;
      }

      const [, leftOperand, operator, statKey] = match;
      let rightValue: number;

      if (statKey === 'grit') {
        rightValue = ownerController.Grit || 0;
      } else {
        // Get the stat value from Owner's MaxStats
        const maxStats = ownerController.StatController?.MaxStats;
        rightValue = maxStats?.[statKey];
      }

      if (rightValue === undefined) {
        console.error(`Stat key "${statKey}" not found in MaxStats`);
        return 0;
      }

      // If there's no left operand or operator, just return the stat value
      if (!leftOperand || !operator) {
        return Math.floor(rightValue);
      }

      const leftValue = Number(leftOperand || 0);

      if (rightValue === undefined) {
        console.error(`Stat key "${statKey}" not found in MaxStats`);
        return 0;
      }

      // Safely evaluate the mathematical expression
      try {
        let result: number;
        switch (operator) {
          case '+':
            result = leftValue + rightValue;
            break;
          case '-':
            result = leftValue - rightValue;
            break;
          case '*':
            result = leftValue * rightValue;
            break;
          case '/':
            result = rightValue !== 0 ? leftValue / rightValue : 0;
            break;
          case '%':
            result = rightValue !== 0 ? leftValue % rightValue : 0;
            break;
          case '**':
            result = Math.pow(leftValue, rightValue);
            break;
          default:
            console.warn(`Unsupported operator: ${operator}`);
            return 0;
        }
        return Math.floor(result);
      } catch (error) {
        console.warn(`Invalid mathematical expression: ${leftValue} ${operator} ${rightValue}`);
        return 0;
      }
    }

    return 0;
  }

  public SetStats() {
    let kvps = [
      { key: 'size', val: this.stringEval(this.Base.Size) },
      { key: 'armor', val: this.stringEval(this.Base.Armor) },
      { key: 'save', val: this.stringEval(this.Base.SaveTarget) },
      { key: 'evasion', val: this.stringEval(this.Base.Evasion) || 10 },
      { key: 'speed', val: this.stringEval(this.Base.Speed) },
      { key: 'sensors', val: this.stringEval(this.Base.Sensors) },
      { key: 'edef', val: this.stringEval(this.Base.EDefense) || 8 },
      { key: 'attack', val: this.stringEval(this.Base.AttackBonus) },
      { key: 'tech_attack', val: this.stringEval(this.Base.TechAttack) },
      { key: 'grapple', val: this.stringEval(this.Base.Grapple) },
      { key: 'ram', val: this.stringEval(this.Base.Ram) },
      { key: 'hp', val: this.stringEval(this.Base.MaxHP) || 5 },
      { key: 'heatcap', val: this.stringEval(this.Base.Heatcap) },
      { key: 'saveTarget', val: this.stringEval(this.Base.SaveTarget) },
      { key: 'activations', val: 1 },
    ];

    const ownerStats = (this.Owner.actor as any).CombatController.StatController;
    if (ownerStats) {
      kvps.push({
        key: 'limited_bonus',
        val: ownerStats['limited_bonus'] || 0,
      });
    }

    kvps = kvps.filter((kvp) => !!kvp.val);

    if (this.Base.MaxHP) {
      kvps.push(
        ...[
          { key: 'burn', val: 0 },
          { key: 'overshield', val: 0 },
          { key: 'armor', val: this.Base.Armor || 0 },
        ],
      );
    }

    this.CombatController.setStats(kvps);
  }

  public static Serialize(instance: DeployableInstance): IDeployableInstanceData {
    return {
      name: instance.name,
      data: instance.ItemData,
      id: instance.ID,
    } as IDeployableInstanceData;
  }

  public static Deserialize(d: IDeployableInstanceData, owner: CombatantData): DeployableInstance {
    if (!d.data) throw new Error('Deployable data is missing.');
    const dep = new DeployableInstance(d.data, owner);
    return dep;
  }
}

export { DeployableInstance };
export type { IDeployableData, IDeployableInstanceData };
