import { Npc } from '../..';
import { NpcTemplate } from './NpcTemplate';
import { NpcStore, store } from '@/stores';

interface INpcTemplateSaveData {
  templates: string[];
}

class NpcTemplateController {
  public readonly Parent: Npc;
  private _templates: NpcTemplate[];

  public constructor(parent: Npc) {
    this.Parent = parent;
    this._templates = [];
  }

  public get Templates(): NpcTemplate[] {
    return this._templates;
  }

  public set Templates(temps: NpcTemplate[]) {
    this._templates = temps;
  }

  public AddTemplate(temp: NpcTemplate): void {
    this._templates.push(temp);
    temp.BaseFeatures.forEach((f) =>
      this.Parent.NpcFeatureController.AddFeature(f, true)
    );
    this.Parent.RecalcBonuses();
  }

  public RemoveTemplate(temp: NpcTemplate): void {
    const idx = this._templates.findIndex((x) => x.ID === temp.ID);
    if (idx > -1) {
      this._templates.splice(idx, 1);
      temp.BaseFeatures.forEach((f) =>
        this.Parent.NpcFeatureController.RemoveFeature(f, true)
      );
      temp.OptionalFeatures.forEach((f) =>
        this.Parent.NpcFeatureController.RemoveFeature(f, true)
      );
      this.Parent.RecalcBonuses();
    }
  }

  public get TemplateFeaturesCount(): {
    template: NpcTemplate;
    required: number;
    allowed: number;
  }[] {
    const out = [];
    this.Templates.forEach((template) => {
      let required = 0;
      let allowed = 0;
      if (template.OptionalMin || template.OptionalMax) {
        required = template.ForceOptional
          ? template.OptionalMin *
            (template.OptionalPerTier ? this.Parent.NpcClassController.Tier : 1)
          : 0;
        allowed = !template.ForceOptional
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

  public get TemplateFeaturesSelected(): {
    template: NpcTemplate;
    count: number;
  }[] {
    const out = [];
    this.Templates.forEach((template) => {
      out.push({
        template,
        count: this.Parent.NpcFeatureController.SelectedFeatures.filter(
          (x) => x.Origin.ID === template.ID && x.Origin.Optional
        ).length,
      });
    });
    return out;
  }

  public get TemplateFeaturesRemaining(): {
    template: NpcTemplate;
    required: number;
    allowed: number;
  }[] {
    const out = [];
    this.TemplateFeaturesCount.forEach((item) => {
      out.push({
        template: item.template,
        required:
          item.required -
          this.TemplateFeaturesSelected.find(
            (x) => x.template.ID === item.template.ID
          ).count,
        allowed:
          item.allowed -
          this.TemplateFeaturesSelected.find(
            (x) => x.template.ID === item.template.ID
          ).count,
      });
    });
    return out;
  }

  public get TemplateFeatureAlerts(): { severity: string; message: string }[] {
    const out = [];
    this.TemplateFeaturesRemaining.forEach((item) => {
      if (item.required > 0)
        out.push({
          severity: 'error',
          message: `${item.required} additional optional ${
            item.template.Name
          } feature${item.required > 1 ? 's' : ''} must be selected`,
        });
      if (item.allowed > 0)
        out.push({
          severity: 'warning',
          message: `${item.allowed} additional optional ${
            item.template.Name
          } feature${item.allowed > 1 ? 's' : ''} may be selected`,
        });
    });
    const selectedOptional =
      this.Parent.NpcFeatureController.SelectedFeatures.filter(
        (x) => x.Origin.Optional
      ).length;
    const optionalSelectTemplates = this.Templates.filter(
      (x) => x.AllowOptional
    ).map((x) => x.Name);
    const selectedString = `${this.Parent.NpcClassController.Class.Name}${
      optionalSelectTemplates.length
        ? `/${optionalSelectTemplates.join('/')}`
        : ''
    }`;
    if (selectedOptional < 2)
      out.push({
        severity: 'warning',
        message: `${
          2 - selectedOptional
        } additional optional ${selectedString} feature${
          2 - selectedOptional > 1 ? 's' : ''
        } may be selected`,
      });
    return out;
  }

  public static Serialize(parent: Npc, target: any) {
    target.templates = parent.NpcTemplateController._templates.map((x) => x.ID);
  }

  public static Deserialize(parent: Npc, data: INpcTemplateSaveData) {
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
