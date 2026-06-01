<template>
  <v-expansion-panels focusable
    tile
    color="panel"
    flat
    class="mt-1">
    <v-expansion-panel>
      <v-expansion-panel-title class="heading h4 py-0">All Actions</v-expansion-panel-title>
      <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
        <v-row dense>
          <v-col v-for="pa in controller.AllActions('Protocol')"
            :key="pa.ID">
            <deploy-button v-if="pa.Deployable"
              action-only
              :deployable="toDeployable(pa)"
              :actor="owner.actor"
              @deploy="$emit('deploy', $event)" />
            <basic-action-button v-else
              :action="pa"
              :owner="owner"
              :encounter-instance="encounterInstance"
              @activate="$emit('activate', $event)" />
          </v-col>
          <v-col v-for="fa in controller.AllActions('Free')"
            :key="fa.ID">
            <deploy-button v-if="fa.Deployable"
              action-only
              :deployable="toDeployable(fa)"
              :actor="owner.actor"
              @deploy="$emit('deploy', $event)" />
            <basic-action-button v-else
              :action="fa"
              :owner="owner"
              :encounter-instance="encounterInstance"
              @activate="$emit('activate', $event)" />
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <slot name="before-quick" />

        <v-row align="start"
          dense>
          <v-col>
            <v-row dense>
              <v-col v-for="(action, index) in quickActions"
                :key="`quick-${index}`">
                <slot name="quick-action-btn"
                  :action="getBaseAction(action)">
                  <basic-action-button :action="getBaseAction(action)"
                    :owner="owner"
                    :encounter-instance="encounterInstance"
                    @activate="$emit('activate', $event)" />
                </slot>
              </v-col>
              <v-divider class="my-1" />
              <v-col v-for="qa in controller.AllActions('Quick')"
                :key="qa.ID">
                <deploy-button v-if="qa.Deployable"
                  action-only
                  :deployable="toDeployable(qa)"
                  :actor="owner.actor"
                  @deploy="$emit('deploy', $event)" />
                <basic-action-button v-else
                  :action="qa"
                  :owner="owner"
                  :encounter-instance="encounterInstance"
                  @activate="$emit('activate', $event)" />
              </v-col>
              <v-col v-for="qta in controller.AllActions('Quick Tech')"
                :key="qta.ID">
                <deploy-button v-if="qta.Deployable"
                  action-only
                  :deployable="toDeployable(qta)"
                  :actor="owner.actor"
                  @deploy="$emit('deploy', $event)" />
                <basic-action-button v-else
                  :action="qta"
                  :owner="owner"
                  :encounter-instance="encounterInstance"
                  @activate="$emit('activate', $event)" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row dense>
              <v-col v-for="(action, index) in fullActions"
                :key="`full-${index}`">
                <slot name="full-action-btn"
                  :action="getBaseAction(action)">
                  <basic-action-button :action="getBaseAction(action)"
                    :owner="owner"
                    :encounter-instance="encounterInstance"
                    @activate="$emit('activate', $event)" />
                </slot>
              </v-col>
              <v-divider class="my-1" />
              <v-col v-for="fa in controller.AllActions('Full')"
                :key="fa.ID">
                <deploy-button v-if="fa.Deployable"
                  action-only
                  :deployable="toDeployable(fa)"
                  :actor="owner.actor"
                  @deploy="$emit('deploy', $event)" />
                <basic-action-button v-else
                  :action="fa"
                  :owner="owner"
                  :encounter-instance="encounterInstance"
                  @activate="$emit('activate', $event)" />
              </v-col>
              <v-col v-for="fta in controller.AllActions('Full Tech')"
                :key="fta.ID">
                <deploy-button v-if="fta.Deployable"
                  action-only
                  :deployable="toDeployable(fta)"
                  :actor="owner.actor"
                  @deploy="$emit('deploy', $event)" />
                <basic-action-button v-else
                  :action="fta"
                  :owner="owner"
                  :encounter-instance="encounterInstance"
                  @activate="$emit('activate', $event)" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row dense>
          <v-col>
            <basic-action-button :action="getBaseAction('act_overwatch')"
              :owner="owner"
              :encounter-instance="encounterInstance" />
          </v-col>
          <v-col v-for="ra in controller.AllActions('Reaction')"
            :key="ra.ID">
            <deploy-button v-if="ra.Deployable"
              action-only
              :deployable="toDeployable(ra)"
              :actor="owner.actor"
              @deploy="$emit('deploy', $event)" />
            <basic-action-button v-else
              :action="ra"
              :owner="owner"
              :encounter-instance="encounterInstance"
              @activate="$emit('activate', $event)" />
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed } from 'vue';
import { CompendiumStore } from '@/stores';
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import DeployButton from './loadouts/_deployButton.vue';

const props = defineProps<{
  owner: CombatantData;
  encounterInstance: EncounterInstance;
  quickActions: string[];
  fullActions: string[];
}>();

defineEmits<{ deploy: [event: any]; activate: [event: string] }>();

const controller = computed(() => props.owner.actor.CombatController);

function getBaseAction(actionId: string) {
  return CompendiumStore().Actions.find((a: any) => a.ID === actionId);
}

function toDeployable(action: any) {
  return new Deployable(action.Deployable);
}
</script>

<style scoped>
.v-expansion-panel-text>>>.v-expansion-panel-text__wrapper {
  padding: 8px;
}
</style>
