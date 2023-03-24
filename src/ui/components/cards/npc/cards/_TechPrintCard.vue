<template>
  <print-card-base
    :item="item"
    :active="active"
    :readonly="readonly"
    @remove-feature="$emit('remove-feature', $event)"
    @recalc="$emit('recalc')"
  >
    <v-row slot="top" no-gutters justify="space-between">
      <v-col cols="auto" class="heading h4" v-text="item.Name" />
      <v-col cols="auto">
        <span class="heading h4">
          <v-icon>cc:reticule</v-icon>
          <span v-if="item.Feature.AttackBonus(item.Tier) > 0">+</span>
          {{ item.Feature.AttackBonus(item.Tier) }}
          ATK
        </span>
      </v-col>
      <v-col cols="auto">
        <span class="heading h4">
          <div v-if="item.Feature.Accuracy(item.Tier) > 0">
            <v-icon>cc:accuracy</v-icon>
            +{{ item.Feature.Accuracy(item.Tier) }}
            ACC
          </div>
          <div v-else-if="item.Feature.Accuracy(item.Tier) < 0">
            <v-icon>cc:difficulty</v-icon>
            +{{ Math.abs(item.Feature.Accuracy(item.Tier)) }}
            DIFF
          </div>
        </span>
      </v-col>
    </v-row>
    <div v-html-safe="item.Feature.EffectByTier(item.Tier)" class="pb-1" />
  </print-card-base>
</template>

<script lang="ts">
import PrintCardBase from './_PrintCardBase.vue';

export default {
  name: 'npc-tech-print-card',
  components: { PrintCardBase },
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
};
</script>
