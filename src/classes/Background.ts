import { Skill } from '@/class';
import { ContentPack } from './ContentPack';
import { CompendiumStore } from '@/stores';

interface IBackgroundData {
  id: string;
  name: string;
  description: string;
  skills?: string[];
}

class Background {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly Skills: String[];
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Background';

  public constructor(data: IBackgroundData, pack?: ContentPack) {
    this.ID = data.id;
    this.Name = data.name;
    this.Description = data.description;
    this.Skills = data.skills ? data.skills : [];
    this.LcpName = pack?.Name || 'Lancer Core Book';
    this.InLcp = !!pack;
  }

  public get Icon(): string {
    return 'cc:orbit';
  }

  public get Terse(): string {
    return this.Description.split('<i>')[0];
  }

  public get SuggestedSkills(): Skill[] {
    let arr = [] as Skill[];
    if (this.Skills)
      arr = this.Skills.map((id) => {
        const item = CompendiumStore().Skills.find((s) => s.ID === id);
        if (item) return item as Skill;
      }) as Skill[];
    return arr.filter((s) => s !== undefined) as Skill[];
  }
}

export { Background };
export type { IBackgroundData };
