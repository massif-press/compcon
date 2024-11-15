<template>
  <v-row dense class="heading mech" style="min-width: 30vw; line-height: 1em" align="center">
    <cc-remote-hover :item="item" />
    <v-col v-if="item.NpcClassController?.HasClass" cols="auto">
      <v-icon size="70" :icon="item.NpcClassController.Class.Icon" class="mt-n4" />
    </v-col>
    <v-col>
      <cc-short-string-editor
        large
        justify="start"
        :placeholder="item.Name"
        :readonly="readonly"
        @set="item.Name = $event">
        <div class="heading-block">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <span class="text-disabled pr-12">T{{ item.NpcClassController?.Tier || '' }}</span>
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
      :readonly="readonly"
      v-model="item.GmDescription" />
  </div>

  <v-row dense class="mt-n5">
    <v-col>
      <div class="text-caption mb-1">NPC CLASS</div>
      <div v-if="readonly" class="heading h2 ml-2 mt-n2 text-accent">
        {{
          item.NpcClassController?.HasClass ? item.NpcClassController.Class.Name : 'Set NPC Class'
        }}
      </div>
      <v-btn
        v-else
        size="large"
        block
        :color="!item.NpcClassController?.HasClass ? 'error' : 'accent'"
        variant="tonal"
        class="px-12"
        @click="($refs.classSelector as any).show()">
        {{
          item.NpcClassController?.HasClass ? item.NpcClassController.Class.Name : 'No NPC Class'
        }}
      </v-btn>
      <npc-class-selector ref="classSelector" :item="item" />
    </v-col>
    <v-col cols="auto">
      <div class="text-caption mb-1">NPC TAG</div>
      <npc-tag-selector :readonly="readonly" :item="item" />
    </v-col>
  </v-row>

  <div v-if="item.NpcClassController?.HasClass">
    <npc-template-selector :readonly="readonly" :item="item" />
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
    readonly: { type: Boolean, default: false },
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
            Number(a.Stats.Stat(key, this.selectedTier)) -
            Number(b.Stats.Stat(key, this.selectedTier)),
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
