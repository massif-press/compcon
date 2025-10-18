import _ from 'lodash';
import { coerce, gte } from 'semver';
import { IBrewable } from './IBrewable';
import { CompendiumStore } from '@/stores';
import logger from '@/user/logger';

interface IBrewData {
  brews: BrewInfo[];
}

type BrewInfo = {
  LcpId: string;
  LcpName: string;
  LcpVersion: string;
  Website: string;
  Status: 'OK' | 'OLD' | 'MISSING' | 'OFF' | 'ERR';
};

class BrewController {
  public readonly Parent: IBrewable;
  private _savedBrewData: BrewInfo[] = [];
  public MissingContent: boolean = false;

  public constructor(parent: IBrewable) {
    this.Parent = parent;
  }

  public get Brews(): BrewInfo[] {
    let out = [] as BrewInfo[];
    if (!this.Parent.BrewableCollection.length) return out;

    out = this.Parent.BrewableCollection.filter((x) => x && x.InLcp).map((item) => item.Brew);

    this._savedBrewData.forEach((pack) => {
      if (!out.some((x) => x.LcpId === pack.LcpId)) out.push(pack);
    });

    out = out.filter((brew) => !!brew.LcpId && brew.LcpName !== 'Lancer Core Book');

    out.forEach((brew) => {
      const p = CompendiumStore().ContentPacks.find((x) => x.ID === brew.LcpId);
      if (!p) {
        brew.Status = 'MISSING';
        return;
      }
      if (!p.Active) {
        brew.Status = 'OFF';
        return;
      }

      try {
        const compVer = gte(coerce(p.Version), coerce(brew.LcpVersion));
        brew.Status = compVer ? 'OK' : 'OLD';
      } catch (e) {
        logger.error(
          `Error comparing versions for ${brew.LcpName}. Version string ${brew.LcpVersion} may break semver`,
          this,
          e
        );
        brew.Status = 'ERR';
      }
    });

    return _.uniqBy(out, 'LcpId');
  }

  get HasError(): boolean {
    return (
      this.MissingContent ||
      this.MissingBrews.length + this.OutdatedBrews.length + this.DeactivatedBrews.length > 0
    );
  }

  get IsUnableToLoad(): boolean {
    return this.MissingContent || this.MissingBrews.length + this.DeactivatedBrews.length > 0;
  }

  get DeactivatedBrews(): BrewInfo[] {
    return this.Brews.filter((x) => x.Status === 'OFF');
  }

  get MissingBrews(): BrewInfo[] {
    return this.Brews.filter((x) => x.Status === 'MISSING');
  }

  get OutdatedBrews(): BrewInfo[] {
    return this.Brews.filter((x) => x.Status === 'OLD');
  }

  get NonfunctionalBrews(): BrewInfo[] {
    return this.Brews.filter((x) => x.Status === 'MISSING' || x.Status === 'OFF');
  }

  get OtherError(): boolean {
    return (
      this.MissingContent &&
      this.MissingBrews.length + this.DeactivatedBrews.length + this.OutdatedBrews.length === 0
    );
  }

  public FixMissing() {
    this._savedBrewData = [];
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: IBrewable, target: any) {
    target.brews = [...parent.BrewController.Brews];
    target.brews.forEach((b) => {
      b.Status = 'MISSING';
    });
  }

  public static Deserialize(parent: IBrewable, data: IBrewData) {
    if (!parent.BrewController)
      throw new Error(
        `BrewController not found on parent (${typeof parent}). New BrewControllers must be instantiated in the parent's constructor method.`
      );

    parent.BrewController._savedBrewData = data.brews;
  }
}
export { BrewController };
export type { IBrewData, BrewInfo };
