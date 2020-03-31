<template>
  <card-base
    :item="item"
    :active="active"
    :readonly="readonly"
    @remove-feature="$emit('remove-feature', $event)"
    @recalc="$emit('recalc')"
  >
    <v-row class="heading h3 text-center" dense no-gutters>
      <v-col cols="auto">
        <span class="heading h3">
          <cc-range-element small :range="item.Feature.Range" />
        </span>
      </v-col>
      <v-divider vertical class="mx-4" />
      <v-col cols="auto">
        <span v-if="item.Tier" class="heading h3">
          <cc-damage-element small :damage="item.Feature.Damage(item.Tier)" />
        </span>
        <span v-else>
          <cc-damage-element small :damage="item.Feature.Damage(1)" />
          /
          <cc-damage-element small :damage="item.Feature.Damage(2)" />
          /
          <cc-damage-element small :damage="item.Feature.Damage(3)" />
        </span>
      </v-col>
      <v-divider vertical class="mx-4" />
      <v-col>
        <span v-if="item.Tier" class="heading h3">
          <v-icon>cci-reticle</v-icon>
          <span v-if="item.Feature.AttackBonus(item.Tier) > 0">+</span>
          {{ item.Feature.AttackBonus(item.Tier) }}
          Attack Bonus
        </span>
        <span v-else>
          <v-icon>cci-reticle</v-icon>
          <span v-if="item.Feature.AttackBonus(1) > 0">+</span>
          {{ item.Feature.AttackBonus(1) }} /
          <span v-if="item.Feature.AttackBonus(2) > 0">+</span>
          {{ item.Feature.AttackBonus(2) }} /
          <span v-if="item.Feature.AttackBonus(3) > 0">+</span>
          {{ item.Feature.AttackBonus(3) }}
          Attack Bonus
        </span>
      </v-col>
      <v-divider vertical />
      <v-col>
        <span v-if="item.Tier" class="heading h3">
          <div v-if="item.Feature.Accuracy(item.Tier) > 0">
            <v-icon>cci-accuracy</v-icon>
            +{{ item.Feature.Accuracy(item.Tier) }}
            Accuracy
          </div>
          <div v-else-if="item.Feature.Accuracy(item.Tier) < 0">
            <v-icon>cci-difficulty</v-icon>
            +{{ Math.abs(item.Feature.Accuracy(item.Tier)) }}
            Difficulty
          </div>
        </span>
        <span v-else>
          <div v-if="item.Feature.Accuracy(1) > 0">
            <v-icon>cci-accuracy</v-icon>
            +{{ item.Feature.Accuracy(1) }} / +{{ item.Feature.Accuracy(2) }} / +{{
              item.Feature.Accuracy(3)
            }}
            Accuracy
          </div>
          <div v-else-if="item.Feature.Accuracy(1) < 0">
            <v-icon>cci-difficulty</v-icon>
            +{{ Math.abs(item.Feature.Accuracy(1)) }} / +{{ Math.abs(item.Feature.Accuracy(2)) }} /
            +{{ Math.abs(item.Feature.Accuracy(3)) }}
            Difficulty
          </div>
        </span>
      </v-col>
      <v-divider vertical />
      <v-col>
        <span style="float: right" class="heading h3">{{ item.Feature.WeaponType }}</span>
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
