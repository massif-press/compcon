<template>
  <v-card-text>
    <v-row>
      <v-col>
        <div cols="auto" class="mt-n3 mb-2">
          <v-icon size="30" class="mt-n3" start>{{ item.Icon }}</v-icon>
          <span class="heading h3">{{ item.Role }}</span>
        </div>

        <div>
          <div v-if="item.Flavor">
            <cc-titled-divider title="Description" />
            <v-card variant="tonal" class="mt-1"
              ><v-card-text class="pa-2" v-html-safe="item.Flavor"
            /></v-card>
            <br />
          </div>
          <div v-if="item.Tactics">
            <cc-titled-divider title="Tactics" />
            <v-card variant="tonal" class="mt-1"
              ><v-card-text class="pa-2" v-html-safe="item.Tactics"
            /></v-card>
            <br />
          </div>
          <div v-if="item.ClassFeatureSelectionInfo">
            <cc-titled-divider title="Feature Selection" />
            <v-card variant="tonal" class="mt-1">
              <v-card-text
                v-if="item.ClassFeatureSelectionInfo"
                class="pa-2"
                v-html-safe="item.ClassFeatureSelectionInfo" />
            </v-card>
            <br />
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <class-combat-chart :npc-class="item" />
      </v-col>
    </v-row>

    <cc-titled-divider title="Class Stats" />
    <v-row dense>
      <cc-tiered-attribute v-for="i in statArr" :title="i" :arr="item.Stats.StatArr(i)" />
    </v-row>

    <cc-titled-divider
      title="Class Base Features"
      :subtitle="`(${item.BaseFeatures.length})`"
      class="mt-2" />
    <v-row dense>
      <cc-dense-card
        v-for="b in item.BaseFeatures"
        :item="b"
        class="my-1"
        :min-width="getMinWidth(b)"
        full-height />
    </v-row>

    <cc-titled-divider
      title="Class Optional Features"
      :subtitle="`(${item.OptionalFeatures.length})`"
      class="mt-2" />
    <v-row dense>
      <cc-dense-card
        v-for="f in item.OptionalFeatures"
        :item="f"
        class="my-1"
        :min-width="getMinWidth(f)"
        full-height />
    </v-row>
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
  methods: {
    getMinWidth(b: any) {
      if (b.EffectLength > 600) return '60vw';
      if (b.EffectLength > 400) return '40vw';
      return '30vw';
    },
  },
};
</script>
