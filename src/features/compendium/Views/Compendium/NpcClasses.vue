<template>
  <cc-compendium-browser ref="browser"
    :items="classes"
    item-type="NpcClass"
    :table-headers="headers"
    :tier="selectedTier"
    :options="options"
    view-key="cb-npc-classes"
    @view-change="toggleTieredView">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.npcClasses') }}</div>
      <v-slide-y-transition>
        <div v-if="tieredView"
          class="text-center my-n1">
          <v-btn-toggle v-model="selectedTier"
            density="compact"
            color="secondary-darken-3"
            mandatory
            style="height: 15px">
            <v-btn size="x-small"
              :value="1">{{ $t('compendium.tierN', { n: 1 }) }}</v-btn>
            <v-btn size="x-small"
              :value="2">{{ $t('compendium.tierN', { n: 2 }) }}</v-btn>
            <v-btn size="x-small"
              :value="3">{{ $t('compendium.tierN', { n: 3 }) }}</v-btn>
          </v-btn-toggle>
        </div>
      </v-slide-y-transition>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { NpcClass } from '@/classes/npc/class/NpcClass';
const keymap = {
hull: 'Hull',
agi: 'Agi',
sys: 'Sys',
eng: 'Eng',
armor: 'Armor',
hp: 'HP',
heatcap: 'HeatCap',
evasion: 'Evade',
edef: 'E-Def',
speed: 'Speed',
sensorRange: 'Sensor',
saveTarget: 'Save',
sizes: 'Size',
};

const browser = ref<any>(null)

const selectedTier = ref(1)
const tieredView = ref(false)
const options = ref({
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['lcp', 'role', 'none'],
      initialGroup: 'role',
    })

const classes = computed(() => {
      return orderBy(CompendiumStore().NpcClasses, ['Role', 'Name']);
    })
const headers = computed(() => {
      const h = [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Role', key: 'Icon' },
        { title: 'Name', key: 'Name' },
      ] as any[];
      for (const key in keymap) {
        h.push({
          title: keymap[key],
          key,
          tier: selectedTier.value,
          sortRaw: (a: NpcClass, b: NpcClass) =>
            Number(a.Stats.Stat(key, selectedTier.value)) -
            Number(b.Stats.Stat(key, selectedTier.value)),
          align: 'center',
        });
      }
      (h)
      return h;
    })

function toggleTieredView(evt) {
      tieredView.value = evt === 'table' || evt === 'scatter' || evt === 'bar' || evt === 'compare';
    }
</script>
