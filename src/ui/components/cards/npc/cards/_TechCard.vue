<template>
  <card-base
    :item="item"
    :active="active"
    :readonly="readonly"
    @remove-feature="$emit('remove-feature', $event)"
    @recalc="$emit('recalc')"
  >
    <v-row class="heading h3 text-center" density="compact" no-gutters>
      <v-col cols="auto">
        <span v-if="item.Tier" class="heading h3">
          <v-icon icon="cc:reticule" />
          +{{ item.Feature.AttackBonus(item.Tier) }}
          Attack Bonus
        </span>
        <span v-else class="heading h3">
          <v-icon icon="cc:reticule" />
          +{{ item.Feature.AttackBonus(1) }} / +{{ item.Feature.AttackBonus(2) }} / +{{
            item.Feature.AttackBonus(3)
          }}
          Attack Bonus
        </span>
      </v-col>
      <v-divider vertical class="mx-4" />
      <v-col>
        <span v-if="item.Tier" class="heading h3">
          <div v-if="item.Feature.Accuracy(item.Tier) > 0">
            <v-icon icon="cc:accuracy" />
            +{{ item.Feature.Accuracy(item.Tier) }}
            Accuracy
          </div>
          <div v-else-if="item.Feature.Accuracy(item.Tier) < 0">
            <v-icon icon="cc:difficulty" />
            +{{ Math.abs(item.Feature.Accuracy(item.Tier)) }}
            Difficulty
          </div>
        </span>
        <span v-else class="heading h3">
          <div v-if="item.Feature.Accuracy(1) > 0">
            <v-icon icon="cc:accuracy" />
            +{{ item.Feature.Accuracy(1) }} / +{{ item.Feature.Accuracy(2) }} / +{{
              item.Feature.Accuracy(3)
            }}
            Accuracy
          </div>
          <div v-else-if="item.Feature.Accuracy(1) < 0">
            <v-icon icon="cc:difficulty" />
            +{{ Math.abs(item.Feature.Accuracy(1)) }} / +{{ Math.abs(item.Feature.Accuracy(2)) }} /
            +{{ Math.abs(item.Feature.Accuracy(3)) }}
            Difficulty
          </div>
        </span>
      </v-col>
      <v-divider vertical class="mx-4" />
      <v-col>
        <!-- <span v-if="item.AttackBonus" class="mx-3">&nbsp;|&nbsp;</span> -->
        <span style="float: right" class="heading h3">{{ item.Feature.TechType }} TECH</span>
      </v-col>
    </v-row>
    <span class="text-overline">EFFECT</span>
    <p v-if="item.Tier" v-html-safe="item.Feature.EffectByTier(item.Tier)" class="body-1 mb-0" />
    <p v-else v-html-safe="item.Feature.Effect" class="body-1 mb-0" />
    <cc-tags v-if="item.Feature.Tags" :tags="item.Feature.Tags" small />
  </card-base>
</template>

<script lang="ts">
import CardBase from './_CardBase.vue';

export default {
  name: 'npc-tech-card',
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
};
</script>
