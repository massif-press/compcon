import { CompendiumItem, ItemType, Manufacturer } from '../../../../class';
import { CompendiumStore } from '../../../../stores';
import { ICompendiumItemData, ICounterData, ITagCompendiumData } from '../../../../interface';
import { IActionData } from '../../../Action';
import { IBonusData } from '../../../components/feature/bonus/Bonus';
import { ISynergyData } from '../../../components/feature/synergy/Synergy';
import { IDeployableData } from '../../../components/feature/deployable/Deployable';

interface ICoreBonusData extends ICompendiumItemData {
  source: string;
  effect: string;
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

  public constructor(data?: ICoreBonusData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName);
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

  public static Deserialize(id: string): CoreBonus {
    return CompendiumStore().referenceByID('CoreBonuses', id);
  }
}

export { CoreBonus };
export type { ICoreBonusData };
