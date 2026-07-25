<template>
  <equipment-card-base :item="item"
    :dense="dense">
    <template #title>
      <v-row v-if="item.InLcp">
        <div class="heading h3 text-text">{{ item.LcpName }}</div>
      </v-row>
    </template>
    <template #statblock>
      <v-row dense
        justify="center">
        <cc-statblock-panel icon="mdi-shield"
          :name="$t('stats.armor')"
          :value="item.ArmorString" />
        <cc-statblock-panel icon="mdi-heart"
          :name="$t('common.hpBonus')"
          :value="`+${item.HpString}`" />
        <cc-statblock-panel icon="cc:edef"
          :name="$t('stats.edefense')"
          :value="item.EdefString" />
        <cc-statblock-panel icon="cc:evasion"
          :name="$t('stats.evasion')"
          :value="item.EvasionString" />
        <cc-statblock-panel icon="mdi-arrow-right-bold-hexagon-outline"
          :name="$t('stats.speed')"
          :value="item.SpeedString" />
      </v-row>
    </template>
  </equipment-card-base>
</template>

<script setup lang="ts">
import { PilotArmor } from '@/classes/pilot/components/Loadout/equipment/PilotArmor';
import EquipmentCardBase from './_EquipmentCardBase.vue'

defineProps<{
  item: PilotArmor
  dense?: boolean
}>()
</script>
