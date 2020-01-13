<template>
  <card-base
    :item="item"
    :active="active"
    :readonly="readonly"
    @remove-feature="$emit('remove-feature', $event)"
  >
    <div>
      <span v-if="item.Tier" class="heading h3">
        +{{ item.Feature.Accuracy(item.Tier) }}
        Attack Bonus
      </span>
      <span v-else class="heading h3">
        +{{ item.Feature.Accuracy(1) }} / +{{ item.Feature.Accuracy(2) }} / +{{
          item.Feature.Accuracy(3)
        }}
        Attack Bonus
      </span>
      <span style="float: right" class="heading h3">{{ item.Feature.TechType }} TECH</span>
    </div>
    <span class="overline">EFFECT</span>
    <p v-if="item.Tier" class="body-1 mb-0" v-html="item.Feature.EffectByTier(item.Tier)" />
    <p v-else class="body-1 mb-0" v-html="item.Feature.Effect" />
    <cc-tags v-if="item.Feature.Tags" :tags="item.Feature.Tags" small />
  </card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CardBase from './_CardBase.vue'

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
    active: {
      type: Boolean,
    },
  },
})
</script>
