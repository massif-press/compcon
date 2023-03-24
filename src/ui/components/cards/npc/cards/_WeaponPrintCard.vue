<template>
  <print-card-base :item="item">
    <v-row slot="top" no-gutters justify="space-between">
      <v-col cols="auto" class="heading h4" v-text="item.Name" />
      <v-col cols="auto">
        <span class="heading h4">
          <cc-range-element small :range="item.Feature.Range" />
        </span>
      </v-col>
      <v-col cols="auto">
        <span class="heading h4">
          <cc-damage-element small :damage="item.Feature.Damage(item.Tier)" />
        </span>
      </v-col>
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
    <div
      v-if="item.Feature.OnAttack"
      class="caption"
      v-html="`<b>On Attack:</b> ${item.Feature.OnAttack}`"
    />
    <div
      v-if="item.Feature.OnCrit"
      class="caption"
      v-html="`<b>On Crit:</b> ${item.Feature.OnCrit}`"
    />
    <div
      v-if="item.Feature.OnHit"
      class="caption"
      v-html="`<b>On Hit:</b> ${item.Feature.OnHit}`"
    />
    <div
      v-if="item.Feature.Effect"
      class="caption"
      v-html="`<b>Effect:</b> ${item.Feature.Effect}`"
    />
  </print-card-base>
</template>

<script lang="ts">
import PrintCardBase from './_PrintCardBase.vue';

export default {
  name: 'npc-weapon-print-card',
  components: { PrintCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
