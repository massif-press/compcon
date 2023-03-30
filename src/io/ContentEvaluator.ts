import { CompendiumStore } from '@/stores';

const ItemsMissingLcp = (items: any[]): any[] => {
  const activePackIds = CompendiumStore()
    .ContentPacks.filter((x) => x.Active)
    .map((x) => x.ID);

  return items.filter((item) => {
    if (!item.brews || !item.brews.length) return false;
    return item.brews.some((brew) => !activePackIds.includes(brew.LcpId));
  });
};

const ItemsWithLcp = (items: any[]): any[] => {
  const activePackIds = CompendiumStore()
    .ContentPacks.filter((x) => x.Active)
    .map((x) => x.ID);

  return items.filter((item) => {
    if (!item.brews || !item.brews.length) return true;
    return item.brews.some((brew) => activePackIds.includes(brew.LcpId));
  });
};

const MissingItemIds = (): string[] => {
  const m = CompendiumStore().MissingContent;
  let out = [] as any[];
  for (const key in m) {
    out = [...out, ...m[key].map((i) => i.id)];
  }
  return out;
};

export { ItemsMissingLcp, ItemsWithLcp, MissingItemIds };
