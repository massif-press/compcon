import { IStatContainer } from '../components/combat/stats/IStatContainer';
import { Npc } from './Npc';
import { Doodad } from './doodad/Doodad';
import { Eidolon } from './eidolon/Eidolon';
import { EidolonLayer } from './eidolon/EidolonLayer';
import { Unit } from './unit/Unit';

const GenerateItemDiff = (target: Npc, source: Npc) => {
  if (!target.IsInstance || !source) return {};

  const diff = {
    Name: { instance: target.Name, source: source.Name },
    Note: { instance: target.Note, source: source.Note },
    Description: { instance: target.Description, source: source.Description },
    GmDescription: { instance: target.GmDescription, source: source.GmDescription },
    Folder: { instance: target.FolderController.Folder, source: source.FolderController.Folder },
    Stats: {},
    Labels: {},
    AdditionalDetail: {},
    Clocks: {},
    Tables: {},
  };

  target.NarrativeController.Labels.forEach((label) => {
    let sourceLabel = source.NarrativeController.Labels.find((x) => x.title === label.title);
    if (!sourceLabel)
      return (diff.Labels[label.title] = {
        instance: `${label.title}: ${label.value}`,
        source: 'None',
      });
    if (label.value !== sourceLabel.value)
      diff.Labels[label.title] = {
        instance: `${label.title}: ${label.value}`,
        source: `${sourceLabel.title}: ${sourceLabel.value}`,
      };
  });

  target.NarrativeController.TextItems.forEach((text) => {
    let sourceText = source.NarrativeController.TextItems.find((x) => x.title === text.title);
    if (!sourceText)
      return (diff.AdditionalDetail[text.title] = {
        instance: `${text.title}: ${text.body.length} chars.${text.gm_only ? ' (GM Only)' : ''}`,
        source: 'None',
      });
    if (text.body !== sourceText.body || text.gm_only !== sourceText.gm_only)
      diff.AdditionalDetail[text.title] = {
        instance: `${text.title}: ${text.body.length} chars.${text.gm_only ? ' (GM Only)' : ''}`,
        source: `${sourceText.title}: ${text.body.length} chars.${
          text.gm_only ? ' (GM Only)' : ''
        }`,
      };
  });

  target.NarrativeController.Clocks.forEach((clock) => {
    let sourceClock = source.NarrativeController.Clocks.find((x) => x.ID === clock.ID);
    if (!sourceClock)
      return (diff.Clocks[clock.Title] = {
        instance: `${clock.Title}: ${clock.Progress}/${clock.Segments}, ${
          clock.Description.length
        } chars.${clock.GmOnly ? ' (GM Only)' : ''}`,
        source: 'None',
      });
    if (
      clock.Title !== sourceClock.Title ||
      clock.Segments !== sourceClock.Segments ||
      clock.Description !== sourceClock.Description ||
      clock.GmOnly !== sourceClock.GmOnly
    )
      diff.Clocks[clock.Title] = {
        instance: `${clock.Title}: ${clock.Progress}/${clock.Segments}, ${
          clock.Description.length
        } chars.${clock.GmOnly ? ' (GM Only)' : ''}`,
        source: `${sourceClock.Title}: ${sourceClock.Progress}/${sourceClock.Segments}, ${
          sourceClock.Description.length
        } chars.${sourceClock.GmOnly ? ' (GM Only)' : ''}`,
      };
  });

  target.NarrativeController.Tables.forEach((table) => {
    let sourceTable = source.NarrativeController.Tables.find((x) => x.ID === table.ID);
    if (!sourceTable)
      return (diff.Tables[table.Title] = {
        instance: `${table.Title}: ${table.Results.length} items.${
          table.GmOnly ? ' (GM Only)' : ''
        }`,
        source: 'None',
      });
    if (
      table.Title !== sourceTable.Title ||
      table.Results.length !== sourceTable.Results.length ||
      table.GmOnly !== sourceTable.GmOnly
    )
      diff.Tables[table.Title] = {
        instance: `${table.Title}: ${table.Results.length} items.${
          table.GmOnly ? ' (GM Only)' : ''
        }`,
        source: `${sourceTable.Title}: ${sourceTable.Results.length} items.${
          sourceTable.GmOnly ? ' (GM Only)' : ''
        }`,
      };
  });

  switch (target.ItemType.toLowerCase()) {
    case 'unit':
      unitDiff(diff, target as Unit, source as Unit);
      break;
    case 'doodad':
      statDiff(diff, target as Doodad, source as Doodad);
      break;
    case 'eidolon':
      eidolonDiff(diff, target as Eidolon, source as Eidolon);
      break;
    default:
      break;
  }

  for (const key in diff) {
    if (diff[key].instance && diff[key].instance === diff[key].source) delete diff[key];
    else if (diff[key] && !diff[key].instance) delete diff[key];
  }

  return diff;
};

const unitDiff = (diff: any, target: Unit, source: Unit) => {
  diff.Tag = { instance: target.Tag, source: source.Tag };

  diff.Class = {
    instance: target.NpcClassController.Class?.Name || 'None',
    source: source.NpcClassController.Class?.Name || 'None',
  };

  diff.Templates = {
    instance: target.NpcTemplateController.Templates.map((x) => x.Name).join(', '),
    source: source.NpcTemplateController.Templates.map((x) => x.Name).join(', '),
  };

  diff.Features = {
    instance: target.NpcFeatureController.Features.map((x) => x.Name).join(', '),
    source: source.NpcFeatureController.Features.map((x) => x.Name).join(', '),
  };

  statDiff(diff, target, source);

  return diff;
};

const eidolonDiff = (diff: any, target: Eidolon, source: Eidolon) => {
  diff.Class = {
    instance: target.Class,
    source: source.Class,
  };

  diff.Tier = {
    instance: target.Tier,
    source: source.Tier,
  };

  diff.Layers = {
    instance: target.Layers.map((x) => x.Layer.Name).join(', '),
    source: source.Layers.map((x) => x.Layer.Name).join(', '),
  };
};

const statDiff = (diff: any, target: Unit | Doodad, source: Unit | Doodad) => {
  diff.Stats = {
    instance: target.StatController.DisplayKeys.map((x) => x.title).join(', '),
    source: source.StatController.DisplayKeys.map((x) => x.title).join(', '),
  };
};

const SetDiff = (target: Npc, key: string) => {
  const source = target.GetLinkedItem<Npc>();
  if (!source) return;

  const baseKeys = ['Name', 'Note', 'Description', 'GmDescription', 'Tag', 'Templates', 'Tier'];
  if (baseKeys.includes(key)) {
    target[key] = source[key];
    return;
  }

  const narrativeKeys = ['Labels', 'AdditionalDetail', 'Clocks', 'Tables'];
  if (narrativeKeys.includes(key)) {
    target.NarrativeController[key] = source.NarrativeController[key];
    return;
  }

  if (key === 'Folder') {
    target.FolderController[key] = source.FolderController[key];
    return;
  }

  if (key === 'Stats') {
    (target as Doodad).StatController.MaxStats = (source as Doodad).StatController.MaxStats;

    return;
  }

  if (key === 'Class') {
    if (target.ItemType.toLowerCase() === 'unit')
      (target as Unit).NpcClassController.SetClass(
        (source as Unit).NpcClassController.Class,
        (target as Unit).NpcClassController.Tier
      );

    return;
  }

  if (key === 'Layers') {
    if (target.ItemType.toLowerCase() === 'unit') {
      const u = target as Eidolon;
      u.ClearLayers();

      (source as Eidolon).Layers.forEach((l) => {
        u.AddLayer((l.Layer as EidolonLayer).ID);
      });
    }
    return;
  }

  if (key === 'Features') {
    if (target.ItemType.toLowerCase() === 'unit') {
      const u = target as Unit;
      u.NpcFeatureController.ClearFeatures();

      (source as Unit).NpcFeatureController.Features.forEach((f) => {
        u.NpcFeatureController.AddFeature(f);
      });
    }
    return;
  }

  if (key === 'Templates') {
    if (target.ItemType.toLowerCase() === 'unit')
      (target as Unit).NpcTemplateController.Templates = (
        source as Unit
      ).NpcTemplateController.Templates;

    return;
  }
};

export { GenerateItemDiff, SetDiff };
