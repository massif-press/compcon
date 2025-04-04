<template>
  <v-card-text class="pt-0 mt-0">
    <div v-if="item.Appearance">
      <cc-panel title="Reported Appearances">
        <p v-html-safe="item.Appearance" />
      </cc-panel>
    </div>
    <div v-if="item.Hints">
      <cc-panel title="Hints">
        <p v-html-safe="item.Hints" />
      </cc-panel>
    </div>
    <div v-if="item.Rules">
      <cc-panel title="Rules">
        <p v-html-safe="item.Rules" />
      </cc-panel>
    </div>

    <div v-if="item.Features.length > 0">
      <cc-titled-divider
        color="accent"
        title="Features"
        :subtitle="`(${item.Features.length})`"
        class="mt-2" />
      <masonry-wall
        :items="item.Features"
        :column-width="400"
        :gap="16"
        :min-columns="1"
        :max-columns="widescreen ? 3 : 2">
        <template #default="{ item }">
          <cc-dense-card :item="item" class="my-1" :tier="tier" />
        </template>
      </masonry-wall>
    </div>

    <div v-if="item.Shards" class="mt-2">
      <cc-titled-divider
        title="Shards"
        color="accent"
        :subtitle="`&emsp; New Shards: ${item.Shards.CountString}`" />
      <cc-panel title="Reported Appearances">
        <p v-html-safe="item.Shards.Detail" />
      </cc-panel>
      <div v-if="item.Shards.Features.length > 0">
        <cc-titled-divider
          variant="tonal"
          title="Shard Features"
          :subtitle="`(${item.Shards.Features.length})`"
          class="mt-2" />
        <cc-dense-card v-for="b in item.Shards.Features" :item="b" class="my-1" :tier="tier" />
      </div>
    </div>
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'cc-eidolon-layer-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>
