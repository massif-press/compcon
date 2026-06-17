<template>
  <div>
    <cc-alert v-if="combatant.CombatController.IsDestroyed"
      class="ma-2"
      color="error"
      prominent
      outlined>
      <v-icon icon="cc:destroyed"
        size="large"
        start />
      <span class="text-cc-overline">{{ $t('active.panelBase.itemDestroyed', { type: combatant.ItemType }) }}</span>
    </cc-alert>
    <cc-alert v-else-if="!combatant.IsDeployed"
      class="ma-2"
      prominent
      icon="cc:drone"
      :title="$t('active.titles.recalledToMech')"
      outlined>
      <i18n-t keypath="active.deployPanel.recalledAwaiting" tag="span" scope="global">
        <template #type>{{ combatant.ItemType }}</template>
        <template #redeployment><b>{{ $t('active.deployPanel.redeployment') }}</b></template>
      </i18n-t>
      <cc-button size="small"
        block
        class="mt-2"
        options-icon="mdi-chevron-down"
        :color="`action--${recall.toLowerCase()}` || 'primary'"
        :disabled="!canRedeploy"
        @click="handleRedeploy(false)">
        <div class="px-4">
          <v-icon :icon="getActionIcon(redeploy)"
            class="mt-n1"
            start />
          {{ $t('active.deployPanel.redeploy') }}
          <span class="text-disabled">
            ({{ redeploy }})
          </span>
        </div>
        <template #options>
          <v-list density="compact"
            class="pa-0"
            bg-color=panel
            border
            tile>
            <v-list-item class="bg-action--free"
              :title="$t('active.titles.activateFreeAction')"
              @click="handleRedeploy(true)">
              <template #prepend>
                <v-icon icon="cc:free"
                  class="mr-n5" />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </cc-button>
      <v-divider class="my-2" />
      <cc-button block
        size="x-small"
        color="primary"
        @click="hide = !hide">{{ hide ? $t('common.show') : $t('common.hide') }}
        {{ $t('common.details') }}</cc-button>
    </cc-alert>

    <v-scroll-y-reverse-transition>
      <div v-if="!hide">
        <cc-panel class="mb-4"
          :title="combatant.Base.Name"
          :icon="combatant.Base.Icon"
          outlined>
          <div v-if="combatant.Base.Detail"
            v-html-safe="combatant.Base.Detail" />
          <div v-if=combatant.Base.Description
            v-html-safe="combatant.Base.Description" />
          <cc-combat-action-chip :owner="combatant.Owner" :encounter-instance="encounterInstance" v-for="action in combatant.Base.Actions"
            :key="action.ID"
            :action="action" />

        </cc-panel>

        <panel-base
          :item="combatant"
          no-actions
          no-conditions
          one-panel
          hide-palette>
          <template #name-block>
            <v-card flat
              tile
              class="pa-2">
              <v-row class="pr-4">
                <v-col>
                  <v-row no-gutters
                    align="center">
                    <v-col cols="auto"
                      align-self="center"
                      class="mr-2">
                      <v-icon :icon="combatant.Base.Icon"
                        size="60" />
                    </v-col>
                    <v-col cols="auto">
                      <div class="heading h2">{{ combatant.Name }}</div>
                      <div class="text-cc-overline">
                        {{ combatant.Base.Type }}
                        <cc-slashes class="ml-1 mr-2" />
                        <span class="text-disabled">{{ $t('active.deployPanel.ownedBy') }}</span>
                        <b>&nbsp;{{ owner.Callsign || owner.Name || 'Unknown' }}</b>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </panel-base>

        <cc-button v-if="recall"
          size="small"
          block
          class="mt-4"
          options-icon="mdi-chevron-down"
          :color="`action--${recall.toLowerCase()}` || 'primary'"
          :disabled="!canRecall"
          @click="handleRecall(false)">
          <v-icon :icon="getActionIcon(recall)"
            class="mt-n1"
            start />
          {{ $t('active.deployPanel.recall') }}
          <span class="text-disabled">
            ({{ recall }})
          </span>
          <template #options>
            <v-list density="compact"
              class="pa-0"
              bg-color=panel
              border
              tile>
              <v-list-item class="bg-action--free"
                :title="$t('active.titles.activateFreeAction')"
                @click="handleRecall(true)">
                <template #prepend>
                  <v-icon icon="cc:free"
                    class="mr-n5" />
                </template>
              </v-list-item>
            </v-list>
          </template>
        </cc-button>
      </div>
    </v-scroll-y-reverse-transition>

    <v-row class="mt-2">
      <v-col>
        <cc-button block
          color="error"
          size="small"
          @click="remove">
          {{ $t('active.deployPanel.removeType', { type: combatant.Base.Type }) }}
        </cc-button>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { DeployableInstance } from '@/classes/components/feature/deployable/DeployableInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed, provide, ref } from 'vue'
import { EncounterContextKey } from './encounterContext';
import PanelBase from './_PanelBase.vue';
import { Action } from '@/classes/Action';

const props = defineProps<{
  combatant: DeployableInstance
  encounterInstance: EncounterInstance
}>()

provide(EncounterContextKey, {
  owner: computed(() => props.combatant as unknown as CombatantData),
  encounterInstance: computed(() => props.encounterInstance),
})

const emit = defineEmits<{
  'deselect': []
}>()

const hide = ref(false)

const isDeployable = computed(() => {
      return props.combatant.Base.Type === 'Deployable';
    })
const owner = computed(() => {
      return props.combatant.Owner.actor;
    })
const recall = computed(() => {
      return props.combatant.Base.Recall || null;
    })
const canRecall = computed(() => {
      return owner.value.CombatController.CanActivate(recall.value);
    })
const redeploy = computed(() => {
      return props.combatant.Base.Redeploy || null;
    })
const canRedeploy = computed(() => {
      return owner.value.CombatController.CanActivate(redeploy.value);
    })
const deactivate = computed(() => {
      return props.combatant.Base.Deactivate || null;
    })

function remove() {
      const combatant = props.encounterInstance.Combatants.find(
        (c) => c.id === props.combatant.Owner.id
      );
      const idx = combatant.deployables.findIndex((d) => d.id === props.combatant.id);
      if (idx === -1) return;
      combatant.deployables.splice(idx, 1);
      emit('deselect', combatant);
    }
function getActionIcon(action) {
      return Action.getIcon(action);
    }
function handleRecall(isFree = false) {
      if (!isFree && recall.value) {
        owner.value.CombatController.ActiveActor.CombatController.toggleCombatAction(recall.value);
      }
      props.combatant.IsDeployed = false;
      hide.value = true;
    }
function handleRedeploy(isFree = false) {
      if (!isFree && redeploy.value) {
        owner.value.CombatController.ActiveActor.CombatController.toggleCombatAction(redeploy.value);
      }
      props.combatant.IsDeployed = true;
      hide.value = false;
    }
</script>
