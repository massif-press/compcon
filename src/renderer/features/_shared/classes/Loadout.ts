import uid from '@/features/_shared/uid';

const ordArr = ['Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Quinary', 'Senary', 'Septenary', 'Octonary', 'Nonary', 'Denary']

class Loadout {
  private id: string
  private name: string

  constructor(count: number) {
    this.id = uid.generate();
    this.name = `${ordArr[count]} Loadout`;
  }

  public get ID(): string {
    return this.id
  }

  public get Name(): string {
    return this.name
  }

  public set Name(newName: string) {
    this.name = newName
  }

}

export default Loadout;