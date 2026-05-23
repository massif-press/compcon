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
              :actor="owner.actor.ActiveMech"
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
              :actor="owner.actor.ActiveMech"
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
            <mech-skirmish-button :action="getBaseAction('act_skirmish')"
              :owner="owner"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
          <v-col>
            <mech-barrage-button :action="getBaseAction('act_barrage')"
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
              <v-col v-for="(action, index) in quickMechActions"
                :key="`quick-${index}`">
                <invade-button v-if="action === 'act_invade'"
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
                  :actor="owner.actor.ActiveMech"
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
                  :actor="owner.actor.ActiveMech"
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
              <v-col v-for="(action, index) in fullMechActions"
                :key="`full-${index}`">
                <stabilize-button v-if="action === 'act_stabilize'"
                  :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <skill-check-button v-else-if="action === 'act_skill_check'"
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
                  :actor="owner.actor.ActiveMech"
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
                  :actor="owner.actor.ActiveMech"
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
            <overcharge-button :action="getBaseAction('act_overcharge')"
              :owner="owner"
              :encounter="encounter" />
          </v-col>
          <v-col>
            <basic-action-button :action="getBaseAction('act_brace')"
              :owner="owner"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
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
              :actor="owner.actor.ActiveMech"
              @deploy="$emit('deploy', $event)" />
            <basic-action-button v-else
              :action="ra"
              :owner="owner"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
          <v-col>
            <basic-action-button :action="getBaseAction('act_self_destruct')"
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
import { ACTIVE_STRINGS } from '@/features/active_mode/strings'
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import DeployButton from './loadouts/_deployButton.vue';
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';
import StabilizeButton from './loadouts/action_buttons/stabilizeButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import OverchargeButton from './loadouts/action_buttons/overchargeButton.vue';
import MechSkirmishButton from './loadouts/action_buttons/mechSkirmishButton.vue';
import MechBarrageButton from './loadouts/action_buttons/mechBarrageButton.vue';

const props = defineProps<{
  owner: any;
  encounter: any;
}>();

defineEmits<{ deploy: [event: any] }>();

const quickMechActions = [
  'act_boost', 'act_grapple', 'act_ram', 'act_invade', 'act_bolster',
  'act_lockon', 'act_hide', 'act_search', 'act_scan', 'act_prepare', 'act_eject',
];
const fullMechActions = [
  'act_disengage', 'act_stabilize', 'act_improvised_attack',
  'act_skill_check', 'act_dismount', 'act_boot_up',
];

const controller = computed(() => props.owner.actor.ActiveMech.CombatController);

function getBaseAction(actionId: string) {
  return CompendiumStore().Actions.find((a: any) => a.ID === actionId) || null;
}

function toDeployable(action: any) {
  return new Deployable(action.Deployable);
}

function activate(event: string) {
  controller.value.MarkActionUsed(event);
  switch (event) {
    case 'act_prepare':
      controller.value.Prepared = true;
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.preparedTitle, text: ACTIVE_STRINGS.mechActions.preparedText(controller.value.CombatName) });
      break;
    case 'act_eject':
      if (!controller.value.Mounted) {
        notify({ type: 'warning', title: ACTIVE_STRINGS.mechActions.ejectFailedTitle, text: ACTIVE_STRINGS.mechActions.ejectFailedText(controller.value.CombatName) });
        controller.value.ResetActivation('quick');
        controller.value.ClearActionUsed('eject');
        return;
      }
      controller.value.ToggleMounted();
      controller.value.AddStatus('impaired');
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.pilotEjectedTitle, text: ACTIVE_STRINGS.mechActions.pilotEjectedText(controller.value.CombatName) });
      break;
    case 'act_dismount':
      if (!controller.value.Mounted) {
        notify({ type: 'warning', title: ACTIVE_STRINGS.mechActions.dismountFailedTitle, text: ACTIVE_STRINGS.mechActions.dismountFailedText(controller.value.CombatName) });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_dismount');
        return;
      }
      controller.value.ToggleMounted();
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.pilotDismountedTitle, text: ACTIVE_STRINGS.mechActions.pilotDismountedText(controller.value.CombatName) });
      break;
    case 'act_hide':
      controller.value.AddStatus('hidden');
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.mechHiddenTitle, text: ACTIVE_STRINGS.mechActions.mechHiddenText(controller.value.CombatName) });
      break;
    case 'act_disengage':
      if (!controller.value.HasStatus('engaged')) {
        notify({ type: 'warning', title: ACTIVE_STRINGS.mechActions.disengageFailedTitle, text: ACTIVE_STRINGS.mechActions.disengageFailedText(controller.value.CombatName) });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_disengage');
      } else {
        controller.value.RemoveStatus('engaged');
        notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.mechDisengagedTitle, text: ACTIVE_STRINGS.mechActions.mechDisengagedText(controller.value.CombatName) });
      }
      break;
    case 'act_boot_up':
      if (!controller.value.Statuses.some((x: any) => x.status.ID === 'shut-down')) {
        notify({ type: 'warning', title: ACTIVE_STRINGS.mechActions.bootUpFailedTitle, text: ACTIVE_STRINGS.mechActions.bootUpFailedText(controller.value.CombatName) });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_boot_up');
        return;
      }
      controller.value.RemoveStatus('shut-down');
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.mechBootedUpTitle, text: ACTIVE_STRINGS.mechActions.mechBootedUpText(controller.value.CombatName) });
      break;
    case 'act_self_destruct':
      if (controller.value.IsInSelfDestruct) {
        notify({ type: 'warning', title: ACTIVE_STRINGS.mechActions.selfDestructFailedTitle, text: ACTIVE_STRINGS.mechActions.selfDestructFailedText(controller.value.CombatName) });
        controller.value.ResetActivation('quick');
        controller.value.ClearActionUsed('act_self_destruct');
        return;
      }
      controller.value.StartSelfDestruct();
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.selfDestructInitiatedTitle, text: ACTIVE_STRINGS.mechActions.selfDestructInitiatedText(controller.value.CombatName) });
      break;
    case 'act_brace':
      controller.value.Braced = true;
      notify({ type: 'success', title: ACTIVE_STRINGS.mechActions.mechBracedTitle, text: ACTIVE_STRINGS.mechActions.mechBracedText(controller.value.CombatName) });
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
