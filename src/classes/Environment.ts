import { v4 as uuid } from 'uuid';
import { Encounter } from './encounter/Encounter';
import { ContentPack } from './ContentPack';

interface IEnvironmentData {
  id?: string;
  modified: boolean;
  name: string;
  description: string;
}

class Environment {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Environment';
  public readonly Icon: string = 'mdi-map';

  public constructor(data: IEnvironmentData, pack?: ContentPack) {
    this.ID = data.id
      ? data.id
      : `${pack?.Name || 'Lancer Core Book'}_${data.name}`.replace(/ /g, '_');
    this.Name = data.name;
    this.Description = data.description;
    this.LcpName = pack?.Name || 'Lancer Core Book';
    this.InLcp = !!pack;
  }
}

class EnvironmentInstance {
  public readonly Parent: Encounter;
  public readonly Environment: Environment;
  public readonly InstanceID: string;

  public _name: string = 'New Environment';
  public _description: string = 'A new Environment';
  public modified: boolean = false;

  public constructor(parent: Encounter, environment?: Environment) {
    this.Parent = parent;
    this.InstanceID = uuid();
    if (environment) {
      this.Environment = environment;
    } else {
      this.Environment = new Environment({
        name: 'Default',
        modified: false,
        description: 'A standard environment with no special combat conditions',
      });
    }

    this.setInstanceData();
  }

  private setInstanceData() {
    this._name = this.Environment.Name;
    this._description = this.Environment.Description;
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
    this.modified = true;
    this.Parent.save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
    this.modified = true;
    this.Parent.save();
  }

  public Reset(): void {
    this.setInstanceData();
    this.modified = true;
    this.Parent.save();
  }

  public static Serialize(env: EnvironmentInstance): IEnvironmentData {
    return {
      name: env.Name,
      modified: env.modified,
      description: env.Description,
    };
  }

  public static Deserialize(data: IEnvironmentData, parent: Encounter): EnvironmentInstance {
    return new EnvironmentInstance(parent, new Environment(data));
  }
}

export { Environment, EnvironmentInstance };
export type { IEnvironmentData };
