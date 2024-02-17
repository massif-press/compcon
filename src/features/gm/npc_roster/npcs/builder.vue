<template>
  <v-row dense class="heading mech mt-n3" style="min-width: 30vw" align="center">
    <v-col v-if="item.NpcClassController.HasClass" cols="auto">
      <v-icon size="70" :icon="item.NpcClassController.Class.Icon" class="mt-n4" />
    </v-col>
    <v-col>
      <cc-short-string-editor
        large
        justify="start"
        :placeholder="item.Name"
        @set="item.Name = $event">
        <div class="heading-block">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <span class="text-disabled pr-12">T{{ item.NpcClassController.Tier }}</span>
    </v-col>
  </v-row>
  <div class="pr-12 mt-1">
    <v-textarea
      density="compact"
      variant="outlined"
      label="Summary (GM Only)"
      hide-detail
      rows="1"
      auto-grow
      v-model="item.GmDescription" />
  </div>

  <v-row dense class="mt-n5">
    <v-col>
      <div class="text-caption mb-1">NPC CLASS</div>
      <v-btn
        size="large"
        block
        :color="!item.NpcClassController.HasClass ? 'error' : 'accent'"
        variant="tonal"
        class="px-12"
        @click="($refs.classSelector as any).show()">
        {{
          item.NpcClassController.HasClass ? item.NpcClassController.Class.Name : 'Set NPC Class'
        }}
      </v-btn>

      <cc-solo-dialog ref="classSelector" fullscreen no-confirm title="Set NPC Class">
        <cc-compendium-browser
          ref="browser"
          :items="classes"
          item-type="NpcClass"
          :table-headers="headers"
          :tier="selectedTier"
          :options="options"
          equippable
          @equip="equip($event)"
          @view-change="toggleTieredView">
          <template #header>
            <div class="heading h3 text-center text-accent">Set NPC Class</div>
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
      </cc-solo-dialog>

      <!-- <npc-class-selector ref="classSelector" :item="item" /> -->
    </v-col>
    <v-col cols="auto">
      <div class="text-caption mb-1">NPC TAG</div>
      <npc-tag-selector :item="item" />
    </v-col>
  </v-row>

  <div v-if="item.NpcClassController.HasClass">
    <npc-template-selector :item="item" />
  </div>
</template>

<script lang="ts">
import { NpcClass } from '@/classes/npc/class/NpcClass';
import { CompendiumStore } from '@/stores';
import _ from 'lodash';
import {
  NpcClassSelector,
  NpcTemplateSelector,
  NpcTierSelector,
  NpcTagSelector,
} from './_components';

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
  name: 'npc-builder-content',
  components: {
    NpcClassSelector,
    NpcTemplateSelector,
    NpcTierSelector,
    NpcTagSelector,
  },
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
            a.Stats.Stat(key, this.selectedTier) - b.Stats.Stat(key, this.selectedTier),
          align: 'center',
        });
      }
      return h;
    },
  },
  methods: {
    toggleTieredView(evt) {
      this.tieredView = evt === 'table' || evt === 'scatter' || evt === 'bar' || evt === 'compare';
    },
    equip(item) {
      this.item.NpcClassController.SetClass(item, this.item.NpcClassController.Tier);
      (this.$refs.classSelector as any).hide();
    },
  },
};
</script>
