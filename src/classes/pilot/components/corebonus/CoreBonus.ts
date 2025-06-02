import { CompendiumItem, ContentPack, ItemType, Manufacturer } from '../../../../class';
import { CompendiumStore } from '../../../../stores';
import {
  ICompendiumItemData,
  IContentPack,
  ICounterData,
  ITagCompendiumData,
} from '../../../../interface';
import { IActionData } from '../../../Action';
import { IBonusData } from '../../../components/feature/bonus/Bonus';
import { ISynergyData } from '../../../components/feature/synergy/Synergy';
import { IDeployableData } from '../../../components/feature/deployable/Deployable';

interface ICoreBonusData extends ICompendiumItemData {
  source: string;
  effect: string | any;
  mounted_effect?: string;
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  integrated?: string[];
  special_equipment?: string[];
  counters?: ICounterData[];
}

class CoreBonus extends CompendiumItem {
  public readonly Source: string;
  public readonly Effect: string;
  public readonly MountedEffect: string;

  public constructor(data?: ICoreBonusData, pack?: ContentPack) {
    super(data, pack);
    this.ItemType = ItemType.CoreBonus;
    this.Source = data?.source || '';
    // todo: effectobject constructor
    this.Effect = data?.effect
      ? typeof data.effect === 'string'
        ? data.effect
        : data.effect.description
      : '';
    this.MountedEffect = data?.mounted_effect || '';
  }

  public get Manufacturer(): Manufacturer {
    return CompendiumStore().referenceByID('Manufacturers', this.Source);
  }

  public get IsMountable(): boolean {
    return !!this.MountedEffect;
  }
}

export { CoreBonus };
export type { ICoreBonusData };
