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
            Pilot Armor
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <v-icon size="18"
          class="mt-n1"
          icon="mdi-shield"
          end />
        <span class="heading h4"> {{ item.ArmorString }} </span>
        <v-icon size="19"
          class="mt-n1"
          end
          icon="mdi-heart" />
        <span class="heading h4"> {{ item.HpString }} </span>
        <v-icon size="small"
          class="mt-n1"
          end
          icon="cc:edef" />
        <span class="heading h4"> {{ item.EdefString }} </span>
        <v-icon size="small"
          class="mt-n1"
          end
          icon="cc:evasion" />
        <span class="heading h4"> {{ item.EvasionString }} </span>
        <v-icon size="small"
          end
          icon="mdi-arrow-right-bold-hexagon-outline" />
        <span class="heading h4"> {{ item.SpeedString }} </span>
      </v-col>
    </v-row>

    <div class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <equipment-flavor-description :description="item.FlavorDescription" />

        <pilot-equip-card-body :item="item"
          :pilot="pilot"
          @deploy="$emit('deploy', $event)" />
      </v-card-text>
    </div>
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

defineOptions({ name: 'PilotArmorCombatCard' })

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
