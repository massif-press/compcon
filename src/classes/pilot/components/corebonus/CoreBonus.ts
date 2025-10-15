import { CompendiumItem, ContentPack, ItemType, Manufacturer } from '../../../../class';
import { CompendiumStore } from '../../../../stores';
import { ICompendiumItemData } from '../../../../interface';

interface ICoreBonusData extends ICompendiumItemData {
  source: string;
  effect: string | any;
  mounted_effect?: string;
}

class CoreBonus extends CompendiumItem {
  public readonly Source: string;
  public readonly Effect: string;
  public readonly MountedEffect: string;

  public constructor(data?: ICoreBonusData, pack?: ContentPack) {
    super(data, pack);
    this.ItemType = ItemType.CoreBonus;
    this.Source = data?.source || '';
    this.Effect = data?.effect || '';
    this.MountedEffect = data?.mounted_effect || '';
  }

  public get Manufacturer(): Manufacturer {
    return CompendiumStore().referenceByID('Manufacturers', this.Source);
  }

  public get IsMountable(): boolean {
    return !!this.MountedEffect;
  }

  public static Deserialize(data: ICoreBonusData, pack?: ContentPack): CoreBonus {
    return new CoreBonus(data, pack);
  }
}

export { CoreBonus };
export type { ICoreBonusData };
