import { IFeatureContainer } from './IFeatureContainer'
import { FeatureCollector } from './FeatureCollector'
import { IFeatureController } from './IFeatureController'
import { Bonus } from './bonus/Bonus'
import { Synergy } from '@/classes/components/feature/synergy/Synergy'
import { Action } from '@/classes/Action'
import { IDeployableData } from '@/classes/components/feature/deployable/Deployable'
import { ICounterData } from '../counters/Counter'
import { MechWeapon } from '@/classes/mech/MechWeapon'
import { MechSystem } from '@/classes/mech/MechSystem'
import { CompendiumItem } from '@/classes/CompendiumItem'

class FeatureController {
  public readonly Parent: IFeatureController
  public Containers: IFeatureContainer[]

  public constructor(parent: IFeatureController) {
    this.Parent = parent
    this.Containers = []
  }

  public Register(...containers: IFeatureContainer[]) {
    this.Containers = containers
  }

  private collectAll<T>(collection: string): T[] {
    if (!this.Containers.length) {
      throw new Error('FeatureControllers not registered!')
    }
    return this.Containers.flatMap(container => {
      return FeatureCollector.Collect(collection, container.FeatureSource)
    })
  }

  private getRootEntity(node: object): object {
    if (node.hasOwnProperty('Parent')) return this.getRootEntity((node as any).Parent)
    return node
  }

  public getRootProperty<T>(prop: string): T {
    const root = this.getRootEntity(this)
    if (root.hasOwnProperty(prop)) return (root as any)[prop]
    return null
  }

  public get Bonuses(): Bonus[] {
    // console.log(this.BonusController.Bonuses)
    return this.collectAll('Bonuses')
  }

  public get Synergies(): Synergy[] {
    return this.collectAll('Synergies')
  }

  public get Actions(): Action[] {
    return this.collectAll('Actions')
  }

  public get Deployables(): IDeployableData[] {
    return this.collectAll('Deployables')
  }

  public get Counters(): ICounterData[] {
    let counters: ICounterData[] = this.collectAll('Counters')
    // if (this.ActiveMech) counters = counters.concat(this.ActiveMech.CountersOnlyMech)
    return counters
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this.collectAll('IntegratedWeapons')
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.collectAll('IntegratedSystems')
  }

  public get IntegratedSpecialEquipment(): CompendiumItem[] {
    return this.collectAll('SpecialEquipment')
  }
}

export { FeatureController }
