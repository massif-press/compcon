<template>
  <v-card-text>
    <div v-if="item.Description">
      <cc-titled-divider title="Description" class="mt-n4" />
      <v-card variant="tonal" class="mt-1"
        ><v-card-text class="pa-2" v-html-safe="item.Description"
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

    <div v-if="item.ClassFeatureSelectionInfo || item.FeatureSelectionInfo">
      <cc-titled-divider title="Feature Selection" />
      <v-card variant="tonal" class="mt-1">
        <v-card-text
          v-if="item.ClassFeatureSelectionInfo"
          class="pa-2"
          v-html-safe="item.ClassFeatureSelectionInfo" />
        <v-card-text
          v-if="item.FeatureSelectionInfo"
          class="pa-2"
          v-html-safe="item.FeatureSelectionInfo" />
      </v-card>
      <br />
    </div>

    <div v-if="item.BaseFeatures.length > 0">
      <cc-titled-divider
        title="Template Base Features"
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
    </div>

    <div v-if="item.OptionalFeatures.length > 0">
      <cc-titled-divider
        title="Template Optional Features"
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
    </div>
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'cc-frame-card',
  props: {
    item: {
      type: Object,
      required: true,
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
