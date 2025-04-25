import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { NpcTemplate } from './NpcTemplate';
import { NpcClass } from '../class/NpcClass';

interface INpcTemplateSaveData {
  instance: boolean;
  templates: string[] | { Name: string; ID: string }[];
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

class TemplateProxy {
  public readonly ID: string;
  public readonly Name: string;

  constructor(name: string, id?: string) {
    this.Name = name;
    this.ID = id || '';
  }
}

class NpcTemplateController {
  public readonly Parent: Unit;
  private _templates: NpcTemplate[] | TemplateProxy[];

  public constructor(parent: Unit) {
    this.Parent = parent;
    this._templates = [] as NpcTemplate[] | TemplateProxy[];
  }

  private get isInstance(): boolean {
    return this.Parent.IsInstance;
  }

  private get isLinked(): boolean {
    return this.isInstance && this.Parent.IsLinked;
  }

  public get Templates(): NpcTemplate[] | TemplateProxy[] {
    if (this.isLinked)
      return this._templates.map(
        (t) => CompendiumStore().NpcTemplates.find((x) => x.ID === t.ID) as NpcTemplate
      );
    return this._templates;
  }

  public set Templates(temps: NpcTemplate[] | TemplateProxy[]) {
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
    if (this.isInstance) return out;

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
    if (this.isInstance) return out;

    const c = this.Parent.NpcClassController.Class as NpcClass;

    const classReq = {
      source: c.Name || '',
      source_id: c.ID,
      min: 0,
      max: 0,
      optionalMin: c.OptionalClassMin || 0,
      optionalMax: c.OptionalClassMax || 2,
      selected: this.Parent.NpcFeatureController.Features.filter(
        (x) => !x.Base && x.Origin.ID !== c.ID
      ).length,
      complete: false,
      optional_complete: false,
    };

    classReq.selected += this.Parent.NpcFeatureController.Features.filter(
      (x) => !x.Base && (x.Origin as NpcTemplate).FreeOptions
    ).length;

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
    if (target.instance) {
      target.templates = parent.NpcTemplateController._templates.map((x) => ({
        Name: x.Name,
        ID: x.ID,
      }));
    } else target.templates = parent.NpcTemplateController._templates.map((x) => x.ID);
  }

  public static Deserialize(parent: Unit, data: INpcTemplateSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      );

    if (data.instance) {
      parent.NpcTemplateController._templates = data.templates.map(
        (x) => new TemplateProxy(x.Name, x.ID)
      );
    } else {
      parent.NpcTemplateController._templates = data.templates.map((x) =>
        CompendiumStore().referenceByID('NpcTemplates', x)
      );
    }
  }
}

export { NpcTemplateController };
export type { INpcTemplateSaveData, FeatureRequirement };
