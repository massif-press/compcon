<template>
  <panel-base :item="pilot">
    <template #name-block>
      <div class="heading h2">{{ pilot.Callsign }}</div>
      <div class="heading h4">
        {{ pilot.Name }}
      </div>
    </template>
    <v-icon :icon="pilot.SizeIcon" />

    pilot loadout
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
  data: () => ({
    corepower: 1,
    overcharge: 0,
    burn: 4,
    movement: 3,
    armor: 11,
    cover: 'no',
    specialStatuses: [
      { ID: 1, Name: 'Ejected' },
      { ID: 2, Name: 'Cascade' },
      { ID: 3, Name: 'Meltdown Imminent' },
      { ID: 4, Name: 'Pilot Incapacitated' },
    ],
    resistances: [
      { ID: 1, Name: 'Kinetic', icon: 'cc:kinetic', color: 'damage--kinetic' },
      { ID: 2, Name: 'Energy', icon: 'cc:energy', color: 'damage--energy' },
      {
        ID: 3,
        Name: 'Explosive',
        icon: 'cc:explosive',
        color: 'damage--explosive',
      },
      { ID: 4, Name: 'Heat', icon: 'cc:heat', color: 'damage--heat' },
      { ID: 5, Name: 'Burn', icon: 'cc:burn', color: 'damage--burn' },
      { ID: 5, Name: 'AoE', icon: 'cc:blast', color: 'damage--variable' },
    ],
    usedActions: [],
  }),
  computed: {
    pilot() {
      return this.combatant.actor;
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
