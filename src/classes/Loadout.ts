import { store } from '@/store'
import uuid from 'uuid/v4'
import { ISaveable } from './components'

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
  protected Parent: ISaveable
  protected _name: string

  public constructor(parent: ISaveable, count?: number, id?: string) {
    this.Parent = parent
    this._id = id ? id : uuid()
    if (!count) this._name = 'Primary'
    else this._name = ordArr[count]
  }

  protected save(): void {
    this.Parent.SaveController.save()
  }

  public get ID(): string {
    return this._id
  }

  public set ID(id: string) {
    this._id = id
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
