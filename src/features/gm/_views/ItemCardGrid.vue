<template>
  <gm-item-table
    v-if="table"
    :item-type="itemType"
    :items="searchedItems"
    :grouping="grouping"
    :sorting="sorting"
    :sort-dir="sortDir"
    @open="$emit('open', $event)" />
  <div v-else>
    <div v-for="key in Object.keys(groupings)" class="mb-4 mt-n2">
      <v-row dense align="center">
        <v-col cols="auto" style="width: 2vw"><v-divider /></v-col>
        <v-col cols="auto" class="heading h3">
          {{ key === '0' ? 'All' : key }}
          <span class="text-caption text-disabled"
            >({{ groupedItems(groupings[key]).length }}/{{ items.length }})</span
          >
        </v-col>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <div v-if="!items.length" class="text-center text-disabled"><i>No Data</i></div>
      <v-row v-else dense>
        <v-col v-for="(item, i) in groupedItems(groupings[key])" :cols="list ? 12 : big ? 3 : 2">
          <item-card
            :item="item as any"
            :big="big"
            :odd="i % 2 > 0"
            :list="list"
            :grouping="grouping"
            :sorting="sorting"
            @open="$emit('open', $event)" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import ItemCard from './_components/GMItemCard.vue';
import GmItemTable from './GMItemTable.vue';
import _ from 'lodash';
import { Unit } from '@/classes/npc/unit/Unit';

export default {
  name: 'item-card-grid',
  components: { ItemCard, GmItemTable },
  props: {
    itemType: { type: String, required: true },
    items: { type: Array, required: true },
    search: { type: String, required: false, default: '' },
    big: { type: Boolean },
    list: { type: Boolean },
    table: { type: Boolean },
    grouping: { type: String, required: false, default: 'None' },
    sorting: { type: String, required: false, default: 'Name' },
    sortDir: { type: String, required: false, default: 'asc' },
  },
  computed: {
    groupings() {
      if (this.grouping === 'None') return [`All`];

      const stats = {} as any;

      //check stats
      if ((this.items[0] as IStatContainer).StatController) {
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
      if ((this.items[0] as any).NarrativeController) {
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

      if ((this.items[0] as any).NpcClassController) {
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
      if ((this.items[0] as any).Layers) {
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
