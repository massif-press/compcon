<template>
  <v-card flat
    tile>
    <v-card-text class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <DestroyedOverlay :destroyed="item.Destroyed" />

      <FlavorDescription :description="item.FlavorDescription" />

      <div v-if="item">
        <div v-if="item.Effect">
          <p v-html-safe="item.Effect"
            class="mb-1 px-2" />
        </div>

        <p v-html-safe="item.Description"
          class="mb-1 px-2" />

        <ActionsDeployables :item="item"
          :actor="pilot"
          action-icon="cc:system"
          @deploy="$emit('deploy', $event)" />

        <v-row dense
          align="center">
          <v-col cols="auto">
            <cc-tags v-if="item.Tags"
              :tags="item.Tags"
              color="pilot"
              :bonus="pilot.LimitedBonus"
              combat />
          </v-col>
          <v-col cols="auto"
            class="ml-auto mr-4">
            <cc-bonus v-for="(b, index) in item.Bonuses"
              :key="`bonus-${index}`"
              :bonus="b"
              chip />
            <cc-bonus v-for="(b, index) in externalPilotItemBonuses"
              :key="`ext-bonus-${index}`"
              :bonus="b"
              chip />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import DestroyedOverlay from './_DestroyedOverlay.vue'
import { useEncounterContext } from '../../encounterContext'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { externalPilotItemBonuses } from '@/composables/useExternalItemBonuses'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance.js'
import { PilotGear } from '@/classes/pilot/components/Loadout/equipment/PilotGear.js'
import { Pilot } from '@/classes/pilot/Pilot.js'

const { owner, encounterInstance } = useEncounterContext()

defineProps({
  item: {
    type: PilotGear,
    required: true,
  },
  integrated: {
    type: Boolean,
    default: false,
  },
  pilot: {
    type: Pilot,
    required: true,
  },
})

defineEmits(['deploy'])

</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
