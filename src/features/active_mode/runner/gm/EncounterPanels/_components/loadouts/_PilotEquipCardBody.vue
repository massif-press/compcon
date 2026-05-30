<template>
  <div v-if="item">
    <div v-if="item.Effect">
      <p v-html-safe="item.Effect"
        class="mb-1 px-2" />
    </div>

    <equipment-actions-deployables :item="item"
      :actor="pilot"
      :owner="owner"
      :encounter="encounter"
      action-icon="cc:weapon"
      @deploy="$emit('deploy', $event)" />

    <v-row dense
      align="center">
      <v-col cols="auto">
        <cc-tags v-if="item.Tags"
          combat
          :tags="item.Tags"
          color="pilot"
          :bonus="pilot.LimitedBonus" />
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { externalPilotItemBonuses } from '@/composables/useExternalItemBonuses'

const props = defineProps<{
  item: object
  pilot: object
  encounter: object
  owner: object
}>()

const emit = defineEmits<{
  'deploy': []
}>()
</script>
