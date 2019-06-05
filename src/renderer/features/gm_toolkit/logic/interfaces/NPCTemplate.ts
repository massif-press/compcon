import { NPCStatBlock } from './NPCClass';

export default interface NPCTemplate {
  name: string;
  description: string;
  features: {
    name: string;
    description: string;
  }[];
  traits: {
    name: string;
    effect: string;
  }[];
  statTransform?: (arg: { [key: string]: number }) => { [key: string]: number };
  statCaps?: { [key: string]: number };
  incompatibleTemplates: string[];
}
