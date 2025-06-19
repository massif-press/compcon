<template>
  <panel-base :item="mech">
    <template #name-block>
      <div class="heading h2">{{ mech.Name }}</div>
      <div class="heading h4">
        {{ mech.Frame.Source }} {{ mech.Frame.Name }}
      </div>
    </template>

    <div class="text-cc-overline mt-4 text-disabled">Frame Traits</div>
    <masonry-wall
      :items="mech.Frame.Traits"
      :column-width="500"
      :gap="16"
      :min-columns="1"
      :max-columns="2"
    >
      <template #default="{ item, index }">
        <cc-trait-item :trait="item" color="primary" style="height: 100%" />
      </template>
    </masonry-wall>

    <div class="text-cc-overline mt-4 text-disabled">Pilot Talents</div>
    <cc-talent
      v-for="talent in mech.Parent.TalentsController.Talents"
      small
      :key="talent.Talent.ID"
      :talent="talent.Talent"
      :rank="talent.Rank"
      hide-locked
      hide-change
    />

    <br />

    loadout
    <br />

    <!-- <v-scroll-y-reverse-transition>
      <div v-if="pilot.statuses.length" class="text-cc-overline mt-2">
        <cc-alert
          v-for="status in pilot.statuses"
          :title="status.Name"
          :icon="status.Icon"
          prominent
          class="mt-1">
          <p v-html="status.Effects" />
        </cc-alert>
      </div>
    </v-scroll-y-reverse-transition> -->
  </panel-base>
</template>

<script>
import _, { over } from 'lodash';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import PanelBase from './_PanelBase.vue';

export default {
  name: 'PcPanel',
  components: {
    StatMiniPanel,
    PanelBase,
  },
  props: {
    combatant: {
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
      const exclude = [
        `dangerzone`,
        `downandout`,
        `engaged`,
        `hidden`,
        `invisible`,
      ];
      return this.statuses.filter((s) => !exclude.includes(s.ID));
    },
  },
  methods: {
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
        return (
          this.usedActions.includes('full') ||
          this.usedActions.includes('quick')
        );
      if (action === 'quick')
        return (
          this.usedActions.includes('full') ||
          this.usedActions.filter((x) => x === 'quick').length === 2
        );
      if (action === 'protocol') return this.usedActions.length;
      if (action === 'move')
        return this.usedActions.includes('move') || this.movement === 0;
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
