import { NPCSystem } from './NPCSystem';

export interface NPCStatBlock {
  hp: number;
  evade: number;
  edef: number;
  heatcap: number;
  hull: number;
  agility: number;
  systems: number;
  engineering: number;
  armor: number;
  speed: number;
  sensor: number;
  save: number;
  structure?: number;
  stress?: number;
}

export default interface NPCClass {
  name: string;
  role: string;
  info: {
    flavor: string;
    tactics: string;
  };
  stats: NPCStatBlock[];
  size: number[];
}
