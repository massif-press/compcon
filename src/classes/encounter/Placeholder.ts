import { CombatController } from '../components/combat/CombatController';
import { SaveController } from '../components/save/SaveController';

interface IPlaceholderData {
  id: string;
  name: string;
  Mechname?: string;
  type: string; // 'pilot' | 'npc' | 'other'
  side: string; // 'ally' | 'enemy'
  notes?: string;
}

class Placeholder {
  public ID: string;
  public Name: string;
  public Side: string = 'ally'; // Default side
  public Mechname?: string;
  public Notes?: string;
  public PlaceholderType: string;
  public SaveController: SaveController;
  public CombatController: CombatController;
  public readonly ItemType: string = 'Placeholder';
  public readonly StorageType: string = 'none';
  public readonly Placeholder = true;
  public Deployables: any = [];

  public ActiveMech?: Placeholder;

  constructor(data: IPlaceholderData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Side = data.side;
    this.Mechname = data.Mechname;
    this.Notes = data.notes;
    this.PlaceholderType = data.type;
    this.SaveController = new SaveController(this);
    this.CombatController = new CombatController(this);

    if (this.PlaceholderType === 'pilot') {
      this.ActiveMech = new Placeholder({
        id: this.ID + '_activeMech',
        name: this.Mechname || 'Mech',
        type: 'mech',
        side: this.Side,
      });
    }
  }

  public SetStats(): void {
    // TODO
  }

  public get StatController(): any {
    return this.CombatController.StatController;
  }

  public Serialize(): IPlaceholderData {
    return {
      id: this.ID,
      name: this.Name,
      Mechname: this.Mechname,
      type: this.PlaceholderType,
      side: this.Side,
      notes: this.Notes,
    };
  }

  public static Deserialize(data: IPlaceholderData): Placeholder {
    if (!data || !data.id) {
      throw new Error('Invalid Placeholder data');
    }
    return new Placeholder({
      id: data.id,
      name: data.name,
      Mechname: data.Mechname,
      type: data.type,
      side: data.side,
      notes: data.notes,
    });
  }

  public save(): void {
    this.SaveController.save();
  }

  public Clone(): Placeholder {
    return Placeholder.Deserialize(this.Serialize());
  }
}
export { Placeholder };
export type { IPlaceholderData };
