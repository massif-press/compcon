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
          @deploy="$emit('deploy', $event)" />
      </v-card-text>
    </div>
    <equip-command-panel
      :controller="pilot.CombatController"
      :item="item" />
  </v-card>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Pilot } from '@/classes/pilot/Pilot'
import { useDisplay } from 'vuetify'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import PilotEquipCardBody from './_PilotEquipCardBody.vue'
import EquipCommandPanel from './_equipCommandPanel.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'

defineOptions({ name: 'PilotWeaponCombatCard' })

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  item: object
  pilot: Pilot
}>()

defineEmits<{ deploy: [] }>()

const { smAndDown: mobile, xs: portrait } = useDisplay()

const EquipmentDestroyedOverlay = DestroyedOverlay
const EquipmentFlavorDescription = FlavorDescription
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
