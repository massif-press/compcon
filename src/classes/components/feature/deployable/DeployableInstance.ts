import { v4 as uuid } from 'uuid';
import { CombatantData } from '@/classes/encounter/Encounter';
import { SaveController } from '../..';
import { CombatController } from '../../combat/CombatController';
import { Deployable, IDeployableData } from './Deployable';

interface IDeployableInstanceData {
  name: string;
  data: IDeployableData;
}

class DeployableInstance {
  private _number: number;
  public CombatController: CombatController;
  public readonly ItemData: IDeployableData;
  public readonly Base: Deployable;
  public readonly Owner: CombatantData;
  public readonly ID: string = '';
  public name: string;
  public readonly type: string = 'deployable';

  // stubbed, as this is not required
  public SaveController = {
    save: () => {},
  } as SaveController;

  public constructor(data: IDeployableData, owner: CombatantData) {
    this.ID = `${data.type || 'deployable'}_${uuid()}`;
    this.ItemData = data;
    this.Base = new Deployable(data);
    this.Owner = owner;
    this._number =
      owner.deployables.filter((d: DeployableInstance) => d.ItemData.id === data.id).length + 1;
    this.name = data.name;
    this.CombatController = new CombatController(this);
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

  public SetStats() {
    const kvps = [
      { key: 'size', val: this.Base.Size },
      { key: 'armor', val: this.Base.Armor },
      { key: 'save', val: this.Base.SaveTarget },
      { key: 'evasion', val: this.Base.Evasion },
      { key: 'speed', val: this.Base.Speed },
      { key: 'sensors', val: this.Base.Sensors },
      { key: 'edef', val: this.Base.EDefense },
      { key: 'attack', val: this.Base.AttackBonus },
      { key: 'tech_attack', val: this.Base.TechAttack },
      { key: 'grapple', val: this.Base.Grapple },
      { key: 'ram', val: this.Base.Ram },
      { key: 'hp', val: this.Base.MaxHP },
      { key: 'heatcap', val: this.Base.Heatcap },
      { key: 'saveTarget', val: this.Base.SaveTarget },
      { key: 'activations', val: 1 },
      { key: 'burn', val: 0 },
    ];

    const ownerStats = (this.Owner.actor as any).CombatController.StatController;
    if (ownerStats) {
      kvps.push({
        key: 'limited_bonus',
        val: ownerStats['limited_bonus'] || 0,
      });
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
