import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { IRankedData } from '../../../../interface';
import { Bonus } from '../../../components/feature/bonus/Bonus';
import { Rules } from '../../../utility/Rules';
import { Pilot } from '../../Pilot';
import PilotTalent from './PilotTalent';
import { Talent } from './Talent';
import { CompendiumItem } from '@/class';

interface ITalentsData {
  talents: IRankedData[];
}

class TalentsController implements IFeatureContainer {
  public readonly Parent: Pilot;
  private _talents: PilotTalent[];

  public constructor(parent: Pilot) {
    this.Parent = parent;
    this._talents = [];
  }

  get FeatureSource(): any[] {
    const talents = this.Talents.map((t) => t.Talent);

    let trData = [];
    this.Talents.forEach((t) => {
      let rankData = [];
      t.UnlockedRanks.forEach((r) => {
        if (r.Exclusive) rankData = [r];
        else rankData.push(r);
      });
      trData = [...trData, ...rankData];
    });
    return [...talents, ...trData];
  }

  public get Talents(): PilotTalent[] {
    return this._talents;
  }

  public set Talents(talents: PilotTalent[]) {
    this._talents = talents;
    this.talentSort();
    this.Parent.SaveController.save();
  }

  public get CurrentTalentPoints(): number {
    return this._talents.reduce((sum, talent) => sum + talent.Rank, 0);
  }

  public get MaxTalentPoints(): number {
    return Bonus.Int(Rules.MinimumPilotTalents + this.Parent.Level, 'talent_point', this.Parent);
  }

  public get IsMissingTalents(): boolean {
    return this.CurrentTalentPoints < this.MaxTalentPoints;
  }

  public get HasFullTalents(): boolean {
    return this.CurrentTalentPoints === this.MaxTalentPoints;
  }

  public getTalentRank(id: string): number {
    const index = this._talents.findIndex((x) => x.Talent.ID === id);
    return index > -1 ? this._talents[index].Rank : 0;
  }

  public AddTalent(talent: Talent): void {
    const index = this._talents.findIndex((x) => x.Talent.ID === talent.ID);
    if (index === -1) {
      this._talents.push(new PilotTalent(talent));
    } else {
      this._talents[index].Increment();
    }
    this.talentSort();
    this.updateIntegratedTalents();
    this.Parent.SaveController.save();
  }

  public RemoveTalent(talent: Talent): void {
    const index = this._talents.findIndex((x) => x.Talent.ID === talent.ID);
    if (index === -1) {
      console.error(`Talent "${talent.Name}" does not exist on Pilot ${this.Parent.Callsign}`);
    } else {
      if (this._talents[index].Rank > 1) {
        this._talents[index].Decrement();
      } else {
        this._talents.splice(index, 1);
      }
    }
    this.talentSort();
    this.updateIntegratedTalents();
    this.Parent.SaveController.save();
  }

  public RemovePilotTalent(pTalent: PilotTalent): void {
    const index = this._talents.findIndex(
      (x) => x.Talent.ID === pTalent.Talent.ID || (x.Talent as CompendiumItem).Err
    );
    if (index === -1) {
      console.error(
        `Talent "${pTalent.Talent.Name}" does not exist on Pilot ${this.Parent.Callsign}`
      );
    } else {
      this._talents.splice(index, 1);
    }
  }

  public ClearTalents(): void {
    for (let i = this._talents.length - 1; i >= 0; i--) {
      while (this._talents[i]) {
        this.RemoveTalent(this._talents[i].Talent);
      }
    }
  }

  private talentSort(): void {
    this._talents = this._talents.sort(function (a, b) {
      return a.Rank === b.Rank ? 0 : a.Rank > b.Rank ? -1 : 1;
    });
  }

  private updateIntegratedTalents(): void {
    this.Parent.Mechs.forEach((mech) => {
      mech.MechLoadoutController.UpdateLoadouts();
    });
  }

  public static Serialize(parent: Pilot, target: any) {
    target.talents = parent.TalentsController.Talents.map((x) => PilotTalent.Serialize(x));
  }

  public static Deserialize(parent: Pilot, data: ITalentsData) {
    if (!parent.TalentsController)
      throw new Error(
        `TalentsController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      );

    parent.TalentsController._talents = data.talents.map((x: IRankedData) =>
      PilotTalent.Deserialize(x)
    );
  }
}

export { TalentsController, ITalentsData };
