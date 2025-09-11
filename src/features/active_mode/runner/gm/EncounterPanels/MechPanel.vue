<template>
  <panel-base :encounter-instance="encounterInstance" :item="mech">
    <template #name-block>
      <div class="heading h2">{{ mech.Name }}</div>
      <div class="heading h4">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>

      <cc-alert
        v-if="
          !mech.CombatController.Mounted && !mech.CombatController.Destroyed && aiSystems.length
        "
        title="Under AI Control"
        icon="cc:monist"
        color="primary"
        class="mr-6">
        <div class="text-center">
          <div class="heading">{{ aiSystems.map((x) => x.Name).join(' // ') }}</div>
        </div>
      </cc-alert>
    </template>

    <template #action-palette>
      <v-row dense>
        <v-col>
          <v-btn
            flat
            tile
            size="small"
            block
            :color="mech.CombatController.Mounted ? 'primary' : 'panel'"
            text="Mounted"
            @click="mech.CombatController.Mounted = !mech.CombatController.Mounted" />
          <v-divider />
          <v-btn
            flat
            tile
            size="small"
            block
            :color="mech.CombatController.Braced ? 'primary' : 'panel'"
            text="Braced"
            @click="mech.CombatController.Braced = !mech.CombatController.Braced" />
        </v-col>
        <v-col>
          <v-btn
            flat
            tile
            size="small"
            block
            :color="mech.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="mech.CombatController.Overwatch = !mech.CombatController.Overwatch" />
          <v-divider />
          <v-btn
            flat
            tile
            size="small"
            block
            :color="mech.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="mech.CombatController.Prepared = !mech.CombatController.Prepared" />
        </v-col>
      </v-row>
    </template>

    <v-expansion-panels class="mt-2" multiple flat tile bg-color="background" variant="accordion">
      <v-expansion-panel class="py-0">
        <v-expansion-panel-title class="text-cc-overline py-0">
          <div class="text-cc-overline">
            <v-icon icon="cc:trait" class="mt-n1" start />
            Frame Traits ({{ mech.Frame.Traits.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall
            :items="mech.Frame.Traits"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <cc-trait-item :trait="item" color="primary" style="height: 100%" />
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel v-if="mech.Parent.CoreBonusController.CoreBonuses.length">
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:corebonus" class="mt-n1" start />
            Core Bonuses ({{ mech.Parent.CoreBonusController.CoreBonuses.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall
            :items="mech.Parent.CoreBonusController.CoreBonuses"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <cc-core-bonus-item :key="item.ID" terse :bonus="item" />
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:talent" class="mt-n1" start />
            Pilot Talents ({{ mech.Parent.TalentsController.Talents.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <masonry-wall
            :items="mech.Parent.TalentsController.Talents"
            :column-width="500"
            :gap="8"
            :min-columns="1"
            :max-columns="2">
            <template #default="{ item, index }">
              <cc-talent
                rank-view
                :key="item.Talent.ID"
                :talent="item.Talent"
                :rank="item.Rank"
                hide-locked
                hide-change />
            </template>
          </masonry-wall>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="text-cc-overline mt-4 text-disabled">Core</div>
    <cc-core-system-panel :frame="mech.Frame" terse small />

    <div class="text-cc-overline mt-4 text-disabled">Loadout</div>
    <mech-combat-loadout
      :encounter-instance="encounterInstance"
      :mech="mech"
      @deploy="deploy($event)" />
  </panel-base>
</template>

<script>
import _, { over } from 'lodash';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import PanelBase from './_PanelBase.vue';
import MechCombatLoadout from './_components/loadouts/MechCombatLoadout.vue';

export default {
  name: 'MechPanel',
  components: {
    StatMiniPanel,
    PanelBase,
    MechCombatLoadout,
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
    addSpecialStatus(status) {
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
  },
};
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(
    -45deg,
    rgba(249, 219, 78, 0.5),
    rgba(249, 219, 78, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 20px
  );
}
</style>
