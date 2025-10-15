import { IFeatureContainer } from './IFeatureContainer';
import { FeatureCollector } from './FeatureCollector';
import { IFeatureController } from './IFeatureController';
import { Bonus } from './bonus/Bonus';
import { Synergy } from '@/classes/components/feature/synergy/Synergy';
import { Action } from '@/classes/Action';
import { IDeployableData } from '@/classes/components/feature/deployable/Deployable';
import { CompendiumItem } from '@/classes/CompendiumItem';
import { MechWeapon, MechSystem, Counter } from '@/class';

const strDict = [
  { key: 'll', prop: 'Level', text: 'Pilot License Level' },
  { key: 'tier', prop: 'Tier', text: 'NPC Tier' },
  { key: 'grit', prop: 'Grit', text: 'Pilot Grid' },
  { key: 'hull', prop: 'Hull', text: 'Hull' },
  { key: 'agi', prop: 'Agi', text: 'Agility' },
  { key: 'sys', prop: 'Sys', text: 'Systems' },
  { key: 'eng', prop: 'Eng', text: 'Engineering' },
  { key: 'size', prop: 'Size', text: 'Size' },
  { key: 'structure', prop: 'Structure', text: 'Maximum Structure' },
  { key: 'stress', prop: 'Stress', text: 'Maximum Reactor Stress' },
  { key: 'armor', prop: 'Armor', text: 'Armor' },
  { key: 'hp', prop: 'HP', text: 'Maximum HP' },
  { key: 'current_structure', prop: 'CurrentStructure', text: 'Current Structure' },
  { key: 'current_stress', prop: 'CurrentStress', text: 'Current Reactor Stress' },
  { key: 'current_hp', prop: 'CurrentHp', text: 'Current HP' },
  { key: 'overshield', prop: 'Overshield', text: 'Overshield' },
  { key: 'speed', prop: 'Speed', text: 'Speed' },
  { key: 'evasion', prop: 'Evasion', text: 'Evasion' },
  { key: 'edef', prop: 'Edef', text: 'E-Defense' },
  { key: 'heatcap', prop: 'Heatcap', text: 'Heat Capacity' },
  { key: 'sensors', prop: 'Sensors', text: 'Sensor Range' },
  { key: 'repcap', prop: 'Repcap', text: 'Repair Capacity' },
  { key: 'save', prop: 'Save', text: 'Save' },
  { key: 'sp', prop: 'SP', text: 'System Points' },
];

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
    if (node['Parent'] !== undefined) return this.getRootEntity((node as any).Parent);
    return node;
  }

  public getRootProperty<T>(prop: string): T | null {
    const root = this.getRootEntity(this);
    if (root[prop] !== undefined) return (root as any)[prop];
    return null;
  }

  public static RenderSpecialString(str: string): string {
    let vStr = str;
    strDict.forEach((p) => (vStr = vStr.replace(new RegExp(`{${p.key}}`, 'g'), p.text)));
    return vStr;
  }

  public EvaluateSpecial(str: string, returnString = false): string | number {
    let vStr = str;
    strDict.forEach(
      (p) =>
        (vStr = vStr
          .replace(`_`, '')
          .replace(new RegExp(`{${p.key}}`, 'g'), this.getRootProperty(p.prop)?.toString() || '0'))
    );

    vStr = vStr.replace(/[^-()\d/*+.]/g, '');

    if (returnString) return vStr as string;

    return Math.ceil(eval(vStr));
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
    return this.Containers.flatMap((container) => container.FeatureSource).map((item) => item);
  }
}

export { FeatureController };
