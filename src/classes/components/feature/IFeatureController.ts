import { FeatureController } from './FeatureController';

interface IFeatureController {
  FeatureController: FeatureController;
  getExpressionContext?(): Record<string, number>;
  getEntityRef?(name: string): IFeatureController | null;
}

export type { IFeatureController };
