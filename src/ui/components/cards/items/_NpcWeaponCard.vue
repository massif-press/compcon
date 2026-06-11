<template>
  <equipment-card-base :item="item"
    :dense="dense"
    small-tags
    :footer="dense"
    :tier="tier">
    <v-row dense
      justify="space-around"
      class="text-center"
      align="center">
      <v-col cols="auto">
        <cc-range-element :range="item.Range(tier || 1)"
          :small="dense" />
      </v-col>
      <v-col v-if="item.Damage(0).length"
        cols="auto"
        :class="dense ? '' : 'mt-n2'">
        <div :class="dense ? '' : 'heading h1'">
          <div v-if="tier">
            <cc-damage-element :damage="item.Damage(tier)"
              inline
              :small="dense" />
          </div>
          <v-row v-else
            no-gutters>
            <v-col cols="auto">
              <cc-damage-element :damage="item.Damage(1)"
                inline
                :small="dense" />
            </v-col>
            <v-col cols="auto"
              style="width: 8px; margin-left: 3px; margin-right: 3px;">
              <v-divider vertical
                style="height: 50%; rotate: 8deg;" />
            </v-col>
            <v-col cols="auto">
              <cc-damage-element :damage="item.Damage(2)"
                inline
                :small="dense" />
            </v-col>
            <v-col cols="auto"
              style="width: 8px; margin-left: 3px; margin-right: 3px;">
              <v-divider vertical
                style="height: 50%; rotate: 8deg;" />
            </v-col>
            <v-col cols="auto">
              <cc-damage-element :damage="item.Damage(3)"
                inline
                :small="dense" />
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="auto">
        <v-row class="heading"
          no-gutters
          :style="dense ? '' : 'font-size: 24pt'">
          <v-col cols="auto">
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
          </v-col>
          <v-col v-if="tier"
            cols="auto">
            <b>{{ `${sign(item.AttackBonus(tier))}${item.AttackBonus(tier)}` }}</b>
          </v-col>
          <v-col v-for="n in 3"
            v-else
            :key="`ab-${n}`"
            cols="auto">
            <b>{{ `${sign(item.AttackBonus(n))}${item.AttackBonus(n)}` }}</b>
            <span v-if="n < 3"
              class="text-disabled flavor-text"
              style="font-size: inherit; font-weight: 100;">/</span>
          </v-col>
        </v-row>
        <div v-if="!dense"
          class="text-cc-overline mt-n2">
          {{ $t('common.attackBonus') }}
        </div>
      </v-col>
      <v-col v-if="item.HasAccuracy"
        cols="auto">
        <v-row class="heading"
          no-gutters
          :style="dense ? '' : 'font-size: 24pt'">
          <v-col cols="auto">
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
          </v-col>
          <v-col v-if="tier"
            cols="auto">
            <b>{{ `${sign(item.Accuracy(tier))}${item.Accuracy(tier)}` }}</b>
          </v-col>
          <v-col v-for="n in 3"
            v-else
            :key="`ab-${n}`"
            cols="auto">
            <b>{{ `${sign(item.Accuracy(n))}${item.Accuracy(n)}` }}</b>
            <span v-if="n < 3"
              class="text-disabled flavor-text"
              style="font-size: inherit; font-weight: 100;">/</span>
          </v-col>
        </v-row>
        <div v-if="!dense"
          class="text-cc-overline mt-n2">
          {{ item.Accuracy(1) < 0 ? $t('common.difficulty') : $t('common.accuracy') }}
            </div>
      </v-col>
    </v-row>
    <v-alert v-if="item.Attacks && item.Attacks.some((x) => x > 1)"
      density="compact"
      prominent
      variant="tonal"
      icon="cc:weapon"
      class="my-1">
      <i18n-t keypath="ui.card.weaponAttacks" tag="span" scope="global">
        <template #count><b class="text-accent">{{ tier ? item.Attacks[tier - 1] : item.Attacks.join(' / ') }}</b></template>
      </i18n-t>
    </v-alert>
    <template #statblock>
      <p v-if="item.OnMiss"
        v-html-safe="`<b>On Miss:&nbsp;</b>${item.OnMiss.Detail}`"
        class="panel text-text py-1" />
      <p v-if="item.OnHit"
        v-html-safe="`<b>On Hit:&nbsp;</b>${item.OnHit.Detail}`"
        class="panel text-text py-1" />
      <p v-if="item.OnCrit"
        v-html-safe="`<b>On Crit:&nbsp;</b>${item.OnCrit.Detail}`"
        class="panel text-text py-1" />
    </template>
  </equipment-card-base>
</template>

<script setup lang="ts">
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import EquipmentCardBase from './_EquipmentCardBase.vue'
withDefaults(defineProps<{
  item: NpcWeapon
  dense?: boolean
  collapseActions?: boolean
  tier?: number
}>(), {
  dense: false,
})

function sign(n: number): string {
  return n > 0 ? '+' : ''
}
</script>