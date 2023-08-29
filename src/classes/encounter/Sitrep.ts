import { v4 as uuid } from 'uuid';

interface ISitrepData {
  id?: string;
  name: string;
  description: string;
  deployment?: string;
  objective?: string;
  controlZone?: string;
  extraction?: string;
  noVictory?: string;
  pcVictory?: string;
  enemyVictory?: string;
}

class Sitrep {
  public readonly ID: string;
  public readonly InstanceID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Sitrep';
  public readonly Icon: string = 'mdi-timeline-text-outline';
  public readonly Conditions: { title: string; condition: string }[];
  public readonly Deployment: string;
  public readonly Objective: string;
  public readonly ControlZone: string;
  public readonly Extraction: string;

  constructor(data: ISitrepData, packName?: string) {
    this.ID = data.id
      ? data.id
      : `${packName || 'LANCER Core Book'}_${data.name}`.replace(/ /g, '_');
    this.InstanceID = uuid();
    this.Name = data.name;
    this.Description = data.description;
    this.LcpName = packName || 'LANCER Core Book';
    this.InLcp = packName ? true : false;

    this.Name = data.name;
    this.Description = data.description;
    this.Conditions = [];
    if (data.pcVictory) this.Conditions.push({ title: 'PC Victory', condition: data.pcVictory });
    if (data.enemyVictory)
      this.Conditions.push({ title: 'Enemy Victory', condition: data.enemyVictory });
    if (data.noVictory) this.Conditions.push({ title: 'Stalemate', condition: data.noVictory });
    this.Deployment = data.deployment || '';
    this.Objective = data.objective || '';
    this.ControlZone = data.controlZone || '';
    this.Extraction = data.extraction || '';
  }
}

export { Sitrep };
export type { ISitrepData };
