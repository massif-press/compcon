import { FeatureController } from './FeatureController';
import { ExpressionContext } from '@/classes/utility/ExpressionContext';

interface IFeatureController {
  FeatureController: FeatureController;
  getExpressionContext?(): ExpressionContext;
  getEntityRef?(name: string): IFeatureController | null;
}

type DeployableOwner = {
  FeatureController?: { BonusController?: any };
  CombatController?: { StatController?: { MaxStats?: Record<string, number> } };
  getExpressionContext?(): ExpressionContext;
};

export type { IFeatureController, DeployableOwner };
