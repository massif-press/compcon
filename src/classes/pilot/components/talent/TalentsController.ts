import type { IControllerStatic } from '@/classes/ISerializable'
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer'
import { Bonus, BonusId } from '../../../components/feature/bonus/Bonus'
import { Rules } from '../../../utility/Rules'
import { Pilot } from '../../Pilot'
import PilotTalent from './PilotTalent'
import { Talent, TalentRank } from './Talent'
import { CompendiumItem } from '../../../CompendiumItem'
import logger from '@/user/logger'
import { CompendiumStore } from '@/features/compendium/store'
import { IRankedData } from '../license/License'
import { assertController } from '../../../utility/assertController'
import { RankedCollectionController } from '../RankedCollectionController'

interface ITalentsData {
  talents: IRankedData[]
}

class TalentsController
  extends RankedCollectionController<Talent, PilotTalent>
  implements IFeatureContainer
{
  protected _findIndex(raw: Talent): number {
    return this._collection.findIndex(x => x.Talent.ID === raw.ID)
  }

  protected _createWrapper(raw: Talent): PilotTalent {
    return new PilotTalent(raw)
  }

  protected _getRaw(wrapper: PilotTalent): Talent {
    return wrapper.Talent
  }

  protected _sort(): void {
    this._collection = this._collection.sort((a, b) =>
      a.Rank === b.Rank ? 0 : a.Rank > b.Rank ? -1 : 1
    )
  }

  protected _afterAdd(_raw: Talent): void {
    this.updateIntegratedTalents()
  }

  protected _afterRemove(_raw: Talent): void {
    this.updateIntegratedTalents()
  }

  public get MaxPoints(): number {
    return Bonus.Int(
      Rules.MinimumPilotTalents + this.Parent.Level,
      BonusId.TALENT_POINT,
      this.Parent
    )
  }

  get FeatureSource(): any[] {
    const talents = this.Talents.map(t => t.Talent)

    let trData = [] as TalentRank[]
    this.Talents.forEach(t => {
      let rankData = [] as TalentRank[]
      t.UnlockedRanks.forEach(r => {
        if (r.Exclusive) rankData = [r]
        else rankData.push(r)
      })
      trData = [...trData, ...rankData]
    })
    return [...talents, ...trData]
  }

  public get Talents(): PilotTalent[] {
    return this._collection
  }

  public get MissingTalents(): Talent[] {
    return this._collection
      .filter(x => !CompendiumStore().has('Talents', x.Talent.ID))
      .map(t => t.Talent)
  }

  public set Talents(talents: PilotTalent[]) {
    this._collection = talents
    this._sort()
    this.Parent.SaveController.save()
  }

  public get CurrentTalentPoints(): number {
    return this.CurrentPoints
  }

  public get MaxTalentPoints(): number {
    return this.MaxPoints
  }

  public get HasFullTalents(): boolean {
    return this.HasFull
  }

  public getTalentRank(id: string): number {
    const index = this._collection.findIndex(x => x.Talent.ID === id)
    return index > -1 ? this._collection[index].Rank : 0
  }

  public AddTalent(talent: Talent): void {
    this._addItem(talent)
  }

  public RemoveTalent(talent: Talent): void {
    if (this._findIndex(talent) === -1) {
      logger.error(`Talent "${talent.Name}" does not exist on Pilot ${this.Parent.Callsign}`, this)
    }
    this._removeItem(talent)
  }

  public RemovePilotTalent(pTalent: PilotTalent): void {
    const index = this._collection.findIndex(
      x => x.Talent.ID === pTalent.Talent.ID || (x.Talent as CompendiumItem).Err
    )
    if (index === -1) {
      logger.error(
        `Talent "${pTalent.Talent.Name}" does not exist on Pilot ${this.Parent.Callsign}`,
        this
      )
    } else {
      this._collection.splice(index, 1)
    }
  }

  public ClearTalents(): void {
    this._clearCollection()
  }

  private updateIntegratedTalents(): void {
    this.Parent.Mechs.forEach(mech => {
      mech.MechLoadoutController.UpdateLoadouts()
    })
  }

  public static Serialize(parent: Pilot, target: any) {
    target.talents = parent.TalentsController.Talents.map(x => PilotTalent.Serialize(x))
  }

  public static Deserialize(parent: Pilot, data: ITalentsData) {
    assertController(parent.TalentsController, 'TalentsController')
    parent.TalentsController._collection = data.talents.map((x: IRankedData) =>
      PilotTalent.Deserialize(x)
    )
  }
}

const _checkController: IControllerStatic<Pilot, ITalentsData> = TalentsController
export { TalentsController }
export type { ITalentsData }
