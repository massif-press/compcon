<template>
  <v-card-text v-if="!classes.length" class="mt-n4">
    <v-container>
      <cc-missing-gm-lcp-text />
    </v-container>
  </v-card-text>
  <div v-else style="height: 90vh; overflow-y: hidden">
    <cc-compendium-browser
      ref="browser"
      :items="classes"
      item-type="NpcClass"
      :table-headers="headers"
      :tier="selectedTier"
      :options="options"
      equippable
      @equip="SetClass($event)"
      @view-change="toggleTieredView">
      <template #header>
        <div class="heading h3 text-center text-accent">NPC Classes</div>
        <v-slide-y-transition>
          <div v-if="tieredView" class="text-center my-n1">
            <v-btn-toggle
              v-model="selectedTier"
              density="compact"
              color="secondary-darken-3"
              mandatory
              style="height: 15px">
              <v-btn size="x-small" :value="1">Tier 1</v-btn>
              <v-btn size="x-small" :value="2">Tier 2</v-btn>
              <v-btn size="x-small" :value="3">Tier 3</v-btn>
            </v-btn-toggle>
          </div>
        </v-slide-y-transition>
      </template>
    </cc-compendium-browser>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { NpcClass } from '@/classes/npc/class/NpcClass';
import _ from 'lodash';

const keymap = {
  hull: 'Hull',
  agi: 'Agi',
  sys: 'Sys',
  eng: 'Eng',
  armor: 'Armor',
  hp: 'HP',
  heat: 'HeatCap',
  evasion: 'Evade',
  edef: 'E-Def',
  speed: 'Speed',
  sensorRange: 'Sensor',
  saveTarget: 'Save',
};

export default {
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    selectedTier: 1,
    tieredView: false,
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['lcp', 'role'],
      initialGroup: 'role',
    },
  }),
  emits: ['close'],
  created() {
    this.selectedTier = this.item.NpcClassController?.Tier || 1;
  },
  computed: {
    classes(): NpcClass[] {
      return _.orderBy(CompendiumStore().NpcClasses, ['Role', 'Name']);
    },
    headers() {
      const h = [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Role', key: 'Icon' },
        { title: 'Name', key: 'Name' },
      ] as any[];
      for (const key in keymap) {
        h.push({
          title: keymap[key],
          key,
          tier: this.selectedTier,
          sortRaw: (a: NpcClass, b: NpcClass) =>
            Number(a.Stats.Stat(key, this.selectedTier)) -
            Number(b.Stats.Stat(key, this.selectedTier)),
          align: 'center',
        });
      }
      return h;
    },
  },
  methods: {
    getRoleIcon(role: string) {
      if (role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
      return `cc:role_${role.toLowerCase()}`;
    },

    toggleTieredView(evt) {
      this.tieredView = evt === 'table' || evt === 'scatter' || evt === 'bar' || evt === 'compare';
    },
    SetClass(c) {
      this.item.NpcClassController.SetClass(c, this.item.NpcClassController.Tier);
      this.$emit('close');
    },
  },
};
</script>
