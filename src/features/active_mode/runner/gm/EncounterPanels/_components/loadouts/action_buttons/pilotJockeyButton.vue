<template>
  <combat-action-button
    :action="action">
    <template #default="{ close }">
      <v-row>
        <v-col cols="auto">
          <v-tabs v-model="tab"
            direction="vertical"
            density="compact">
            <v-tab value="jockey">{{ $t('active.jockey.jockey') }}</v-tab>
            <v-divider />
            <div class="pa-2 text-cc-overline text-disabled">{{ $t('active.jockey.available') }}</div>
            <v-tab v-for="item in jockeyActions"
              :key="item.ID"
              :value="item.ID">
              {{ item.Name }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-divider vertical
          class="mr-1" />
        <v-col>
          <v-tabs-window v-model="tab"
            class="px-2">
            <div v-if="tab === 'jockey'">
              <div class="heading h4">{{ action.Name }}</div>
              <p v-html-safe="action.Detail"
                class="text-text pl-2" />
              <v-row dense
                align="center"
                class="my-2">
                <v-col><v-divider /></v-col>
                <v-col class="heading text-disabled"
                  cols="auto">{{ $t('active.jockey.select') }}</v-col>
                <v-col><v-divider /></v-col>
              </v-row>
            </div>

            <div v-else>
              <menu-input :owner="owner" :encounter-instance="encounterInstance" :key="controller.ID"
                :active-effect="selectedAction(tab)"
                :close="close"
                @apply="apply"
                @reset="reset" />
            </div>
          </v-tabs-window>
        </v-col>
      </v-row>
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Action } from '@/classes/Action'
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
}>()

const emit = defineEmits<{
  'activate': []
}>()

const tab = ref('jockey')

const controller = computed(() => {
      return owner.value.actor.CombatController;
    })
const jockeyActions = computed(() => {
      return CompendiumStore()
        .Actions.filter((a) => a.Activation === 'Jockey')
        .sort((a, b) => a.Name.localeCompare(b.Name));
    })

function selectedAction(id) {
      return CompendiumStore().Actions.find((a) => a.ID === id);
    }
function apply(close) {
      emit('activate', props.action.ID);
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
</script>
