<template>
  <equipment-card-base :item="item"
    :dense="dense"
    small-tags
    :footer="dense"
    :tier="tier">
    <v-row v-if="item.HasAttackBonus && item.HasAccuracy"
      justify="space-around"
      class="text-center pb-1"
      align="center">
      <v-col v-if="item.HasAttackBonus"
        :cols="dense ? 'auto' : ''">
        <div class="heading"
          :style="dense ? '' : 'font-size: 24pt'">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon :size="dense ? '20' : '35'"
                :start="!dense"
                class="mt-n1"
                v-bind="props">
                cc:reticle
              </v-icon>
            </template>
            <span>{{ $t('common.attackBonus') }}</span>
          </v-tooltip>
          <span v-if="tier">
            +
            <b>{{ item.AttackBonus(tier) }}</b>
          </span>
          <span v-for="n in 3"
            v-else
            :key="`ab-${n}`">
            +
            <b>{{ item.AttackBonus(n) }}</b>
            <template v-if="n < 3">&nbsp;/</template>
              </span>
              <div v-if="!dense"
                class="text-overline"
                style="line-height: 14px; margin-top: 2px">
                {{ $t('common.attackBonus') }}
              </div>
        </div>
      </v-col>
      <v-col v-if="item.HasAccuracy"
        :cols="dense ? 'auto' : ''">
        <div class="heading"
          :style="dense ? '' : 'font-size: 24pt'">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon :size="dense ? '20' : '45'"
                :start="!dense"
                class="mt-n1"
                v-bind="props"
                :icon="item.Accuracy(1) < 0 ? 'cc:difficulty' : 'cc:accuracy'" />
            </template>
            <span>{{ item.Accuracy(1) < 0 ? $t('common.difficulty') : $t('common.accuracy') }}</span>
          </v-tooltip>
          <span v-if="tier">
            +
            <b>{{ item.Accuracy(tier) }}</b>
          </span>
          <span v-for="n in 3"
            v-else
            :key="`acc-${n}`">
            +
            <b>{{ item.Accuracy(n) }}</b>
            <template v-if="n < 3">&nbsp;/</template>
              </span>
              <div v-if="!dense"
                class="text-overline"
                style="line-height: 14px; margin-top: 2px">
                {{ item.Accuracy(1) < 0 ? $t('common.difficulty') : $t('common.accuracy') }}
                  </div>
              </div>
      </v-col>
    </v-row>
  </equipment-card-base>
</template>

    <script setup lang="ts">
    import { NpcTech } from '@/classes/npc/feature/NpcItem/NpcTech';
    import EquipmentCardBase from './_EquipmentCardBase.vue'

    withDefaults(defineProps<{
      item: NpcTech
      notes?: boolean
      dense?: boolean
      collapseActions?: boolean
      tier?: number
    }>(), {
      dense: false,
    })
</script>