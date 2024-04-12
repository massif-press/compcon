import { v4 as uuid } from 'uuid';
import { Encounter } from './Encounter';

interface ISitrepData {
  id?: string;
  name: string;
  description: string;
  conditions?: { title: string; condition: string }[];
  deployment?: string;
  objective?: string;
  controlZone?: string;
  extraction?: string;
}

class Sitrep {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Sitrep';
  public readonly Icon: string = 'mdi-timeline-text-outline';
  public readonly Conditions: { title: string; condition: string }[];
  public readonly Deployment: string;
  public readonly Objective: string;
  public readonly ControlZone: string;
  public readonly Extraction: string;

  constructor(data: ISitrepData, packName?: string) {
    this.ID = data.id
      ? data.id
      : `${packName || 'LANCER Core Book'}_${data.name}`.replace(/ /g, '_');
    this.Name = data.name;
    this.Description = data.description;
    this.LcpName = packName || 'LANCER Core Book';
    this.InLcp = packName ? true : false;

    this.Name = data.name;
    this.Description = data.description;
    this.Conditions = data.conditions || [];
    this.Deployment = data.deployment || '';
    this.Objective = data.objective || '';
    this.ControlZone = data.controlZone || '';
    this.Extraction = data.extraction || '';
  }
}

class SitrepInstance {
  public readonly Sitrep: Sitrep;
  public readonly Parent: Encounter;
  public readonly InstanceID: string;

  private _name: string = 'New Sitrep';
  private _description: string = 'A new Sitrep';
  private _conditions: { title: string; condition: string }[] = [];
  private _deployment: string = '';
  private _objective: string = '';
  private _controlZone: string = '';
  private _extraction: string = '';

  constructor(parent: Encounter, sitrep?: Sitrep) {
    this.Parent = parent;
    this.InstanceID = uuid();
    if (sitrep) {
      this.Sitrep = sitrep;
    } else {
      this.Sitrep = new Sitrep({
        name: 'STANDARD COMBAT',
        description:
          'A simple affair, with two sides facing off against each other until one of them is broken or destroyed.',
      });
    }

    this.setInstanceData();
  }

  private setInstanceData() {
    for (const key in this.Sitrep) {
      if (key === 'Conditions') {
        this._conditions = [...this.Sitrep.Conditions];
      } else {
        this[`_${key.charAt(0).toLowerCase() + key.slice(1)}`] = this.Sitrep[key];
      }
    }
  }

  private save() {
    this.Parent.save();
  }

  public get Name() {
    return this._name;
  }

  public set Name(value: string) {
    this._name = value;
    this.save();
  }

  public get Description() {
    return this._description;
  }

  public set Description(value: string) {
    this._description = value;
    this.save();
  }

  public get Conditions() {
    return this._conditions;
  }

  public set Conditions(value: { title: string; condition: string }[]) {
    this._conditions = value;
    this.save();
  }

  public get Deployment() {
    return this._deployment;
  }

  public set Deployment(value: string) {
    this._deployment = value;
    this.save();
  }

  public get Objective() {
    return this._objective;
  }

  public set Objective(value: string) {
    this._objective = value;
    this.save();
  }

  public get ControlZone() {
    return this._controlZone;
  }

  public set ControlZone(value: string) {
    this._controlZone = value;
    this.save();
  }

  public get Extraction() {
    return this._extraction;
  }

  public set Extraction(value: string) {
    this._extraction = value;
    this.save();
  }

  public Reset() {
    this.setInstanceData();
    this.save();
  }

  public static Serialize(sitrep: SitrepInstance): ISitrepData {
    return {
      id: sitrep.Sitrep.ID,
      name: sitrep.Name,
      description: sitrep.Description,
      deployment: sitrep.Deployment,
      objective: sitrep.Objective,
      controlZone: sitrep.ControlZone,
      extraction: sitrep.Extraction,
      conditions: sitrep.Conditions,
    };
  }

  public static Deserialize(data: ISitrepData, parent: Encounter): SitrepInstance {
    return new SitrepInstance(
      parent,
      new Sitrep({
        id: data.id,
        name: data.name,
        description: data.description,
        deployment: data.deployment,
        objective: data.objective,
        controlZone: data.controlZone,
        extraction: data.extraction,
        conditions: data.conditions,
      })
    );
  }
}

export { Sitrep, SitrepInstance };
export type { ISitrepData };
