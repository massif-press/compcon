import { FeatureController } from './FeatureController';
import { ExpressionContext } from '@/classes/utility/ExpressionContext';

interface IFeatureController {
  FeatureController: FeatureController;
  getExpressionContext?(): ExpressionContext;
  getEntityRef?(name: string): IFeatureController | null;
}

export type { IFeatureController };
