<template>
  <panel-base :item="item" :image="item.frame.DefaultImage" :size-icon="item.frame.SizeIcon">
    <template #header>
      <v-row>
        <v-col class="heading h2 text-accent">{{ item.callsign }}</v-col>
        <v-col cols="auto">
          <span class="text-cc-overline pr-1">Played by</span>
          <b class="text-accent">{{ item.name }}</b>
        </v-col>
      </v-row>
    </template>

    <template #name-block>
      <div class="heading h2">{{ item.mechname }}</div>
      <div class="heading h4">{{ item.frame.Source }} {{ item.frame.Name }}</div>
    </template>

    <div class="text-cc-overline mt-4 text-disabled">Frame Traits</div>
    <masonry-wall
      :items="item.frame.Traits"
      :column-width="500"
      :gap="16"
      :min-columns="1"
      :max-columns="2">
      <template #default="{ item, index }">
        <cc-trait-item :trait="item" color="primary" style="height: 100%" />
      </template>
    </masonry-wall>

    <div class="text-cc-overline mt-4 text-disabled">Pilot Talents</div>
    <!-- <cc-talent :talent="randomTalents[0]" rank="2" hide-locked hide-change />
    <cc-talent :talent="randomTalents[1]" rank="2" hide-locked hide-change />
    <cc-talent :talent="randomTalents[2]" rank="1" hide-locked hide-change /> -->

    <br />

    loadout
    <br />

    <!-- <v-scroll-y-reverse-transition>
      <div v-if="item.statuses.length" class="text-cc-overline mt-2">
        <cc-alert
          v-for="status in item.statuses"
          :title="status.Name"
          :icon="status.Icon"
          prominent
          class="mt-1">
          <p v-html="status.Effects" />
        </cc-alert>
      </div>
    </v-scroll-y-reverse-transition> -->

    <v-divider class="my-4" />

    <div class="text-cc-overline mt-4">
      PILOT
      <cc-slashes />
    </div>
    <v-row>
      <v-col cols="auto">
        <v-img width="75px" src="https://placebear.com/100/100" />
      </v-col>
      <v-col>
        pilot stats
        <br />
        pilot info expandable
      </v-col>
    </v-row>
  </panel-base>
</template>

<script>
import _, { over } from 'lodash';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './StatMiniPanel.vue';
import PanelBase from './_PanelBase.vue';

export default {
  name: 'PcPanel',
  components: {
    StatMiniPanel,
    PanelBase,
  },
  props: {
    item: {
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
      { ID: 3, Name: 'Explosive', icon: 'cc:explosive', color: 'damage--explosive' },
      { ID: 4, Name: 'Heat', icon: 'cc:heat', color: 'damage--heat' },
      { ID: 5, Name: 'Burn', icon: 'cc:burn', color: 'damage--burn' },
      { ID: 5, Name: 'AoE', icon: 'cc:blast', color: 'damage--variable' },
    ],
    usedActions: [],
  }),
  computed: {
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
      if (this.item.statuses.includes(status)) {
        const index = this.item.statuses.indexOf(status);
        this.item.statuses.splice(index, 1);
      } else {
        this.item.statuses.push(status);
      }
    },
    addSpecialStatus(status) {
      if (this.item.special.includes(status.Name)) {
        const index = this.item.special.indexOf(status.Name);
        this.item.special.splice(index, 1);
        return;
      }
      this.item.special.push(status.Name);
    },
    addResistance(resist) {
      if (this.item.vulnerabilities.includes(resist.Name)) {
        const index = this.item.vulnerabilities.indexOf(resist.Name);
        this.item.vulnerabilities.splice(index, 1);
        return;
      }
      if (this.item.immunities.includes(resist.Name)) {
        const index = this.item.immunities.indexOf(resist.Name);
        this.item.immunities.splice(index, 1);
        this.item.vulnerabilities.push(resist.Name);
        return;
      }
      if (this.item.resistances.includes(resist.Name)) {
        const index = this.item.resistances.indexOf(resist.Name);
        this.item.resistances.splice(index, 1);
        this.item.immunities.push(resist.Name);
      } else {
        this.item.resistances.push(resist.Name);
      }
    },
    hasResistance(resist) {
      return this.item.resistances.includes(resist.Name);
    },
    hasImmunity(resist) {
      return this.item.immunities.includes(resist.Name);
    },
    hasVulnerability(resist) {
      return this.item.vulnerabilities.includes(resist.Name);
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
