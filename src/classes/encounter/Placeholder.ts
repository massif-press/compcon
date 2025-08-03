import { SaveController } from '../components/save/SaveController';

interface IPlaceholderData {
  id: string;
  name: string;
  mechname?: string;
  type: string; // 'pilot' | 'npc' | 'other'
  side: string; // 'ally' | 'enemy'
}

class Placeholder {
  public ID: string;
  public Name: string;
  public Side: string = 'ally'; // Default side
  public Mechname?: string;
  public PlaceholderType: string;
  public SaveController: SaveController;
  public readonly ItemType: string = 'Placeholder';
  public readonly StorageType: string = 'none';

  constructor(data: IPlaceholderData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Side = data.side;
    this.Mechname = data.mechname;
    this.PlaceholderType = data.type;
    this.SaveController = new SaveController(this);
  }

  public SetStats(): void {
    // TODO
  }

  public Serialize(): IPlaceholderData {
    return {
      id: this.ID,
      name: this.Name,
      mechname: this.Mechname,
      type: this.PlaceholderType,
      side: this.Side,
    };
  }

  public static Deserialize(data: IPlaceholderData): Placeholder {
    if (!data || !data.id) {
      throw new Error('Invalid Placeholder data');
    }
    return new Placeholder({
      id: data.id,
      name: data.name,
      mechname: data.mechname,
      type: data.type,
      side: data.side,
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
