<template>
  <v-card
    flat
    tile>
    <v-card-text
      class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <equipment-destroyed-overlay :destroyed="item.Destroyed" />

      <equipment-flavor-description :description="item.FlavorDescription" />

      <div v-if="item">
        <div v-if="item.Effect">
          <p
            v-html-safe="item.Effect"
            class="mb-1 px-2" />
        </div>

        <p
          v-html-safe="item.Description"
          class="mb-1 px-2" />

        <equipment-actions-deployables
          :item="item"
          :actor="pilot"
          :owner="owner"
          :encounter="encounter"
          action-icon="cc:system"
          @deploy="$emit('deploy', $event)" />

        <v-row
          dense
          align="center">
          <v-col cols="auto">
            <cc-tags
              v-if="item.Tags"
              :tags="item.Tags"
              color="pilot"
              :bonus="pilot.LimitedBonus"
              combat />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import DeployButton from './_deployButton.vue'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useMobile } from '@/mixins/useMobile'

export default {
  name: 'PilotGearCombatCard',
  components: {
    DeployButton,
    EquipmentDestroyedOverlay: DestroyedOverlay,
    EquipmentFlavorDescription: FlavorDescription,
    EquipmentActionsDeployables: ActionsDeployables,
  },
  mixins: [useMobile],
  props: {
    item: {
      type: Object,
      required: true,
    },
    integrated: {
      type: Boolean,
      default: false,
    },
    pilot: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
}
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
