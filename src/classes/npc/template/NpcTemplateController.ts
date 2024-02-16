import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { NpcTemplate } from './NpcTemplate';
import { NpcClass } from '../class/NpcClass';

interface INpcTemplateSaveData {
  templates: string[];
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
  }

  public AddTemplate(temp: NpcTemplate): void {
    this._templates.push(temp);
    if (temp.ForceTag) this.Parent.Tag = temp.ForceTag;
    temp.BaseFeatures.forEach((f) => this.Parent.NpcFeatureController.AddFeature(f));
  }

  public RemoveTemplate(temp: NpcTemplate): void {
    const idx = this._templates.findIndex((x) => x.ID === temp.ID);
    if (idx > -1) {
      this._templates.splice(idx, 1);
      temp.BaseFeatures.forEach((f) => this.Parent.NpcFeatureController.RemoveFeature(f));
      temp.OptionalFeatures.forEach((f) => this.Parent.NpcFeatureController.RemoveFeature(f));
    }
  }

  public get TemplateFeaturesCount(): {
    template: NpcTemplate;
    required: number;
    allowed: number;
  }[] {
    const out = [] as { template: NpcTemplate; required: number; allowed: number }[];
    this.Templates.forEach((template) => {
      let required = 0;
      let allowed = 0;
      if (template.OptionalPerTier || template.OptionalClassPerTier) console.log(template);
      if (template.OptionalMin || template.OptionalMax) {
        required = template.OptionalMax
          ? template.OptionalMin *
            (template.OptionalPerTier ? this.Parent.NpcClassController.Tier : 1)
          : 0;
        allowed = !template.OptionalMax
          ? template.OptionalMax *
            (template.OptionalPerTier ? this.Parent.NpcClassController.Tier : 1)
          : 0;
      }
      out.push({
        template,
        required,
        allowed,
      });
    });
    return out;
  }

  public get FeatureRequirements(): FeatureRequirement[] {
    const out = [] as FeatureRequirement[];

    const classReq = {
      source: this.Parent.NpcClassController.Class!.Name || '',
      source_id: this.Parent.NpcClassController.Class!.ID,
      min: 0,
      max: 0,
      optionalMin: this.Parent.NpcClassController.Class!.OptionalClassMin || 0,
      optionalMax: this.Parent.NpcClassController.Class!.OptionalClassMax || 2,
      selected: this.Parent.NpcFeatureController.Features.filter(
        (x) => !x.Base && x.Origin.ID === this.Parent.NpcClassController.Class!.ID
      ).length,
      complete: false,
      optional_complete: false,
    };

    classReq.selected += this.Parent.NpcFeatureController.Features.filter(
      (x) => !x.Base && (x.Origin as NpcTemplate).FreeOptions
    ).length;

    this.Templates.forEach((template) => {
      const req = {
        source: template.Name,
        source_id: template.ID,
        min: template.OptionalMin,
        max: template.OptionalMax,
        optionalMin: template.OptionalMin,
        optionalMax: template.OptionalMax,
        selected: this.Parent.NpcFeatureController.Features.filter(
          (x) => !x.Base && x.Origin.ID === template.ID
        ).length,
        complete: false,
        optional_complete: false,
      };
      classReq.optionalMin += template.OptionalClassMin || 0;
      classReq.optionalMax += template.OptionalClassMax || 0;

      if (template.OptionalPerTier) {
        req.min += template.OptionalPerTier * this.Parent.NpcClassController.Tier;
        req.max += template.OptionalPerTier * this.Parent.NpcClassController.Tier;
      }

      if (template.OptionalClassPerTier) {
        classReq.optionalMin += template.OptionalClassPerTier * this.Parent.NpcClassController.Tier;
        classReq.optionalMax += template.OptionalClassPerTier * this.Parent.NpcClassController.Tier;
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
    target.templates = parent.NpcTemplateController._templates.map((x) => x.ID);
  }

  public static Deserialize(parent: Unit, data: INpcTemplateSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      );

    parent.NpcTemplateController._templates = data.templates.map((x) =>
      CompendiumStore().referenceByID('NpcTemplates', x)
    );
  }
}

export { NpcTemplateController };
