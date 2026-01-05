<template>
  <v-expansion-panels focusable tile color="panel" flat class="mt-1">
    <v-expansion-panel>
      <v-expansion-panel-title class="heading h4 py-0">All Actions</v-expansion-panel-title>
      <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
        <v-row dense>
          <v-col v-for="pa in controller.AllActions('Protocol')">
            <basic-action-button
              :action="pa"
              :controller="controller"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
          <v-col v-for="fa in controller.AllActions('Free')">
            <basic-action-button
              :action="fa"
              :controller="controller"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <v-btn
              block
              flat
              tile
              size="small"
              text="Fight"
              color="action--full"
              prepend-icon="mdi-hexagon-slice-6" />
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row align="start" dense>
          <v-col>
            <v-row dense>
              <v-col v-for="action in quickPilotActions">
                <skill-check-button
                  v-if="action === 'act_reload'"
                  :action="getBaseAction(action)"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <basic-action-button
                  v-else
                  :action="getBaseAction(action)"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-divider class="my-1" />
              <v-col v-for="qa in controller.AllActions('Quick')">
                <basic-action-button
                  :action="qa"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-col v-for="qta in controller.AllActions('Quick Tech')">
                <basic-action-button
                  :action="qta"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row dense>
              <v-col v-for="action in fullPilotActions">
                <skill-check-button
                  v-if="action === 'act_skill_check'"
                  :action="getBaseAction(action)"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
                <basic-action-button
                  v-else
                  :action="getBaseAction(action)"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-divider class="my-1" />
              <v-col v-for="fa in controller.AllActions('Full')">
                <basic-action-button
                  :action="fa"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-col v-for="fta in controller.AllActions('Full Tech')">
                <basic-action-button
                  :action="fta"
                  :controller="controller"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row dense>
          <v-col>
            <basic-action-button
              :action="getBaseAction('act_overwatch')"
              :controller="controller"
              :encounter="encounter" />
          </v-col>
          <v-col v-for="ra in controller.AllActions('Reaction')">
            <basic-action-button
              :action="ra"
              :controller="controller"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { CompendiumStore } from '@/stores';
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import { ActivationType } from '@/class';
import PilotReloadButton from './loadouts/action_buttons/pilotReloadButton.vue';

export default {
  name: 'PilotActionsPanel',
  components: {
    BasicActionButton,
    SkillCheckButton,
    PilotReloadButton,
  },
  props: {
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    quickPilotActions: [
      'act_boost',
      'act_hide',
      'act_search',
      'act_invade',
      'act_lockon',
      'act_prepare',
      'act_reload',
    ],
    fullPilotActions: ['act_skill_check', 'act_mount', 'act_disengage'],
  }),
  methods: {
    getBaseAction(actionId) {
      return CompendiumStore().Actions.find((a) => a.ID === actionId);
    },
    activate(event) {
      console.log(event);
      this.controller.MarkActionUsed(event);
      switch (event) {
        case 'act_prepare':
          this.controller.Prepared = true;
          this.$notify({
            type: 'success',
            title: 'Pilot Prepared',
            text: `${this.controller.CombatName} has been marked as PREPARED.`,
          });
          break;
        case 'act_mount':
          if (this.controller.Mounted) {
            this.$notify({
              type: 'warning',
              title: 'Mount Failed',
              text: `${this.controller.CombatName} is already mounted.`,
            });
            this.controller.ResetActivation('full');
            this.controller.ClearActionUsed('mount');
            return;
          }
          this.controller.ToggleMounted();
          this.$notify({
            type: 'success',
            title: 'Pilot Mountd',
            text: `${this.controller.CombatName} has mounted their Mech.`,
          });
          break;
        case 'act_hide':
          this.controller.AddSimpleStatus('hidden');
          this.$notify({
            type: 'success',
            title: 'Pilot Hidden',
            text: `${this.controller.CombatName} is now HIDDEN.`,
          });
          break;
        case 'act_disengage':
          if (!this.controller.HasStatus('engaged')) {
            this.$notify({
              type: 'warning',
              title: 'Disengage Failed',
              text: `${this.controller.CombatName} is not ENGAGED.`,
            });
            this.controller.ResetActivation('full');
            this.controller.ClearActionUsed('act_disengage');
            break;
          } else {
            this.controller.RemoveStatus('engaged');
            this.$notify({
              type: 'success',
              title: 'Pilot Disengaged',
              text: `${this.controller.CombatName} has DISENGAGED.`,
            });
          }
          break;
        default:
          console.log(event);

          break;
      }
    },
  },
};
</script>
<style scoped>
.v-expansion-panel-text >>> .v-expansion-panel-text__wrapper {
  padding: 8px;
}
</style>
