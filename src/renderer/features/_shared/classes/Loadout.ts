import uuid from 'uuid/v1'

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
  private id: string
  private name: string

  public constructor(count: number, id?: string) {
    this.id = id ? id : uuid()
    this.name = ordArr[count]
  }

  public get ID(): string {
    return this.id
  }

  public set ID(id: string) {
    this.id = id
  }

  public RenewID() {
    this.id = uuid()
  }

  public get Name(): string {
    return this.name
  }

  public set Name(newName: string) {
    this.name = newName
  }
}

export default Loadout
