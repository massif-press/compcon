import { MechEquipment, CompendiumItem, MechWeapon, Frame, LicensedItem } from '@/class';
import { NpcClass } from '../npc/class/NpcClass';
import { NpcFeature } from '../npc/feature/NpcFeature';

class ItemFilter {
  public static Filter(items: any[], filter: any): CompendiumItem[] {
    Object.keys(filter).forEach((p) => {
      if (p === 'LcpName') {
        items = items.filter((i) => filter[p][0].includes(i.LcpName));
      } else if (p === 'Source' && filter[p].length) {
        items = (items as LicensedItem[]).filter((i) => filter[p].includes(i.Source));
      } else if (p === 'Tags') {
        items = (items as MechEquipment[]).filter((e: MechEquipment) => {
          const item_tags = e instanceof MechWeapon ? e.AllTags : e.Tags;
          return filter.Tags.every((x) => item_tags.map((t) => t.ID).includes(x));
        });
      } else if (p === 'SP_greater') {
        items = (items as MechEquipment[]).filter((x) => x.SP > filter[p]);
      } else if (p === 'SP_less') {
        items = (items as MechEquipment[]).filter((x) => x.SP < filter[p]);
      } else if (p === 'SP_eq') {
        items = (items as MechEquipment[]).filter((x) => x.SP === filter[p]);
      } else if (p === 'MechType') {
        items = (items as Frame[]).filter((f) => filter[p].every((t) => f.MechType.includes(t)));
      } else if (p === 'MechSize') {
        items = (items as Frame[]).filter((f) => filter[p].every((t) => f.Size === t));
      } else if (p === 'Mounts') {
        items = (items as Frame[]).filter((f) => filter[p].every((m) => f.Mounts.includes(m)));
      } else if (p === 'Role') {
        items = (items as NpcClass[]).filter((npc) => filter[p].includes(npc.Role));
      } else if (p === 'FeatureType') {
        items = (items as NpcFeature[]).filter((feat) => filter[p].includes(feat.FeatureType));
      } else if (p === 'Origin') {
        items = (items as NpcFeature[]).filter((feat) => filter[p].includes(feat.Origin.ID));
      } else if (p === 'WeaponType') {
        items = (items as MechWeapon[]).filter((w) =>
          filter[p].some((t) => w.WeaponTypes.includes(t))
        );
      } else if (p === 'LicenseLevel') {
        items = items.filter((i: LicensedItem) => filter[p].includes(i.LicenseLevel));
      } else if (filter[p].length)
        items = items.filter((x) => filter[p].some((e) => x[p].includes(e)));
    });
    return items;
  }
}

export default ItemFilter;
