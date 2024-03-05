<template>
  <v-card-text>
    <div v-if="item.Appearance">
      <cc-titled-divider title="Reported Appearances" class="mt-n4" />
      <v-card variant="tonal" class="mt-1"
        ><v-card-text class="pa-2" v-html-safe="item.Appearance"
      /></v-card>
      <br />
    </div>
    <div v-if="item.Hints">
      <cc-titled-divider title="Hints" />
      <v-card variant="tonal" class="mt-1"
        ><v-card-text class="pa-2" v-html-safe="item.Hints"
      /></v-card>
      <br />
    </div>
    <div v-if="item.Rules">
      <cc-titled-divider title="Rules" />
      <v-card variant="tonal" class="mt-1"
        ><v-card-text class="pa-2" v-html-safe="item.Rules"
      /></v-card>
      <br />
    </div>

    <div v-if="item.Features.length > 0">
      <cc-titled-divider title="Features" :subtitle="`(${item.Features.length})`" class="mt-2" />
      <v-row dense>
        <cc-dense-card
          v-for="b in item.Features"
          :item="b"
          class="my-1"
          :min-width="getMinWidth(b)"
          :tier="tier"
          full-height />
      </v-row>
    </div>

    <div v-if="item.Shards" class="mt-2">
      <cc-titled-divider
        title="Shards"
        :subtitle="`&emsp; New Shards: ${item.Shards.CountString}`" />
      <v-card variant="tonal" class="mt-1"
        ><v-card-text class="pa-2" v-html-safe="item.Shards.Detail"
      /></v-card>
      <div v-if="item.Shards.Features.length > 0">
        <cc-titled-divider
          title="Shard Features"
          :subtitle="`(${item.Shards.Features.length})`"
          class="mt-2" />
        <v-row dense>
          <cc-dense-card
            v-for="b in item.Shards.Features"
            :item="b"
            class="my-1"
            :min-width="getMinWidth(b)"
            :tier="tier"
            full-height />
        </v-row>
      </div>
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
    tier: {
      type: Number,
      required: false,
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
