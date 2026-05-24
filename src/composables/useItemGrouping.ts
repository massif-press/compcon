import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { Unit } from '@/classes/npc/unit/Unit';

export function computeItemGroupings(
  items: any[],
  grouping: string,
  allFolders: string[] = []
): Record<string, any[]> | string[] {
  if (grouping === 'None') return ['All'];

  if (grouping === 'Folder') {
    const out = {} as any;
    allFolders.forEach((folder: string) => {
      out[folder] = items.filter((x: any) => x.FolderController?.Folder === folder);
    });
    const noFolder = items.filter((x: any) => !x.FolderController?.Folder);
    if (noFolder.length > 0) out['N/A'] = noFolder;
    return out;
  }

  if (grouping === 'Sitrep') {
    const sitreps = items
      .map((x) => (x as any).Sitrep.Name)
      .filter((x, i, a) => a.indexOf(x) === i);
    const out = {} as any;
    sitreps.forEach((sitrep) => {
      out[sitrep] = items.filter((x) => (x as any).Sitrep.Name === sitrep);
    });
    return out;
  }

  if (grouping === 'Environment') {
    const environments = items
      .map((x) => (x as any).Environment.Name)
      .filter((x, i, a) => a.indexOf(x) === i);
    const out = {} as any;
    environments.forEach((environment) => {
      out[environment] = items.filter((x) => (x as any).Environment.Name === environment);
    });
    return out;
  }

  const stats = {} as any;
  if (items.length > 0 && (items[0] as IStatContainer).StatController) {
    items.forEach((item) => {
      const sc = item as IStatContainer;
      const stat = sc.StatController.DisplayKeys.find(
        (x) => x.key === grouping || x.title === grouping
      );
      if (stat) {
        if (!stats[`${grouping} ${sc.StatController.MaxStats[stat.key]}`]) {
          stats[`${grouping} ${sc.StatController.MaxStats[stat.key]}`] = [];
        }
        stats[`${grouping} ${sc.StatController.MaxStats[stat.key]}`].push(item);
      }
    });
  }

  const labels = {} as any;
  if (items.length > 0 && (items[0] as any).NarrativeController) {
    items.forEach((item) => {
      const nc = item as any;
      const label = nc.NarrativeController.Labels.find((x) => x.title === grouping);
      if (label) {
        if (!labels[`${label.title}${label.value ? ` ${label.value}` : ''}`]) {
          labels[`${label.title}${label.value ? ` ${label.value}` : ''}`] = [];
        }
        labels[`${label.title}${label.value ? ` ${label.value}` : ''}`].push(item);
      }
    });
  }

  const classGrp = {} as any;
  if (items.length > 0 && (items[0] as any).NpcClassController) {
    items.forEach((item) => {
      const nc = item as Unit;
      if (grouping === 'Role') {
        let role = nc.NpcClassController.Class?.Role;
        if (!role) role = 'N/A';
        if (!classGrp[role]) classGrp[role] = [];
        classGrp[role].push(item);
      }
      if (grouping === 'Tier') {
        const tier = nc.NpcClassController.Tier;
        if (!classGrp[`T${tier}`]) classGrp[`T${tier}`] = [];
        classGrp[`T${tier}`].push(item);
      }
      if (grouping === 'Tag') {
        const tag = nc.Tag;
        if (!classGrp[tag]) classGrp[tag] = [];
        classGrp[tag].push(item);
      }
    });
  }

  const eidolonGrp = {} as any;
  if (items.length > 0 && (items[0] as any).Layers) {
    items.forEach((item) => {
      const ec = item as any;
      if (grouping === 'Tier') {
        const tier = ec.Tier;
        if (!eidolonGrp[`T${tier}`]) eidolonGrp[`T${tier}`] = [];
        eidolonGrp[`T${tier}`].push(item);
      }
      if (grouping === 'Class') {
        const c = `Class ${ec.Class}`;
        if (!eidolonGrp[c]) eidolonGrp[c] = [];
        eidolonGrp[c].push(item);
      }
    });
  }

  const out = { ...stats, ...labels, ...classGrp, ...eidolonGrp };
  const ids = Object.values(out)
    .flat()
    .map((x: any) => x.ID);
  const nas = items.filter((x: any) => !ids.includes(x.ID));
  if (nas.length > 0) out['N/A'] = nas;
  return out;
}
