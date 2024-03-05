import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { Eidolon } from './Eidolon';
import { NpcFeature } from '../feature/NpcFeature';
import { Bonus } from '@/classes/components';

class EidolonFeatureController implements IFeatureContainer {
  public readonly Parent: Eidolon;

  public constructor(parent: Eidolon) {
    this.Parent = parent;
  }

  get FeatureSource(): any[] {
    return this.Features;
  }

  public get Features(): NpcFeature[] {
    return this.Parent.Layers.flatMap((l) => l.Layer.Features);
  }
}

export { EidolonFeatureController };
