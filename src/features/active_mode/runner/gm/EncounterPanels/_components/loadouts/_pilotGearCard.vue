<template>
  <v-card
    flat
    tile>
    <v-card-text
      class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <DestroyedOverlay :destroyed="item.Destroyed" />

      <FlavorDescription :description="item.FlavorDescription" />

      <div v-if="item">
        <div v-if="item.Effect">
          <p
            v-html-safe="item.Effect"
            class="mb-1 px-2" />
        </div>

        <p
          v-html-safe="item.Description"
          class="mb-1 px-2" />

        <ActionsDeployables
          :item="item"
          :actor="pilot"
          :owner="owner"
          :encounter-instance="encounterInstance"
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
import { computed } from 'vue'
import { useMobile } from '@/composables/useMobile'
import DeployButton from './_deployButton.vue'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { externalPilotItemBonuses } from '@/composables/useExternalItemBonuses'

const props = defineProps({
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
    encounterInstance: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
  })

const emit = defineEmits(['deploy'])

const { mobile, portrait } = useMobile()

</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
