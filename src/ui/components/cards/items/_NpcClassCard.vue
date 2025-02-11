<template>
  <v-card-text class="pt-0" :class="{ 'px-0': mobile }">
    <v-row>
      <v-col>
        <div class="heading h3 mb-2">
          {{ item.Role }}
        </div>

        <div>
          <cc-panel v-if="item.Flavor" title="Description" :title-color="item.Color" class="mb-2">
            <p v-html-safe="item.Flavor" />
          </cc-panel>
          <cc-panel v-if="item.Tactics" title="Tactics" :title-color="item.Color" class="mb-2">
            <p v-html-safe="item.Tactics" />
          </cc-panel>
          <cc-panel
            v-if="item.ClassFeatureSelectionInfo"
            title="Feature Selection"
            :title-color="item.Color"
            class="mb-2">
            <p v-html-safe="item.ClassFeatureSelectionInfo" />
          </cc-panel>
        </div>
      </v-col>
      <v-col cols="4" v-if="!mobile">
        <class-combat-chart :npc-class="item" />
      </v-col>
    </v-row>

    <cc-heading small line dense>Class Stats</cc-heading>
    <div class="text-cc-overline text-center mt-n3">
      <v-chip size="x-small" tile>T1 / T2 / T3</v-chip>
    </div>

    <v-row dense justify="space-around">
      <cc-tiered-attribute v-for="i in statArr" :title="i" :arr="item.Stats.StatArr(i)" />
    </v-row>

    <cc-heading small line dense>
      Class Base Features
      <span class="text-caption text-disabled">({{ item.BaseFeatures.length }})</span>
    </cc-heading>

    <masonry-wall
      :items="item.BaseFeatures"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <cc-dense-card :item="item" :collapse-actions="mobile" />
      </template>
    </masonry-wall>

    <cc-heading small line dense>
      Class Optional Features
      <span class="text-caption text-disabled">({{ item.OptionalFeatures.length }})</span>
    </cc-heading>

    <masonry-wall
      :items="item.OptionalFeatures"
      :column-width="400"
      :gap="16"
      :min-columns="1"
      :max-columns="widescreen ? 3 : 2">
      <template #default="{ item }">
        <cc-dense-card :item="item" class="my-1" full-height />
      </template>
    </masonry-wall>
  </v-card-text>
</template>

<script lang="ts">
import ClassCombatChart from './_components/_NpcClassCombatChart.vue';

export default {
  name: 'cc-frame-card',
  components: {
    ClassCombatChart,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
  },
  methods: {
    getMinWidth(b: any) {
      if (b.EffectLength > 600) return '60vw';
      if (b.EffectLength > 400) return '40vw';
      return '30vw';
    },
  },
};
</script>
