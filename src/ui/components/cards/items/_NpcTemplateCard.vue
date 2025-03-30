<template>
  <v-card-text class="pt-0" :class="{ 'px-0': mobile }">
    <cc-panel v-if="item.Description" title="Description" :title-color="item.Color" class="mb-2">
      <p v-html-safe="item.Description" />
    </cc-panel>

    <cc-panel v-if="item.Tactics" title="Tactics" :title-color="item.Color" class="mb-2">
      <p v-html-safe="item.Tactics" />
    </cc-panel>

    <cc-panel
      v-if="item.ClassFeatureSelectionInfo || item.FeatureSelectionInfo"
      title="Feature Selection"
      :title-color="item.Color"
      class="mb-2">
      <p v-html-safe="item.ClassFeatureSelectionInfo" />
      <p v-html-safe="item.FeatureSelectionInfo" />
    </cc-panel>

    <div v-if="item.BaseFeatures.length > 0">
      <cc-heading small line dense>
        Template Base Features
        <span class="text-caption text-disabled">({{ item.BaseFeatures.length }})</span>
      </cc-heading>

      <masonry-wall
        :items="item.BaseFeatures"
        :column-width="400"
        :gap="16"
        :min-columns="1"
        :max-columns="widescreen ? 3 : 2">
        <template #default="{ item }">
          <cc-dense-card :item="item" />
        </template>
      </masonry-wall>
    </div>

    <div v-if="item.OptionalFeatures.length > 0">
      <cc-heading small line dense>
        Template Optional Features
        <span class="text-caption text-disabled">({{ item.OptionalFeatures.length }})</span>
      </cc-heading>

      <masonry-wall
        :items="item.OptionalFeatures"
        :column-width="400"
        :gap="16"
        :min-columns="1"
        :max-columns="widescreen ? 3 : 2">
        <template #default="{ item }">
          <cc-dense-card :item="item" />
        </template>
      </masonry-wall>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>
