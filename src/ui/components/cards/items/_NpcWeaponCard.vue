<template>
  <equipment-card-base :item="item" :dense="dense" small-tags :footer="dense" :tier="tier">
    <v-row dense justify="space-around" class="text-center" align="center">
      <v-col :cols="dense ? 'auto' : ''">
        <cc-range-element :range="item.Range" :small="dense" />
      </v-col>
      <v-col v-if="item.Damage(0).length" :cols="dense ? 'auto' : ''" :class="dense ? '' : 'mt-n2'">
        <div :class="dense ? '' : 'heading h1'">
          <div v-if="tier">
            <cc-damage-element :damage="item.Damage(tier)" inline :small="dense" />
          </div>
          <div v-else>
            <cc-damage-element :damage="item.Damage(1)" inline :small="dense" />
            <span class="text-disabled">/</span>
            <cc-damage-element :damage="item.Damage(2)" inline :small="dense" />
            <span class="text-disabled">/</span>
            <cc-damage-element :damage="item.Damage(3)" inline :small="dense" />
          </div>
        </div>
      </v-col>
      <v-col :cols="dense ? 'auto' : ''">
        <div class="heading" :style="dense ? '' : 'font-size: 24pt'">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon :size="dense ? '20' : '35'" :start="!dense" class="mt-n1" v-bind="props">
                cc:reticle
              </v-icon>
            </template>
            <span>Attack Bonus</span>
          </v-tooltip>
          <span v-if="tier">
            +
            <b>{{ item.AttackBonus(tier) }}</b>
          </span>
          <span v-else v-for="n in 3">
            +
            <b>{{ item.AttackBonus(n) }}</b>
            {{ n < 3 ? '&nbsp;/' : '' }}
          </span>
          <div v-if="!dense" class="text-overline" style="line-height: 0; margin-top: 2px">
            Attack Bonus
          </div>
        </div>
      </v-col>
      <v-col v-if="item.HasAccuracy" :cols="dense ? 'auto' : ''">
        <div class="heading" :style="dense ? '' : 'font-size: 24pt'">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                :size="dense ? '20' : '45'"
                :start="!dense"
                class="mt-n1"
                v-bind="props"
                :icon="item.Accuracy(1) < 0 ? 'cc:difficulty' : 'cc:accuracy'" />
            </template>
            <span>{{ item.Accuracy(1) < 0 ? 'Difficulty' : 'Accuracy' }}</span>
          </v-tooltip>
          <span v-if="tier">
            +
            <b>{{ item.Accuracy(tier) }}</b>
          </span>
          <span v-else v-for="n in 3">
            +
            <b>{{ item.Accuracy(n) }}</b>
            {{ n < 3 ? '&nbsp;/' : '' }}
          </span>
          <div v-if="!dense" class="text-overline" style="line-height: 14px; margin-top: 2px">
            {{ item.Accuracy(1) < 0 ? 'Difficulty' : 'Accuracy' }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-alert
      v-if="item.Attacks && item.Attacks.some((x) => x > 1)"
      density="compact"
      prominent
      variant="tonal"
      icon="cc:weapon"
      class="my-1">
      This weapon can make
      <b class="text-accent">{{ tier ? item.Attacks[tier - 1] : item.Attacks.join(' / ') }}</b>
      attacks at a time. Multiple attacks may be made against the same or different targets.
    </v-alert>
    <p
      v-if="item.OnHit"
      slot="statblock"
      v-html-safe="`<b>On Hit:&nbsp;</b>${item.OnHit}`"
      class="panel text-text py-1" />
    <p
      v-if="item.OnCrit"
      slot="statblock"
      v-html-safe="`<b>On Hit:&nbsp;</b>${item.OnHit}`"
      class="panel text-text py-1" />
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-npc-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapseActions: {
      type: Boolean,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
