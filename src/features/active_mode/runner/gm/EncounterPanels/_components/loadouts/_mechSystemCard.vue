<template>
  <v-card flat
    tile>
    <v-card-text class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <DestroyedOverlay :destroyed="item.Destroyed" />

      <FlavorDescription :description="item.FlavorDescription" />

      <cc-alert v-if="integrated && item.IntegratedOrigin"
        class="mt-2"
        icon="mdi-link">
        <div class="text-cc-overline">
          Integrated Equipment
          <cc-slashes />
          <v-icon :icon="item.IntegratedOrigin.Icon"
            class="pb-1" />
          {{ item.IntegratedOrigin.Name }}
        </div>
      </cc-alert>

      <v-table v-if="item && item.Ammo && item.Ammo.length"
        class="mt-2"
        hover
        density="compact">
        <tbody>
          <tr v-for="(a, index) in item.Ammo"
            :key="`ammo-${index}`">
            <td v-if="!portrait"
              style="min-width: 120px"
              class="text-accent">
              <v-icon icon="cc:ammo"
                size="small"
                class="mt-n1 mr-1" />
              <b>{{ a.name }}</b>
            </td>
            <td>
              <div v-if="portrait"
                class="text-accent">
                <v-icon icon="cc:ammo"
                  size="small"
                  start />
                <b>{{ a.name }}</b>
              </div>
              <span v-html-safe="a.detail" />
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="item">
        <div v-if="item.Effect">
          <p v-html-safe="item.Effect"
            class="mb-1 px-2" />
        </div>

        <ActionsDeployables :item="item"
          :actor="mech"
          action-icon="cc:system"
          @deploy="$emit('deploy', $event)" />

        <v-row dense
          align="center">
          <v-col cols="auto">
            <cc-tags v-if="item.Tags"
              :tags="item.Tags"
              color="pilot"
              :bonus="mech.LimitedBonus"
              combat />
          </v-col>
          <v-col cols="auto"
            class="ml-auto mr-4">
            <cc-bonus :bonuses="item.Bonuses"
              chip />
            <cc-bonus :bonuses="externalItemBonuses(mech, item)" />
            <cc-synergy-display :item="item"
              :location="synergyLocation"
              :mech="mech"
              large />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <equip-command-panel :controller="mech.CombatController"
      :item="item" />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEncounterContext } from '../../encounterContext'
import { useDisplay } from 'vuetify'
import { ItemType } from '@/classes/enums'
import EquipCommandPanel from './_equipCommandPanel.vue'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { externalItemBonuses } from '@/composables/useExternalItemBonuses'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { Mech } from '@/classes/mech/Mech'
import { MechSystem } from '@/classes/mech/components/equipment/MechSystem'

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps({
  item: {
    type: MechSystem,
    required: true,
  },
  integrated: {
    type: Boolean,
    default: false,
  },
  mech: {
    type: Mech,
    required: true,
  },
})

defineEmits(['deploy'])

const { xs: portrait } = useDisplay()

const synergyLocation = computed(() => {
  if (!props.item) return 'none'
  return props.item.ItemType === ItemType.MechWeapon ? 'weapon' : 'system'
})
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
