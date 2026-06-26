<template>
  <div>
  <div class="heading"> {{ combatant.actor.CombatController.CombatName }}{{ possessive }}
    {{ $t('active.pcDeploy.deployedEquipment') }}: </div>
  <v-card class="pb-2 px-2">
    <v-row v-if="combatant.deployables.length"
      dense>
      <v-col v-for="d in combatant.deployables"
        :key="d.id"
        cols="12"
        md="6"
        lg="4"
        xl="2">
        <deployable-list-item :key="d.id"
          :selected="!!selected && selected.ID === d.ID"
          :parent="combatant"
          :deployable="d"
          :encounter-instance="encounterInstance"
          @click="select(d)"
          @activate="$emit('activate', $event)" />
      </v-col>
    </v-row>
    <div v-else
      class="text-disabled pa-4 text-center">
      <i>{{ $t('active.pcDeploy.noActive') }}</i>
    </div>
  </v-card>
  <v-scroll-x-reverse-transition>
    <v-card v-if="selected"
      :key="`${selected.ID}-panel`"
      class="mt-4 pa-2"
      flat
      tile>
      <div class="heading h2">{{ selected.Name }}</div>
      <v-divider class="mt-2 mb-4" />
      <deployable-panel :combatant="selected"
        :encounter-instance="sheet"
        :parent="combatant"
        @deselect="selected = null" />
    </v-card>
    <v-card v-else
      class="mt-4"
      flat
      tile>
      <v-card-text class="text-disabled text-center">
        <i>{{ $t('active.pcDeploy.noSelected') }}</i>
      </v-card-text>
    </v-card>
  </v-scroll-x-reverse-transition>
  </div>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed, ref } from 'vue'
import DeployableListItem from '../../gm/_components/ListItems/DeployableListItem.vue';
import DeployablePanel from '../../gm/EncounterPanels/DeployablePanel.vue';

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
  sheet: object
}>()

const emit = defineEmits<{
  'activate': [payload: any]
}>()

const selected = ref(null)

const possessive = computed(() => {
      return props.combatant.actor.Name.endsWith('s') ? `'` : `'s`;
    })

function select(deployable) {
      selected.value = deployable;
    }
</script>
