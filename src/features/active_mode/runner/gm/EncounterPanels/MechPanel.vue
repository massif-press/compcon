<template>
  <cc-alert v-if="mech.CombatController.ReactorDestroyed"
    title="Mech Destroyed &mdash; Reactor Meltdown"
    icon="mdi-radioactive-circle"
    color="error"
    class="mb-4">
    This mech has suffered a reactor meltdown. It is permanently destroyed and cannot be repaired.
    <div class="text-right">
      <v-btn size="x-small"
        variant="text"
        class="fade-select"
        @click="mech.CombatController.ReactorDestroyed = false">
        override
      </v-btn>
    </div>
  </cc-alert>

  <panel-base v-else
    :encounter-instance="encounterInstance"
    :item="mech">
    <template #name-block>
      <div class="heading h2">{{ mech.Name }}</div>
      <div class="heading h4">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>

      <cc-alert v-if="mech.CombatController.AIControl"
        title="Under AI Control"
        icon="cc:nhp"
        color="primary"
        class="mr-6">
        <div class="text-center">
          <div class="heading">{{aiSystems.map((x) => x.Name).join(' // ')}}</div>
        </div>
      </cc-alert>

      <cc-panel v-if="mech.CombatController.IsInSelfDestruct"
        icon="mdi-alert-outline"
        class="mr-6"
        title-color="error"
        title="Self Destruct Initiated">
        <div v-if="turnDiff(mech.CombatController.SelfDestructRound) > 0"
          class="text-center mb-2">
          This mech can self-destruct at the end of this turn. (PC Discretion, must self-destruct by
          Round
          {{ mech.CombatController.SelfDestructRound }})
        </div>
        <div v-else-if="turnDiff(mech.CombatController.SelfDestructRound) === 0">
          This mech will self-destruct at the end of this turn.
        </div>
        <cc-dialog title="Self Destruct"
          icon="mdi-alert-outline"
          :close-on-click="false">
          <template #activator="{ open }">
            <cc-button size="small"
              block
              color="error"
              @click="open">Self-Destruct</cc-button>
          </template>
          <template #default="{ close }">
            <menu-input :active-effect="SelfDestructAction"
              :encounter="encounterInstance"
              :owner="combatant"
              @apply="SD_apply(close)" />
          </template>
        </cc-dialog>
      </cc-panel>
    </template>

    <template #action-palette>
      <v-row no-gutters>
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Mounted ? 'primary' : 'panel'"
            text="Mounted"
            @click="setMounted" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Braced ? 'primary' : 'panel'"
            text="Braced"
            @click="mech.CombatController.Braced = !mech.CombatController.Braced" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="mech.CombatController.Overwatch = !mech.CombatController.Overwatch" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="mech.CombatController.Prepared = !mech.CombatController.Prepared" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn v-if="mech.MechLoadoutController.ActiveLoadout.AICount"
            flat
            tile
            size="small"
            block
            :color="mech.CombatController.AIControl ? 'primary' : 'panel'"
            text="AI Control"
            @click="mech.CombatController.AIControl = !mech.CombatController.AIControl" />
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <mech-actions-panel :owner=combatant
        :controller="mech.CombatController"
        :encounter="encounterInstance" />
    </template>

    <v-expansion-panels class="mt-2"
      multiple
      flat
      tile
      bg-color="background"
      variant="accordion">
      <v-expansion-panel class="py-0">
        <v-expansion-panel-title class="text-cc-overline py-0">
          <div class="text-cc-overline">
            <v-icon icon="cc:trait"
              class="mt-n1"
              start />
            Frame Traits ({{ mech.Frame.Traits.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall :items="mech.Frame.Traits"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <cc-trait-item :trait="item"
                color="primary"
                style="height: 100%"
                combat>
                <template #combat>
                  <div v-if="item.Actions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip v-for="a in item.Actions"
                      :action="a"
                      :owner="combatant"
                      :encounter="encounterInstance" />
                  </div>
                  <div v-if="item.Deployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Deployables"
                      :deployable="d"
                      :actor="mech"
                      @deploy="deploy($event)" />
                  </div>
                </template>
              </cc-trait-item>
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel v-if="mech.Parent.CoreBonusController.CoreBonuses.length">
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:corebonus"
              class="mt-n1"
              start />
            Core Bonuses ({{ mech.Parent.CoreBonusController.CoreBonuses.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall :items="mech.Parent.CoreBonusController.CoreBonuses"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <cc-core-bonus-item :key="item.ID"
                terse
                :bonus="item"
                combat>
                <template #combat>
                  <div v-if="item.Actions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip v-for="a in item.Actions"
                      :action="a"
                      :owner="combatant"
                      :encounter="encounterInstance" />
                  </div>
                  <div v-if="item.Deployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Deployables"
                      :deployable="d"
                      :actor="mech"
                      @deploy="deploy($event)" />
                  </div>
                </template>
              </cc-core-bonus-item>
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:talent"
              class="mt-n1"
              start />
            Pilot Talents ({{ mech.Parent.TalentsController.Talents.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall :items="mech.Parent.TalentsController.Talents"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <cc-talent rank-view
                :key="item.Talent.ID"
                :talent="item.Talent"
                :rank="item.Rank"
                hide-locked
                hide-change>
                <template #combat>
                  <div v-if="item.Talent.AllActions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip v-for="a in item.Talent.AllActions"
                      :action="a"
                      :owner="combatant"
                      :encounter="encounterInstance" />
                  </div>
                  <div v-if="item.Talent.AllDeployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Talent.AllDeployables"
                      :deployable="d"
                      :actor="mech"
                      @deploy="deploy($event)" />
                  </div>
                </template>
              </cc-talent>
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="text-cc-overline mt-4 text-disabled">Core</div>
    <mech-core-panel :mech="mech"
      :owner="combatant"
      :encounter-instance="encounterInstance"
      @deploy="deploy($event)" />

    <div class="text-cc-overline mt-4 text-disabled">Loadout</div>
    <mech-combat-loadout :encounter-instance="encounterInstance"
      :owner="combatant"
      :mech="mech"
      @deploy="deploy($event)" />
  </panel-base>
</template>

<script>
import _, { over } from 'lodash';
import { CompendiumStore } from '@/stores';
import PanelBase from './_PanelBase.vue';
import MechCombatLoadout from './_components/loadouts/MechCombatLoadout.vue';
import MechCorePanel from './_components/loadouts/MechCorePanel.vue';
import MechActionsPanel from './_components/MechActionsPanel.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import { SelfDestructAction } from '@/classes/components/combat/CombatController';

export default {
  name: 'MechPanel',
  components: {
    PanelBase,
    MechCombatLoadout,
    MechCorePanel,
    MechActionsPanel,
    MenuInput,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mech() {
      return this.combatant.actor.ActiveMech;
    },
    statuses() {
      return _.orderBy(CompendiumStore().Statuses, 'StatusType');
    },
    randomTalents() {
      return _.sampleSize(CompendiumStore().Talents, 3);
    },
    applicableStatuses() {
      const exclude = [`dangerzone`, `downandout`, `engaged`, `hidden`, `invisible`];
      return this.statuses.filter((s) => !exclude.includes(s.ID));
    },
    aiSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.AISystems;
    },
    SelfDestructAction() {
      return SelfDestructAction;
    },
  },
  methods: {
    deploy(deployable) {
      this.encounterInstance.Deploy(deployable, this.combatant);
    },
    getIcon(stat) {
      const icons = {
        structure: 'cc:structure',
        armor: 'mdi-shield-outline',
        hp: 'mdi-heart-outline',
        reactor: 'cc:reactor',
        heat: 'cc:heat',
        repair: 'cc:repair',
      };
      return icons[stat];
    },
    addStatus(status) {
      if (this.pilot.statuses.includes(status)) {
        const index = this.pilot.statuses.indexOf(status);
        this.pilot.statuses.splice(index, 1);
      } else {
        this.pilot.statuses.push(status);
      }
    },
    addCustomStatus(status) {
      if (this.pilot.special.includes(status.Name)) {
        const index = this.pilot.special.indexOf(status.Name);
        this.pilot.special.splice(index, 1);
        return;
      }
      this.pilot.special.push(status.Name);
    },
    addResistance(resist) {
      if (this.pilot.vulnerabilities.includes(resist.Name)) {
        const index = this.pilot.vulnerabilities.indexOf(resist.Name);
        this.pilot.vulnerabilities.splice(index, 1);
        return;
      }
      if (this.pilot.immunities.includes(resist.Name)) {
        const index = this.pilot.immunities.indexOf(resist.Name);
        this.pilot.immunities.splice(index, 1);
        this.pilot.vulnerabilities.push(resist.Name);
        return;
      }
      if (this.pilot.resistances.includes(resist.Name)) {
        const index = this.pilot.resistances.indexOf(resist.Name);
        this.pilot.resistances.splice(index, 1);
        this.pilot.immunities.push(resist.Name);
      } else {
        this.pilot.resistances.push(resist.Name);
      }
    },
    hasResistance(resist) {
      return this.pilot.resistances.includes(resist.Name);
    },
    hasImmunity(resist) {
      return this.pilot.immunities.includes(resist.Name);
    },
    hasVulnerability(resist) {
      return this.pilot.vulnerabilities.includes(resist.Name);
    },
    actionStatus(action) {
      if (action === 'full')
        return this.usedActions.includes('full') || this.usedActions.includes('quick');
      if (action === 'quick')
        return (
          this.usedActions.includes('full') ||
          this.usedActions.filter((x) => x === 'quick').length === 2
        );
      if (action === 'protocol') return this.usedActions.length;
      if (action === 'move') return this.usedActions.includes('move') || this.movement === 0;
      return this.usedActions.includes(action);
    },
    setAction(action) {
      if (action === 'quick') {
        if (this.usedActions.filter((x) => x === 'quick').length === 2) {
          this.usedActions = this.usedActions.filter((x) => x !== 'quick');
        } else {
          this.usedActions.push('quick');
        }
      }
      if (this.usedActions.includes(action)) {
        const index = this.usedActions.indexOf(action);
        this.usedActions.splice(index, 1);
      } else {
        this.usedActions.push(action);
      }
    },
    setMounted() {
      this.mech.CombatController.ToggleMounted();
    },
    turnDiff(targetRound) {
      return targetRound - this.encounterInstance.Round;
    },
    SD_close(closefn) {
      closefn();
      // this.mech.CombatController.IsInSelfDestruct = false;
      // this.mech.CombatController.SelfDestructRound = 0;
    },
    SD_apply(closefn) {
      this.mech.CombatController.CommitSelfDestruct();
      closefn();
    },
  },
};
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(-45deg,
      rgba(249, 219, 78, 0.5),
      rgba(249, 219, 78, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 20px);
}
</style>
