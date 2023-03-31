import { defineStore } from 'pinia';

import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { Eidolon, EidolonData } from '@/classes/npc/eidolons/Eidolon';

async function saveEidolonData(eidolons: Eidolon[]) {
  const dirty = eidolons.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('eidolons', Eidolon.Serialize(x))))
    .then(() => console.info('EIDOLON data saved'))
    .catch((err) => console.error('Error while saving EIDOLON data', err));
}

// async function delete_eidolon(eidolon: Eidolon) {
//   RemoveItem('eidolons', eidolon.ID)
//     .then(() => console.info('EIDOLON permanently deleted'))
//     .catch((err) => console.error('Error while deleting EIDOLON data', err));
// }

export const EidolonStore = defineStore('eidolon', {
  state: () => ({
    Eidolons: [] as Eidolon[],
    DeletedEidolons: [] as Eidolon[],
    MissingEidolons: [] as EidolonData[],
    Dirty: false,
  }),
  getters: {
    AllEidolons: (state: any) => state.Eidolons.concat(state.DeletedEidolons),
    getEidolons: (state: any) => state.Eidolons,
    getEidolon: (state: any) => (id: string) => {
      return state.Eidolons.find((x: Eidolon) => x.ID === id);
    },
    unsavedCloudEidolons: (state: any) =>
      state.Eidolons.filter((p: Eidolon) => p.SaveController.IsDirty),
  },
  actions: {
    _loadEidolons(payload: EidolonData[]): void {
      const newEidolons: Eidolon[] = [
        ...payload.map((x) => Eidolon.Deserialize(x)),
      ];
      this.Eidolons.splice(0, this.Eidolons.length);
      const all = [] as Eidolon[];
      newEidolons.forEach((eidolon: Eidolon) => {
        all.push(eidolon);
      });
      this.Eidolons = all.filter((x) => !x.SaveController.IsDeleted);
      this.DeletedEidolons = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Eidolon[];
      (this.DeletedEidolons as any).forEach((dp: Eidolon) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} Eidolons marked for deletion`);
        del.forEach((p) => {
          const dpIdx = (this.DeletedEidolons as any).findIndex(
            (x: Eidolon) => x.ID === p.ID
          );
          if (dpIdx > -1) {
            this.DeletedEidolons.splice(dpIdx, 1);
          }
        });
        storeSaveDelta((this.Eidolons as any).concat(this.DeletedEidolons));
      }
    },
    SetDirty(): void {
      if (this.Eidolons.length) this.Dirty = true;
    },

    AddEidolon(payload: Eidolon): void {
      payload.SaveController.IsDirty = true;
      this.Eidolons.push(payload);
      this.Dirty = true;
      saveEidolonData(this.Eidolons as Eidolon[]);
    },

    CloneEidolon(payload: Eidolon): void {
      this.Eidolons.push(payload.Clone());
      this.Dirty = true;
    },

    DeleteEidolon(payload: Eidolon): void {
      const idx = (this.Eidolons as Eidolon[]).findIndex(
        (x: Eidolon) => x.ID === payload.ID
      );
      if (idx > -1) {
        this.Eidolons.splice(idx, 1);
        this.DeletedEidolons.push(payload);
      } else {
        throw console.error('EIDOLON not loaded!');
      }
      this.Dirty = true;
      saveEidolonData(this.Eidolons as Eidolon[]);
    },

    DeleteMissingEidolon(payload: Eidolon): void {
      // for some reason missing eidolons is being set to the compendium missing property. Not sure why this is happening.
      if (Array.isArray(this.MissingEidolons)) {
        const idx = (this.MissingEidolons as any).findIndex(
          (x: Eidolon) => x.ID === payload.ID
        );
        if (idx > -1) {
          this.MissingEidolons.splice(idx, 1);
          deletePermanent(payload);
        }
      } else {
        const idx = (this.MissingEidolons as any).eidolons.findIndex(
          (x: Eidolon) => x.ID === payload.ID
        );
        if (idx > -1) {
          (this.MissingEidolons as any).eidolons.splice(idx, 1);
          deletePermanent(payload);
        }
      }
    },

    DeleteEidolonPermanent(payload: Eidolon): void {
      const dpIdx = (this.DeletedEidolons as Eidolon[]).findIndex(
        (x: Eidolon) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        this.DeletedEidolons.splice(dpIdx, 1);
        deletePermanent(payload);
      }
      this.Dirty = true;
      saveEidolonData(this.Eidolons as Eidolon[]);
    },

    RestoreEidolon(payload: Eidolon): void {
      const EidolonIndex = (this.DeletedEidolons as Eidolon[]).findIndex(
        (x: Eidolon) => x.ID === payload.ID
      );
      if (EidolonIndex > -1) {
        this.DeletedEidolons.splice(EidolonIndex, 1);
        this.Eidolons.push(payload);
      } else {
        throw console.error('EIDOLON not loaded!');
      }
      this.Dirty = true;
      saveEidolonData(this.Eidolons as Eidolon[]);
    },

    SetMissingEidolonContent(payload: EidolonData[]): void {
      this.MissingEidolons = payload;
    },

    SaveEidolonData(): void {
      saveEidolonData((this.Eidolons as any).concat(this.DeletedEidolons));
    },

    set_eidolon_dirty(): void {
      this.Dirty = true;
    },

    delete_eidolon(payload: Eidolon): void {
      this.DeleteEidolon(payload);
    },

    restore_eidolon(payload: Eidolon): void {
      this.RestoreEidolon(payload);
    },

    deleteEidolonPermanent(payload: Eidolon): void {
      if (!payload.SaveController.IsDeleted) this.DeleteEidolon(payload);
      this.DeleteEidolonPermanent(payload);
    },

    async LoadEidolons() {
      const eidolonData = await GetAll('eidolons');
      this._loadEidolons(ItemsWithLcp(eidolonData));
      this.SetMissingEidolonContent(ItemsMissingLcp(eidolonData));
    },
  },
});
