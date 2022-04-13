import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer'
import { Pilot } from '../../Pilot'
import PilotLoadout from './PilotLoadout'

interface IPilotLoadoutSaveData {
  loadout: IPilotLoadoutData
}

class PilotLoadoutController implements IFeatureContainer {
  public readonly Parent: Pilot
  private _loadout: PilotLoadout

  constructor(parent: Pilot) {
    this.Parent = parent
    this._loadout = new PilotLoadout()
  }

  public get FeatureSource(): any[] {
    return this.Loadout.Items.filter(i => !!i)
  }

  public get Loadout(): PilotLoadout {
    return this._loadout
  }

  public set Loadout(l: PilotLoadout) {
    this._loadout = l
    this.Parent.SaveController.save()
  }

  public static Serialize(parent: Pilot, target: any) {
    target.loadout = PilotLoadout.Serialize(parent.PilotLoadoutController.Loadout)
  }

  public static Deserialize(parent: Pilot, data: IPilotLoadoutSaveData) {
    if (!parent.PilotLoadoutController)
      throw new Error(
        `PilotLoadoutController not found on parent (${typeof parent}). New PilotLoadoutControllers must be instantiated in the parent's constructor method.`
      )

    parent.PilotLoadoutController._loadout = data.loadout
      ? PilotLoadout.Deserialize(data.loadout)
      : new PilotLoadout()
  }
}

export { PilotLoadoutController, IPilotLoadoutSaveData }
