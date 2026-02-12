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
          <v-col v-for="pa in controller.AllActions('Protocol')">
            <basic-action-button :action="pa"
              :owner="owner"
              :encounter="encounter"
              @activate="activate($event)" />
          </v-col>
          <v-col v-for="fa in controller.AllActions('Free')">
            <basic-action-button :action="fa"
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
              <v-col v-for="action in quickNpcActions">
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
              <v-col v-for="qa in controller.AllActions('Quick')">
                <basic-action-button :action="qa"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-col v-for="qta in controller.AllActions('Quick Tech')">
                <basic-action-button :action="qta"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row dense>
              <v-col v-for="action in fullNpcActions">
                <basic-action-button :action="getBaseAction(action)"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-divider class="my-1" />
              <v-col v-for="fa in controller.AllActions('Full')">
                <basic-action-button :action="fa"
                  :owner="owner"
                  :encounter="encounter"
                  @activate="activate($event)" />
              </v-col>
              <v-col v-for="fta in controller.AllActions('Full Tech')">
                <basic-action-button :action="fta"
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
          <v-col v-for="ra in controller.AllActions('Reaction')">
            <basic-action-button :action="ra"
              :owner="owner"
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
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import { ActivationType } from '@/class';

export default {
  name: 'NpcActionsPanel',
  components: {
    BasicActionButton,
    InvadeButton,
    SkillCheckButton,
  },
  props: {
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    quickNpcActions: [
      'act_boost',
      'act_grapple_npc',
      'act_hide',
      'act_prepare',
      'act_ram_npc',
      'act_invade',
      'act_lockon',
      'act_search',
    ],
    fullNpcActions: ['act_disengage', 'act_improvised_attack_npc', 'act_stabilize_npc'],
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
  },
  methods: {
    getBaseAction(actionId) {
      return CompendiumStore().Actions.find((a) => a.ID === actionId);
    },
    activate(event) {
      this.controller.MarkActionUsed(event);
      switch (event) {
        case 'act_prepare':
          this.controller.Prepared = true;
          this.$notify({
            type: 'success',
            title: 'NPC Prepared',
            text: `${this.controller.CombatName} has been marked as PREPARED.`,
          });
          break;
        case 'act_stabilize_npc':
          this.controller.Stabilize('npc');
          this.$notify({
            type: 'success',
            title: 'NPC Stabilized',
            text: `${this.controller.CombatName} has cleared all HEAT, is no longer EXPOSED, and has reloaded their weapons.`,
          });
          break;
        case 'act_hide':
          this.controller.AddSimpleStatus('hidden');
          this.$notify({
            type: 'success',
            title: 'NPC Hidden',
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
              title: 'NPC Disengaged',
              text: `${this.controller.CombatName} has DISENGAGED.`,
            });
          }
          break;
        default:
          console.warning('uncaught event:', event);

          break;
      }
    },
  },
};
</script>

<style scoped>
.v-expansion-panel-text>>>.v-expansion-panel-text__wrapper {
  padding: 8px;
}
</style>
