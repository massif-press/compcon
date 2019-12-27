<template>
  <card-base :item="item" :readonly="readonly" @remove-feature="$emit('remove-feature', $event)">
    <span class="overline">EFFECT</span>
    <p v-if="item.Tier" class="body-1 mb-0" v-html="item.Feature.EffectByTier(item.Tier)" />
    <p v-else class="body-1 mb-0" v-html="item.Feature.Effect" />
    <cc-tags :tags="item.Feature.Tags" small />
  </card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CardBase from './CardBase.vue'

export default Vue.extend({
  name: 'npc-trait-card',
  components: { CardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
})
</script>
