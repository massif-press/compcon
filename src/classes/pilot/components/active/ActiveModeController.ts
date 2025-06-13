// holds active loadouts, mechs, stats
// gets saved into encounter data
// creates report data

import { Mech, MechLoadout, Pilot, PilotLoadout } from '@/class';
import { StatController } from '@/classes/components/combat/stats/StatController';

class ActiveModeController {
  public readonly Parent: Pilot;
  public ActiveMech: Mech | null = null;
  public Mounted: boolean = false;
  // public PilotStats: StatController;

  constructor(parent: Pilot, mech: Mech | null = null) {
    this.Parent = parent;
    this.ActiveMech = mech;
    // this.PilotStats = new StatController(this._pilotStatProxy);
    // this.MechStats = mech ? new StatController(mech) : null;
  }

  public get MechLoadout(): MechLoadout | null {
    return this.ActiveMech ? this.ActiveMech.MechLoadoutController.ActiveLoadout : null;
  }

  public get PilotLoadout(): PilotLoadout {
    return this.Parent.PilotLoadoutController.ActiveLoadout;
  }
}
