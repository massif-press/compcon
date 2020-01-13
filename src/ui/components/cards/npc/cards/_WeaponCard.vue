<template>
  <card-base
    :item="item"
    :active="active"
    :readonly="readonly"
    @remove-feature="$emit('remove-feature', $event)"
  >
    <v-row class="heading h3 text-center" dense no-gutters>
      <v-col :class="`${item.Feature.DamageType}--text`">
        <span v-if="item.Tier" class="heading h3">
          {{ item.Feature.Damage(item.Tier) }}
          {{ item.Feature.DamageType }} Damage
        </span>
        <span v-else>
          {{ item.Feature.Damage(1) }} / {{ item.Feature.Damage(2) }} /
          {{ item.Feature.Damage(3) }} {{ item.Feature.DamageType }} Damage
        </span>
      </v-col>
      <v-divider vertical />
      <v-col>
        <span v-if="item.Tier" class="heading h3">
          +{{ item.Feature.Accuracy(item.Tier) }}
          Attack Bonus
        </span>
        <span v-else>
          +{{ item.Feature.Accuracy(1) }} / +{{ item.Feature.Accuracy(2) }} / +{{
            item.Feature.Accuracy(3)
          }}
          Attack Bonus
        </span>
      </v-col>
      <v-divider vertical />
      <v-col>
        <span v-if="item.Tier" class="heading h3">
          +{{ item.Feature.Advantage(item.Tier) }}
          Accuracy Bonus
        </span>
        <span v-else>
          +{{ item.Feature.Advantage(1) }} / +{{ item.Feature.Advantage(2) }} / +{{
            item.Feature.Advantage(3)
          }}
          Accuracy Bonus
        </span>
      </v-col>
    </v-row>
    <div v-if="item.Feature.OnHit">
      <span class="overline">ON HIT</span>
      <p else class="body-1 mb-0" v-html="item.Feature.OnHit" />
    </div>
    <div v-if="item.Feature.Effect">
      <span class="overline">EFFECT</span>
      <p v-if="item.Tier" class="body-1 mb-0" v-html="item.Feature.EffectByTier(item.Tier)" />
      <p v-else class="body-1 mb-0" v-html="item.Feature.Effect" />
    </div>
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
