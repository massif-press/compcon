<template>
  <v-list v-for="key in Object.keys(groupings)" class="mb-4 mt-n2">
    <v-row dense align="center">
      <v-col cols="auto" style="width: 2vw"><v-divider /></v-col>
      <v-col cols="auto" class="heading h3">
        {{ key === '0' ? 'All' : key }}
        <span class="text-caption text-disabled">
          ({{ groupedItems(groupings[key]).length }}/{{ items.length }})
        </span>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <div v-if="!items.length" class="text-center text-disabled"><i>No Data</i></div>
    <gm-item-list-element
      v-for="item in groupedItems(groupings[key])"
      :item="<any>item"
      :grouping="grouping"
      :sorting="sorting"
      :selected-id="selectedId"
      @open="$emit('open', item)" />
  </v-list>
</template>

<script lang="ts">
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import GmItemListElement from './_components/GMItemListElement.vue';
import FolderMenu from './_components/FolderMenu.vue';
import GmItemTable from './GMItemTable.vue';
import _ from 'lodash';
import { Unit } from '@/classes/npc/unit/Unit';

export default {
  name: 'item-sidebar-list',
  components: { GmItemListElement, GmItemTable, FolderMenu },
  props: {
    itemType: { type: String, required: true },
    items: { type: Array, required: true },
    selectedId: { type: String, required: false },
    search: { type: String, required: false, default: '' },
    big: { type: Boolean },
    list: { type: Boolean },
    table: { type: Boolean },
    grouping: { type: String, required: false, default: 'Folder' },
    sorting: { type: String, required: false, default: 'Name' },
    sortDir: { type: String, required: false, default: 'asc' },
    allFolders: { type: Array, required: false, default: () => [] },
  },
  emits: ['open', 'add-new'],
  computed: {
    groupings() {
      if (this.grouping === 'None') return [`All`];

      if (this.grouping === 'Folder') {
        const out = {} as any;
        (this.allFolders as string[]).forEach((folder: string) => {
          out[folder] = this.items.filter((x: any) => x.FolderController?.Folder === folder);
        });

        const noFolder = this.items.filter((x: any) => !x.FolderController?.Folder);
        if (noFolder.length > 0) out['N/A'] = noFolder;

        return out;
      }

      if (this.grouping === 'Sitrep') {
        const sitreps = this.items
          .map((x) => (x as any).Sitrep.Name)
          .filter((x, i, a) => a.indexOf(x) === i);

        const out = {} as any;
        sitreps.forEach((sitrep) => {
          out[sitrep] = this.items.filter((x) => (x as any).Sitrep.Name === sitrep);
        });

        return out;
      }

      if (this.grouping === 'Environment') {
        const environments = this.items
          .map((x) => (x as any).Environment.Name)
          .filter((x, i, a) => a.indexOf(x) === i);

        const out = {} as any;
        environments.forEach((environment) => {
          out[environment] = this.items.filter((x) => (x as any).Environment.Name === environment);
        });

        return out;
      }

      const stats = {} as any;

      //check stats
      if (this.items.length > 0 && (this.items[0] as IStatContainer).StatController) {
        this.items.forEach((item) => {
          const sc = item as IStatContainer;
          const stat = sc.StatController.DisplayKeys.find(
            (x) => x.key === this.grouping || x.title === this.grouping
          );
          if (stat) {
            if (!stats[`${this.grouping} ${sc.StatController.MaxStats[stat.key]}`]) {
              stats[`${this.grouping} ${sc.StatController.MaxStats[stat.key]}`] = [];
            }
            stats[`${this.grouping} ${sc.StatController.MaxStats[stat.key]}`].push(item);
          }
        });
      }

      const labels = {} as any;

      // check labels
      if (this.items.length > 0 && (this.items[0] as any).NarrativeController) {
        this.items.forEach((item) => {
          const nc = item as any;
          const label = nc.NarrativeController.Labels.find((x) => x.title === this.grouping);
          if (label) {
            if (!labels[`${label.title}${label.value ? ` ${label.value}` : ''}`]) {
              labels[`${label.title}${label.value ? ` ${label.value}` : ''}`] = [];
            }
            labels[`${label.title}${label.value ? ` ${label.value}` : ''}`].push(item);
          }
        });
      }

      const classGrp = {} as any;

      if (this.items.length > 0 && (this.items[0] as any).NpcClassController) {
        this.items.forEach((item) => {
          const nc = item as Unit;
          if (this.grouping === 'Role') {
            let role = nc.NpcClassController.Class?.Role;
            if (!role) role = 'N/A';
            if (!classGrp[role]) classGrp[role] = [];
            classGrp[role].push(item);
          }
          if (this.grouping === 'Tier') {
            const tier = nc.NpcClassController.Tier;
            if (!classGrp[`T${tier}`]) classGrp[`T${tier}`] = [];
            classGrp[`T${tier}`].push(item);
          }
          if (this.grouping === 'Tag') {
            const tag = nc.Tag;
            if (!classGrp[tag]) classGrp[tag] = [];
            classGrp[tag].push(item);
          }
        });
      }

      const eidolonGrp = {} as any;
      if (this.items.length > 0 && (this.items[0] as any).Layers) {
        this.items.forEach((item) => {
          const ec = item as any;
          if (this.grouping === 'Tier') {
            const tier = ec.Tier;
            if (!eidolonGrp[`T${tier}`]) eidolonGrp[`T${tier}`] = [];
            eidolonGrp[`T${tier}`].push(item);
          }
          if (this.grouping === 'Class') {
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

      const nas = this.items.filter((x: any) => !ids.includes(x.ID));

      if (nas.length > 0) out['N/A'] = nas;

      return out;
    },
    searchedItems() {
      if (!this.search) return this.sort(this.items);
      return this.sort(this.items.filter((x: any) => (x as any).Name.includes(this.search)));
    },
  },
  methods: {
    groupedItems(group) {
      if (this.grouping === 'None') return this.sort(this.searchedItems);
      return group.filter((x: any) => (x as any).Name.includes(this.search));
    },
    sort(items) {
      return _.orderBy(items, (x: any) => {
        if (this.sorting === 'Sitrep') return x.Sitrep.Name;
        if (this.sorting === 'Environment') return x.Environment.Name;

        if (x[this.sorting]) return x[this.sorting];

        if (x.StatController && x.StatController.getStat(this.sorting))
          return x.StatController.getStat(this.sorting);
        if (x.NarrativeController && x.NarrativeController.LabelDictionary[this.sorting])
          return x.NarrativeController.LabelDictionary[this.sorting];
        if (x.NpcClassController) {
          if (this.sorting === 'Role') return x.NpcClassController.Class.Role;
          if (this.sorting === 'Tier') return x.NpcClassController.Tier;
          if (this.sorting === 'Tag') return x.Tag;
        }
      });
    },
  },
};
</script>
