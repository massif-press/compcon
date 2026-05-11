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
              :encounter="encounter"
              @activate="activate($event)" />
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
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <pilot-fight-button :action="getBaseAction('act_fight')"
              :owner="owner"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row align="start"
          dense>
          <v-col>
            <v-row dense>
              <v-col v-for="(action, index) in quickPilotActions"
                :key="`quick-${index}`">
                <invade-button v-if="action === 'act_invade'"
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <pilot-reload-button v-else-if="action === 'act_reload'"
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <basic-action-button v-else
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
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
                  :encounter="encounter"
                  @activate="activate($event)" />
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
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row dense>
              <v-col v-for="(action, index) in fullPilotActions"
                :key="`full-${index}`">
                <skill-check-button v-if="action === 'act_skill_check'"
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <pilot-jockey-button v-else-if="action === 'act_jockey'"
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <basic-action-button v-else
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
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
                  :encounter="encounter"
                  @activate="activate($event)" />
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
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row dense>
          <v-col>
            <basic-action-button :action="getBaseAction('act_overwatch')"
              :owner="owner"
              :encounter="encounter" />
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
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CompendiumStore } from '@/stores';
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import { notify } from '@/util/notify';
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import DeployButton from './loadouts/_deployButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import PilotReloadButton from './loadouts/action_buttons/pilotReloadButton.vue';
import PilotJockeyButton from './loadouts/action_buttons/pilotJockeyButton.vue';
import PilotFightButton from './loadouts/action_buttons/pilotFightButton.vue';
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';

const props = defineProps<{
  owner: any;
  encounter: any;
}>();

defineEmits<{ deploy: [event: any] }>();

const quickPilotActions = [
  'act_boost', 'act_hide', 'act_search', 'act_lockon',
  'act_prepare', 'act_reload', 'act_invade',
];
const fullPilotActions = ['act_skill_check', 'act_mount', 'act_disengage', 'act_jockey'];

const controller = computed(() => props.owner.actor.CombatController);

function getBaseAction(actionId: string) {
  return CompendiumStore().Actions.find((a: any) => a.ID === actionId);
}

function toDeployable(action: any) {
  return new Deployable(action.Deployable);
}

function activate(event: string) {
  controller.value.MarkActionUsed(event);
  switch (event) {
    case 'act_prepare':
      controller.value.Prepared = true;
      notify({ type: 'success', title: 'Pilot Prepared', text: `${controller.value.CombatName} has been marked as PREPARED.` });
      break;
    case 'act_mount':
      if (controller.value.Mounted) {
        notify({ type: 'warning', title: 'Mount Failed', text: `${controller.value.CombatName} is already mounted.` });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('mount');
        return;
      }
      controller.value.ToggleMounted();
      notify({ type: 'success', title: 'Pilot Mountd', text: `${controller.value.CombatName} has mounted their Mech.` });
      break;
    case 'act_hide':
      controller.value.AddStatus('hidden');
      notify({ type: 'success', title: 'Pilot Hidden', text: `${controller.value.CombatName} is now HIDDEN.` });
      break;
    case 'act_disengage':
      if (!controller.value.HasStatus('engaged')) {
        notify({ type: 'warning', title: 'Disengage Failed', text: `${controller.value.CombatName} is not ENGAGED.` });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_disengage');
      } else {
        controller.value.RemoveStatus('engaged');
        notify({ type: 'success', title: 'Pilot Disengaged', text: `${controller.value.CombatName} has DISENGAGED.` });
      }
      break;
    default:
      console.warn('uncaught event:', event);
  }
}
</script>
<style scoped>
.v-expansion-panel-text>>>.v-expansion-panel-text__wrapper {
  padding: 8px;
}
</style>
