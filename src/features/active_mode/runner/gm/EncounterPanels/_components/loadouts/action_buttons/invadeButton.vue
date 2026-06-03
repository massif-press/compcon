<template>
  <combat-action-button
    :action="action">
    <template #default="{ close }">
      <v-row>
        <v-col cols="12"
          md="4">
          <v-tabs v-model="tab"
            direction="vertical"
            density="compact">
            <v-tab height="30"
              value="invade">Invade</v-tab>
            <v-divider v-if="!mobile" />
            <div class="pa-2 text-cc-overline text-disabled">Available Invade Actions</div>
            <v-tab v-for="item in invadeActions"
              :key="item.ID"
              height="30"
              class="bg-action--invade"
              :border="mobile"
              :value="item.ID">
              <v-icon :icon="item.Icon"
                class="mr-2" />
              {{ item.Name }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12"
          md="8">
          <v-divider :vertical="!mobile"
            :class="mobile ? 'my-4' : 'mr-1'" />
          <v-tabs-window v-model="tab"
            class="px-2">
            <div v-if="tab === 'invade'">
              <div class="heading h4">{{ action.Name }}</div>
              <p v-html-safe="action.Detail"
                class="text-text pl-2" />
              <v-row dense
                align="center"
                class="my-2">
                <v-col><v-divider /></v-col>
                <v-col class="heading text-disabled"
                  cols="auto">Select an Invade Action</v-col>
                <v-col><v-divider /></v-col>
              </v-row>
            </div>
            <div v-else>
              <cc-synergy-display location="tech_attack"
                :mech="controller.Parent"
                alert />

              <menu-input :owner="owner" :encounter-instance="encounterInstance" :key="controller.ID"
                :active-effect="getSelectedAction(tab)"
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
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const _display = useDisplay()

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
}>()

const emit = defineEmits<{
  'activate': []
}>()

const tab = ref('invade')

const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
const controller = computed(() => {
      return owner.value.actor.CombatController.ActiveActor.CombatController;
    })
const invadeActions = computed(() => {
      return [...CompendiumStore().Actions.filter((a) => a.Activation === 'Invade'),
        ...controller.value.AllActions('Invade')]
        .sort((a, b) => a.Name.localeCompare(b.Name));
    })

function getSelectedAction(id) {
      return invadeActions.value.find((a) => a.ID === id);
    }
function apply() {
      emit('activate', tab.value);
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
</script>
