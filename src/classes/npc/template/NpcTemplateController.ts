import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { NpcTemplate } from './NpcTemplate';
import { NpcClass } from '../class/NpcClass';

interface INpcTemplateSaveData {
  templates: { id: string; data: any }[];
}

type FeatureRequirement = {
  source: string;
  source_id: string;
  min: number;
  max: number;
  optionalMin: number;
  optionalMax: number;
  selected: number;
  complete: boolean;
  optional_complete: boolean;
};

class NpcTemplateController {
  public readonly Parent: Unit;
  private _templates: NpcTemplate[];

  public constructor(parent: Unit) {
    this.Parent = parent;
    this._templates = [] as NpcTemplate[];
  }

  public get Templates(): NpcTemplate[] {
    return this._templates;
  }

  public set Templates(temps: NpcTemplate[]) {
    this._templates = temps;
    this.Parent.save();
  }

  public AddTemplate(temp: NpcTemplate): void {
    this._templates.push(temp);
    if (temp.ForceTag) this.Parent.Tag = temp.ForceTag;
    temp.BaseFeatures.forEach((f) => this.Parent.NpcFeatureController.AddFeature(f));
    this.Parent.save();
  }

  public RemoveTemplate(temp: NpcTemplate): void {
    const idx = this._templates.findIndex((x) => x.ID === temp.ID);
    if (idx > -1) {
      this._templates.splice(idx, 1);
      temp.BaseFeatures.forEach((f) => this.Parent.NpcFeatureController.RemoveFeature(f));
      temp.OptionalFeatures.forEach((f) => this.Parent.NpcFeatureController.RemoveFeature(f));
    }
    this.Parent.save();
  }

  public get TemplateFeaturesCount(): {
    template: NpcTemplate;
    required: number;
    allowed: number;
  }[] {
    const out = [] as { template: NpcTemplate; required: number; allowed: number }[];

    if (!this.Parent.NpcClassController.Class) return out;

    this.Templates.forEach((template) => {
      const t = template as NpcTemplate;
      let required = 0;
      let allowed = 0;
      if (t.OptionalMin || t.OptionalMax) {
        required = t.OptionalMax
          ? t.OptionalMin * (t.OptionalPerTier ? this.Parent.NpcClassController.Tier : 1)
          : 0;
        allowed = !t.OptionalMax
          ? t.OptionalMax * (t.OptionalPerTier ? this.Parent.NpcClassController.Tier : 1)
          : 0;
      }
      out.push({
        template: t,
        required,
        allowed,
      });
    });
    return out;
  }

  public get FeatureRequirements(): FeatureRequirement[] {
    const out = [] as FeatureRequirement[];

    if (!this.Parent.NpcClassController.Class) return out;

    const c = this.Parent.NpcClassController.Class as NpcClass;

    const classReq = {
      source: c.Name || '',
      source_id: c.ID,
      min: 0,
      max: 0,
      optionalMin: c.OptionalClassMin || 0,
      optionalMax: c.OptionalClassMax || 2,
      selected: this.Parent.NpcFeatureController.Features.filter(
        (x) => !x.Base && x.Origin.ID === c.ID
      ).length,
      complete: false,
      optional_complete: false,
    };

    this.Templates.forEach((template) => {
      const t = template as NpcTemplate;
      const req = {
        source: t.Name,
        source_id: t.ID,
        min: t.OptionalMin,
        max: t.OptionalMax,
        optionalMin: t.OptionalMin,
        optionalMax: t.OptionalMax,
        selected: this.Parent.NpcFeatureController.Features.filter(
          (x) => !x.Base && x.Origin.ID === t.ID
        ).length,
        complete: false,
        optional_complete: false,
      };

      classReq.optionalMin += t.OptionalClassMin || 0;
      classReq.optionalMax += t.OptionalClassMax || 0;

      if (t.OptionalPerTier) {
        req.min += t.OptionalPerTier * this.Parent.NpcClassController.Tier;
        req.max += t.OptionalPerTier * this.Parent.NpcClassController.Tier;
      }

      if (t.OptionalClassPerTier) {
        classReq.optionalMin += t.OptionalClassPerTier * this.Parent.NpcClassController.Tier;
        classReq.optionalMax += t.OptionalClassPerTier * this.Parent.NpcClassController.Tier;
      }
      req.complete = req.selected >= req.min;
      req.optional_complete = !req.optionalMax || req.selected === req.optionalMax;

      out.push(req);
    });

    classReq.complete = classReq.selected >= classReq.min;
    classReq.optional_complete = classReq.selected === classReq.optionalMax;

    out.unshift(classReq);

    return out;
  }

  public static Serialize(parent: Unit, target: any) {
    target.templates = parent.NpcTemplateController._templates.map((x) => ({
      id: x.ID,
      data: x.Data,
    }));
  }

  public static Deserialize(parent: Unit, data: INpcTemplateSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      );

    parent.NpcTemplateController._templates = data.templates.map((x) => {
      if (CompendiumStore().has('NpcTemplates', x.id))
        return CompendiumStore().referenceByID('NpcTemplates', x.id);
      else return new NpcTemplate(x.data);
    });
  }
}

export { NpcTemplateController };
export type { INpcTemplateSaveData, FeatureRequirement };
