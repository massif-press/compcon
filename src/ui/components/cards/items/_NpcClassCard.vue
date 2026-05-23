<template>
  <v-card-text class="pt-0"
    :class="{ 'px-0': mobile }">
    <v-row>
      <v-col>
        <div class="heading h3 mb-2">
          {{ item.Role }}
        </div>

        <div>
          <cc-panel v-if="item.Flavor"
            title="Description"
            :title-color="item.Color"
            class="mb-2">
            <p v-html-safe="item.Flavor" />
          </cc-panel>
          <cc-panel v-if="item.Tactics"
            title="Tactics"
            :title-color="item.Color"
            class="mb-2">
            <p v-html-safe="item.Tactics" />
          </cc-panel>
          <cc-panel v-if="item.ClassFeatureSelectionInfo"
            title="Feature Selection"
            :title-color="item.Color"
            class="mb-2">
            <p v-html-safe="item.ClassFeatureSelectionInfo" />
          </cc-panel>
        </div>
      </v-col>
      <v-col v-if="!mobile"
        cols="4">
        <class-combat-chart :npc-class="item" :npc-classes="npcClasses" />
      </v-col>
    </v-row>

    <cc-heading small
      line
      dense>Class Stats</cc-heading>
    <div class="text-cc-overline text-center mt-n3">
      <v-chip size="x-small"
        tile>T1 / T2 / T3</v-chip>
    </div>

    <v-row dense
      justify="space-around">
      <cc-tiered-attribute v-for="i in statArr"
        :key="i"
        :title="i"
        :arr="item.Stats.StatArr(i)" />
    </v-row>

    <cc-heading small
      line
      dense>
      Class Base Features
      <span class="text-caption text-disabled">({{ item.BaseFeatures.length }})</span>
    </cc-heading>

    <cc-masonry-grid :items="item.BaseFeatures">
      <template #default="{ item }">
        <cc-dense-card :item="item" />
      </template>
    </cc-masonry-grid>

    <cc-heading small
      line
      dense>
      Class Optional Features
      <span class="text-caption text-disabled">({{ item.OptionalFeatures.length }})</span>
    </cc-heading>

    <cc-masonry-grid :items="item.OptionalFeatures">
      <template #default="{ item }">
        <cc-dense-card :item="item"
          class="my-1"
          full-height />
      </template>
    </cc-masonry-grid>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import ClassCombatChart from './_components/_NpcClassCombatChart.vue'

const npcClasses = computed(() => CompendiumStore().NpcClasses)

const { smAndDown: mobile } = useDisplay()

defineProps<{
  item: object
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()

const statArr = ref([
  'Hull',
  'Agility',
  'Systems',
  'Engineering',
  'Size',
  'Armor',
  'HP',
  'Heat',
  'Evasion',
  'Edef',
  'Speed',
  'Sensor',
  'Save',
])
</script>
