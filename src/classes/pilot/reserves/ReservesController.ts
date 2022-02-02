import _ from 'lodash'
import { IOrganizationData } from '../../../interface'
import { Pilot } from '../Pilot'
import Organization from './Organization'
import { IReserveData, Reserve } from './Reserve'

interface IReservesSaveData {
  reserves: IReserveData[]
  orgs: IOrganizationData[]
}

class ReservesController {
  public readonly Parent: Pilot

  private _reserves: Reserve[]
  private _orgs: Organization[]

  public constructor(parent: Pilot) {
    this.Parent = parent
    this._reserves = []
    this._orgs = []
  }

  public get Reserves(): Reserve[] {
    return this._reserves
  }

  public set Reserves(reserves: Reserve[]) {
    this._reserves = reserves
    this.Parent.SaveController.save()
  }

  public AddReserve(reserve: Reserve): void {
    this._reserves.push(reserve)
    this.Parent.SaveController.save()
  }

  public RemoveReserve(index: number): void {
    this._reserves.splice(index, 1)
    this.Parent.SaveController.save()
  }

  public get Organizations(): Organization[] {
    return this._orgs
  }

  public set Organizations(orgs: Organization[]) {
    this._orgs = orgs
    this.Parent.SaveController.save()
  }

  public AddOrganization(org: Organization): void {
    this._orgs.push(org)
    this.Parent.SaveController.save()
  }

  public RemoveOrganization(index: number): void {
    this._orgs.splice(index, 1)
    this.Parent.SaveController.save()
  }

  public static Serialize(parent: Pilot, target: any) {
    target.reserves = parent.ReservesController.Reserves.length
      ? parent.ReservesController.Reserves.map(x => Reserve.Serialize(x))
      : []
    target.orgs = parent.ReservesController.Organizations.length
      ? parent.ReservesController.Organizations.map(x => Organization.Serialize(x))
      : []
  }

  public static Deserialize(parent: Pilot, data: IReservesSaveData) {
    if (!parent.ReservesController)
      throw new Error(
        `ReservesController not found on parent (${typeof parent}). New ReservesControllers must be instantiated in the parent's constructor method.`
      )

    parent.ReservesController._reserves = data.reserves
      ? data.reserves.map((x: IReserveData) => Reserve.Deserialize(x))
      : []

    parent.ReservesController._orgs = data.orgs
      ? data.orgs.map((x: IOrganizationData) => Organization.Deserialize(x))
      : []
  }
}

export { IReservesSaveData, ReservesController }
