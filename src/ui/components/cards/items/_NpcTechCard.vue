<template>
  <equipment-card-base
    :item="item"
    :dense="dense"
    :collapse-actions="collapseActions"
    small-tags
    :footer="dense">
    <v-row
      v-if="item.HasAttackBonus && item.HasAccuracy"
      justify="space-around"
      class="text-center pb-1"
      align="center">
      <v-col v-if="item.HasAttackBonus" :cols="dense ? 'auto' : ''">
        <div class="heading" :style="dense ? '' : 'font-size: 24pt'">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon :size="dense ? '20' : '35'" :start="!dense" class="mt-n1" v-bind="props"
                >cc:reticule</v-icon
              >
            </template>
            <span>Attack Bonus</span>
          </v-tooltip>
          <span v-for="n in 3">
            +<b>{{ item.AttackBonus(n) }}</b> {{ n < 3 ? '&nbsp;/' : '' }}
          </span>
          <div v-if="!dense" class="text-overline" style="line-height: 14px; margin-top: 2px">
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
          <span v-for="n in 3">
            +<b>{{ item.Accuracy(n) }}</b> {{ n < 3 ? '&nbsp;/' : '' }}
          </span>
          <div v-if="!dense" class="text-overline" style="line-height: 14px; margin-top: 2px">
            {{ item.Accuracy(1) < 0 ? 'Difficulty' : 'Accuracy' }}
          </div>
        </div>
      </v-col>
    </v-row>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-npc-tech-card',
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
  },
};
</script>
