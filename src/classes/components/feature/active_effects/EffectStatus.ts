import { Status } from '@/classes/Status';
import { CompendiumStore } from '@/stores';
import logger from '@/user/logger';
import { EffectSave } from './EffectSave';

interface IEffectStatusData {
  id: string;
  save?: string | { stat: string; aoe?: boolean };
  aoe?: boolean;
  duration?: string;
  target?: 'self' | 'ally' | 'enemy' | 'any';
}

class EffectStatus {
  private _statusId: string;
  public readonly AoE: boolean;
  public readonly Duration: string;
  public readonly Target: 'self' | 'ally' | 'enemy' | 'any';
  public readonly Save?: EffectSave;

  public constructor(data: IEffectStatusData | string) {
    if (typeof data === 'string') {
      data = { id: data };
    }
    this._statusId = data.id.toLowerCase();
    this.AoE = data.aoe || false;
    this.Duration = data.duration || 'End of Encounter';
    this.Target = data.target || 'any';
    if (data.save) this.Save = new EffectSave(data.save);
  }

  public get Status(): Status {
    const status = CompendiumStore().Statuses.find((s) => s.ID === this._statusId);
    if (!status) {
      logger.error(`Status with ID '${this._statusId}' not found in compendium.`);
      return new Status({
        id: 'unknown',
        name: 'Unknown Status',
        type: 'Status',
        icon: '',
        effects: ['Status data not found!'],
        terse: 'Status data not found!',
      });
    }
    return status;
  }
}

export { EffectStatus };
export type { IEffectStatusData };
