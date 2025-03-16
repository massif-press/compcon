import { CompendiumStore } from '../../../../stores';
import { CompendiumItem, SkillFamily, ItemType, ContentPack } from '../../../../class';
import { ICompendiumItemData } from '../../../../interface';

interface ISkillData extends ICompendiumItemData {
  detail: string;
  family: string;
}

class Skill extends CompendiumItem {
  public readonly Detail: string;
  public readonly Family: SkillFamily;

  public constructor(data: ISkillData, pack?: ContentPack) {
    super(data, pack);
    this.Detail = data.detail;
    this.Family = SkillFamily[data.family] as SkillFamily;
    this.ItemType = ItemType.Skill;
  }

  public get Trigger(): string {
    return this._name;
  }

  public get Color(): string {
    return 'skill';
  }

  public static Deserialize(id: string): Skill {
    return CompendiumStore().referenceByID('Skills', id);
  }
}

export { Skill };
export type { ISkillData };
