<template>
  <v-container fluid>
    <v-btn-toggle v-model="tier" density="compact" mandatory active-class="text-accent">
      <v-btn :value="1">
        <v-icon start>cc:rank_1</v-icon>
        Tier 1
      </v-btn>
      <v-btn :value="2">
        <v-icon start>cc:rank_2</v-icon>
        Tier 2
      </v-btn>
      <v-btn :value="3">
        <v-icon start>cc:rank_3</v-icon>
        Tier 3
      </v-btn>
    </v-btn-toggle>
    <v-row class="mx-2 mt-n2 mb-2" no-gutters>
      <v-col cols="auto">
        <h1 class="heading">NPC Classes</h1>
      </v-col>
      <v-col cols="3" class="ml-auto mr-5">
        <v-text-field
          v-model="search"
          class="search-field"
          prepend-icon="search"
          flat
          hide-actions
          single-line
          placeholder="Search"
          clearable
          persistent-hint
          :hint="`${fItems.length} Items`"
        />
      </v-col>
      <!-- <cc-filter-panel v-if="!noFilter" :item-type="itemType" @set-filters="setFilters" /> -->
    </v-row>
    <v-data-table
      v-resize="onResize"
      :headers="headers"
      :items="fItems"
      item-key="ID"
      :height="tableHeight"
      hide-default-footer
      disable-pagination
      class="elevation-0 flavor-text background"
      calculate-widths
      fixed-header
      multi-sort
      show-select
      single-select
    >
      <template #item.data-table-select="{ item }">
        <v-btn x-small fab color="primary" dark @click="($refs[`modal_${item.ID}`] as any).show()">
          <v-icon icon="mdi-open-in-new" />
        </v-btn>
        <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
      </template>
      <template #item.Name="{ item }">
        <span class="stat-text">{{ item.Name }}</span>
      </template>
      <template #item.Role="{ item }">
        <span style="text-transform: uppercase">{{ item.Role }}</span>
      </template>
      <template #item.HP="{ item }">
        {{ item.Stats.HP(tier) }}
      </template>
      <template #item.Armor="{ item }">
        {{ item.Stats.Armor(tier) }}
      </template>
      <template #item.Structure="{ item }">
        {{ item.Stats.Structure(tier) }}
      </template>
      <template #item.Heatcap="{ item }">
        {{ item.Stats.HeatCapacity(tier) }}
      </template>
      <template #item.Stress="{ item }">
        {{ item.Stats.Stress(tier) }}
      </template>
      <template #item.Evasion="{ item }">
        {{ item.Stats.Evade(tier) }}
      </template>
      <template #item.EDef="{ item }">
        {{ item.Stats.EDefense(tier) }}
      </template>
      <template #item.Speed="{ item }">
        {{ item.Stats.Speed(tier) }}
      </template>
      <template #item.Sensor="{ item }">
        {{ item.Stats.Sensor(tier) }}
      </template>
      <template #item.Save="{ item }">
        {{ item.Stats.Save(tier) }}
      </template>
      <template #item.Hase="{ item }">
        {{ item.Stats.Hull(tier) }}/{{ item.Stats.Agility(tier) }}/{{ item.Stats.Systems(tier) }}/{{
          item.Stats.Engineering(tier)
        }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { NpcClass } from '@/class';
import { accentInclude } from '@/classes/utility/accent_fold';

export default {
  name: 'NpcClasses',
  data: () => ({
    tier: 1,
    search: '',
    tableHeight: 450,
    headers: [
      { title: 'Class', align: 'left', value: 'Name' },
      { title: 'Role', align: 'left', value: 'Role' },
      { title: 'HP', align: 'left', value: 'HP' },
      { title: 'Armor', align: 'left', value: 'Armor' },
      { title: 'Struct.', align: 'left', value: 'Structure' },
      { title: 'HeatCap.', align: 'left', value: 'Heatcap' },
      { title: 'Stress', align: 'left', value: 'Stress' },
      { title: 'Evade', align: 'left', value: 'Evasion' },
      { title: 'E-Def', align: 'left', value: 'EDef' },
      { title: 'Speed', align: 'left', value: 'Speed' },
      { title: 'Sensor', align: 'left', value: 'Sensor' },
      { title: 'Save', align: 'left', value: 'Save' },
      { title: 'H/A/S/E', align: 'left', value: 'Hase', sortable: false },
    ],
  }),
  computed: {
    fItems(): NpcClass[] {
      const search = this.search.toLowerCase();
      return CompendiumStore().NpcClasses.filter(
        (x) =>
          search.length === 0 ||
          x.Name.toLowerCase().includes(search) ||
          x.Role.toLowerCase().includes(search) ||
          accentInclude(x.Name, search) ||
          accentInclude(x.Role, search)
      );
    },
  },
  methods: {
    onResize() {
      this.tableHeight = window.innerHeight - 300;
    },
  },
  mounted(): void {
    this.onResize();
  },
};
</script>
