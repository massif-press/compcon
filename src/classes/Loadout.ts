import { CompendiumStore } from '@/stores';
import { v4 as uuid } from 'uuid';

const ordArr = [
  'Primary',
  'Secondary',
  'Tertiary',
  'Quaternary',
  'Quinary',
  'Senary',
  'Septenary',
  'Octonary',
  'Nonary',
  'Denary',
];

abstract class Loadout {
  private _id: string;
  protected _name: string;

  public constructor(count?: number, id?: string) {
    this._id = id ? id : uuid();
    if (!count) this._name = 'Primary';
    else this._name = ordArr[count];
  }

  protected save(): void {
    // store.dispatch('set_pilot_dirty');
  }

  public get ID(): string {
    return this._id;
  }

  public set ID(id: string) {
    this._id = id;
  }

  public RenewID(): void {
    this._id = uuid();
    this.save();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(newName: string) {
    this._name = newName;
    this.save();
  }
}

export default Loadout;
