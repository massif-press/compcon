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
              <v-col v-for="action in quickMechActions">
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
              <v-col v-for="action in fullMechActions">
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
          <v-col v-for="ra in controller.AllActions('Reaction')">
            <basic-action-button :action="ra"
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

<script>
import { CompendiumStore } from '@/stores';
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';
import StabilizeButton from './loadouts/action_buttons/stabilizeButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import OverchargeButton from './loadouts/action_buttons/overchargeButton.vue';
import { ActivationType } from '@/class';
import MechSkirmishButton from './loadouts/action_buttons/mechSkirmishButton.vue';
import MechBarrageButton from './loadouts/action_buttons/mechBarrageButton.vue';

export default {
  name: 'MechActionsPanel',
  components: {
    BasicActionButton,
    InvadeButton,
    StabilizeButton,
    SkillCheckButton,
    OverchargeButton,
    MechSkirmishButton,
    MechBarrageButton
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
    quickMechActions: [
      'act_boost',
      'act_grapple',
      'act_ram',
      'act_invade',
      'act_lockon',
      'act_hide',
      'act_search',
      'act_prepare',
      'act_eject',
    ],
    fullMechActions: [
      'act_disengage',
      'act_stabilize',
      'act_improvised_attack',
      'act_skill_check',
      'act_dismount',
      'act_boot_up',
    ],
  }),
  computed: {
    controller() {
      return this.owner.actor.ActiveMech.CombatController;
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
            title: 'Mech Prepared',
            text: `${this.controller.CombatName} has been marked as PREPARED.`,
          });
          break;
        case 'act_eject':
          if (!this.controller.Mounted) {
            this.$notify({
              type: 'warning',
              title: 'Eject Failed',
              text: `${this.controller.CombatName} is not mounted.`,
            });
            this.controller.ResetActivation('quick');
            this.controller.ClearActionUsed('eject');
            return;
          }
          this.controller.ToggleMounted();
          this.controller.AddStatus('impaired');
          this.$notify({
            type: 'success',
            title: 'Pilot Ejected',
            text: `${this.controller.CombatName}'s has ejected from the mech and is now IMPAIRED.`,
          });
          break;
        case 'act_dismount':
          if (!this.controller.Mounted) {
            this.$notify({
              type: 'warning',
              title: 'Dismount Failed',
              text: `${this.controller.CombatName} is not mounted.`,
            });
            this.controller.ResetActivation('full');
            this.controller.ClearActionUsed('act_dismount');
            return;
          }
          this.controller.ToggleMounted();
          this.$notify({
            type: 'success',
            title: 'Pilot Dismounted',
            text: `${this.controller.CombatName}'s has dismounted from the mech.`,
          });
          break;
        case 'act_hide':
          this.controller.AddStatus('hidden');
          this.$notify({
            type: 'success',
            title: 'Mech Hidden',
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
              title: 'Mech Disengaged',
              text: `${this.controller.CombatName} has DISENGAGED.`,
            });
          }
          break;
        case 'act_boot_up':
          if (!this.controller.Statuses.some((x) => x.status.ID === 'shut-down')) {
            this.$notify({
              type: 'warning',
              title: 'Boot Up Failed',
              text: `${this.controller.CombatName} is not SHUT DOWN.`,
            });
            this.controller.ResetActivation('full');
            this.controller.ClearActionUsed('act_boot_up');
            return;
          } else {
            this.controller.RemoveStatus('shut-down');
            this.$notify({
              type: 'success',
              title: 'Mech Booted Up',
              text: `${this.controller.CombatName} has BOOTED UP.`,
            });
          }
          break;
        case 'act_self_destruct':
          if (this.controller.IsInSelfDestruct) {
            this.$notify({
              type: 'warning',
              title: 'Self Destruct Failed',
              text: `${this.controller.CombatName} is already in SELF DESTRUCT.`,
            });
            this.controller.ResetActivation('quick');
            this.controller.ClearActionUsed('act_self_destruct');
            return;
          } else {
            this.controller.StartSelfDestruct();
            this.$notify({
              type: 'success',
              title: 'Mech Self-Destruct Initiated',
              text: `${this.controller.CombatName} is about to SELF DESTRUCT.`,
            });
          }
          break;
        case 'act_brace':
          this.controller.Braced = true;
          this.$notify({
            type: 'success',
            title: 'Mech Braced',
            text: `${this.controller.CombatName} is now BRACED.`,
          });
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
