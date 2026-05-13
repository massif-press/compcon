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
        <class-combat-chart :npc-class="item" />
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

<script lang="ts">
import ClassCombatChart from './_components/_NpcClassCombatChart.vue';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'CcFrameCard',
  components: {
    ClassCombatChart,
  },
  mixins: [useMobile],
  props: {
    item: { type: Object, required: true },
    notes: { type: Boolean },
    smallTags: { type: Boolean },
    dense: { type: Boolean },
    charts: { type: Boolean },
    collapseActions: { type: Boolean },
    tier: { type: Number },
  },
  data: () => ({
    statArr: [
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
    ],
  }),
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>
