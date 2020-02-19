import { store } from '@/store'
import uuid from 'uuid/v4'

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
]

abstract class Loadout {
  private _id: string
  protected _name: string

  public constructor(count: number, id?: string) {
    this._id = id ? id : uuid()
    this._name = ordArr[count]
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get ID(): string {
    return this._id
  }

  public set ID(id: string) {
    this._id = id
    this.save()
  }

  public RenewID(): void {
    this._id = uuid()
    this.save()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(newName: string) {
    this._name = newName
    this.save()
  }
}

export default Loadout
