import { IStateController } from './IStateController'
import { MechInstance } from './MechInstance'
import { PilotInstance } from './PilotInstance'

class PlayerStateController implements IStateController {
  public PilotInstance: PilotInstance
  public MechInstance: MechInstance
  public PilotMounted: Boolean

  public get ActiveInstance() {
    return this.PilotMounted ? MechInstance : PilotInstance
  }
}
