<template>
  <v-card flat
    tile>
    <equipment-destroyed-overlay :destroyed="item.Destroyed" />
    <v-row align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div class="mt-n2 pl-1">
          {{ item.Name }}
          <span class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            Pilot Weapon
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <cc-range-element v-if="item.Range"
          small
          :range="item.Range" />
        <cc-slashes v-if="item.Range && item.Damage"
          class="pr-1" />
        <cc-damage-element v-if="item.Damage"
          small
          :damage="item.Damage"
          :type-override="item.DamageTypeOverride" />
      </v-col>
    </v-row>

    <div class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <equipment-flavor-description :description="item.FlavorDescription" />

        <div v-if="item"
          class="pt-1">
          <on-element v-for="action in ['hit', 'crit', 'attack']"
            :key="action"
            :profile="item"
            :action="action" />
        </div>

        <pilot-equip-card-body :item="item"
          :pilot="pilot"
          :encounter="encounter"
          :owner="owner"
          @deploy="$emit('deploy', $event)" />
      </v-card-text>
    </div>
    <equip-command-panel :owner="owner"
      :controller="pilot.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script lang="ts">
import EquipCommandPanel from './_equipCommandPanel.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'
import { pilotEquipCombatCardMixin } from './_pilotEquipCombatCardMixin'

export default {
  name: 'PilotWeaponCombatCard',
  components: { EquipCommandPanel, OnElement },
  mixins: [pilotEquipCombatCardMixin],
}
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
