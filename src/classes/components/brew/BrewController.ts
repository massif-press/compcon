import _ from 'lodash';
import { IBrewable } from './IBrewable';
import { CompendiumStore } from '@/stores';
import { ContentPack } from '@/class';

interface IBrewData {
  brews: BrewInfo[];
}

type BrewInfo = {
  LcpId: string;
  LcpName: string;
  LcpVersion: string;
  Website: string;
};

class BrewController {
  public readonly Parent: IBrewable;
  public Brews: BrewInfo[];

  public constructor(parent: IBrewable) {
    this.Parent = parent;
    this.Brews = [];
  }

  public SetBrewData(): void {
    if (!this.Parent.BrewableCollection.length) return;

    const packs = CompendiumStore().getItemCollection(
      'ContentPacks'
    ) as ContentPack[];

    this.Brews = this.Parent.BrewableCollection.filter(
      (item) => item.Brew && item.Brew.toLowerCase() !== 'core'
    )
      .map((item) => packs.find((p) => p.ID === item.Brew))
      .filter((p) => !!p)
      .map((pack) => ({
        LcpId: pack.ID,
        LcpName: pack.Name || 'ERR',
        LcpVersion: pack.Version || '',
        Website: pack.Website || '',
      }))
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.LcpId === value.LcpId)
      );
  }

  public static Serialize(parent: IBrewable, target: any) {
    parent.BrewController.SetBrewData();
    target.brews = parent.BrewController.Brews;
  }

  public static Deserialize(parent: IBrewable, data: IBrewData) {
    if (!parent.BrewController)
      throw new Error(
        `BrewController not found on parent (${typeof parent}). New BrewControllers must be instantiated in the parent's constructor method.`
      );

    parent.BrewController.Brews = data.brews;
  }
}
export { IBrewData, BrewInfo, BrewController };
