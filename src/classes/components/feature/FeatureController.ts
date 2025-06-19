import { IFeatureContainer } from './IFeatureContainer';
import { FeatureCollector } from './FeatureCollector';
import { IFeatureController } from './IFeatureController';
import { Bonus } from './bonus/Bonus';
import { Synergy } from '@/classes/components/feature/synergy/Synergy';
import { Action } from '@/classes/Action';
import { IDeployableData } from '@/classes/components/feature/deployable/Deployable';
import { CompendiumItem } from '@/classes/CompendiumItem';
import { MechWeapon, MechSystem, Counter } from '@/class';

class FeatureController {
  public readonly Parent: IFeatureController;
  public Containers: IFeatureContainer[];

  public constructor(parent: IFeatureController) {
    this.Parent = parent;
    this.Containers = [];
  }

  public Register(...containers: IFeatureContainer[]) {
    this.Containers = containers;
  }

  private collectAll<T>(collection: string): T[] {
    if (!this.Containers.length) {
      throw new Error('FeatureControllers not registered!');
    }

    return this.Containers.flatMap((container) =>
      FeatureCollector.Collect(collection, container.FeatureSource)
    );
  }

  private getRootEntity(node: object): object {
    if (node['Parent'] !== undefined)
      return this.getRootEntity((node as any).Parent);
    return node;
  }

  public getRootProperty<T>(prop: string): T | null {
    const root = this.getRootEntity(this);
    if (root[prop] !== undefined) return (root as any)[prop];
    return null;
  }

  public get Bonuses(): Bonus[] {
    return this.collectAll('Bonuses');
  }

  public get Synergies(): Synergy[] {
    return this.collectAll('Synergies');
  }

  public get Actions(): Action[] {
    return this.collectAll('Actions');
  }

  public get Deployables(): IDeployableData[] {
    return this.collectAll('Deployables');
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this.collectAll('IntegratedWeapons');
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.collectAll('IntegratedSystems');
  }

  public get IntegratedSpecialEquipment(): CompendiumItem[] {
    return this.collectAll('SpecialEquipment');
  }

  public get Counters(): Counter[] {
    return this.collectAll('Counters');
  }

  public get AllItems(): CompendiumItem[] {
    return this.Containers.flatMap((container) => container.FeatureSource).map(
      (item) => item
    );
  }
}

export { FeatureController };
