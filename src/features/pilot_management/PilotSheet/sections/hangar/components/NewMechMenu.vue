<template>
  <cc-compendium-browser
    :items="filteredFrames"
    item-type="Frame"
    :options="options"
    equippable
    @equip="select($event)"
  >
    <template #header>
      <div class="heading h4 text-center text-primary">Select New Frame</div></template
    >

    <template #top>
      <v-row justify="end"
        ><v-col cols="auto"
          ><v-switch
            v-model="showAll"
            label="Show All"
            inset
            hide-details
            density="compact"
            color="accent" /></v-col
      ></v-row>
    </template>
  </cc-compendium-browser>

  <v-dialog v-model="nameDialog">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <div class="heading h3 pl-4">Register New Mech</div>
        <v-spacer />
        <v-btn icon @click="nameDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="8">
            <span class="text-overline">XK-4-01 // REGISTER MECH NAME</span>
            <v-text-field v-model="mechName" variant="outlined" label="Name" hide-details>
              <template #prepend>
                <cc-tooltip simple content="Generate Random Name">
                  <v-icon color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
                </cc-tooltip>
              </template>
              <template #append>
                <v-icon v-if="!mechName" color="error">mdi-alert</v-icon>
                <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <div class="text-center py-4">
          <v-btn size="large" color="accent" class="px-10" :disabled="!mechName" @click="addMech()">
            Register New Mech
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Pilot, Frame, Mech } from '@/class';
import { mechname } from '@/io/Generators';

export default {
  name: 'new-mech-menu',
  props: {
    pilot: { type: Pilot, required: true },
  },
  emits: ['close'],
  data: () => ({
    nameDialog: false,
    mechName: '',
    showAll: false,
    selectedFrame: null as any,
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'cards',
      groups: ['source', 'lcp'],
      initialGroup: 'source',
    },
    headers: [
      { title: 'Source', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'Size' },
      { title: 'Armor', key: 'Armor' },
      { title: 'HP', key: 'HP' },
      { title: 'Evasion', key: 'Evasion' },
      { title: 'EDef', key: 'EDefense' },
      { title: 'HeatCap', key: 'HeatCap' },
      { title: 'RepCap', key: 'RepCap' },
      { title: 'Sensors', key: 'SensorRange' },
      { title: 'TechAtk', key: 'TechAttack' },
      { title: 'Save', key: 'SaveTarget' },
      { title: 'Speed', key: 'Speed' },
      { title: 'SP', key: 'SP' },
    ],
  }),
  computed: {
    filteredFrames() {
      let i = this.frames as Frame[];

      if (!this.showAll)
        i = i.filter(
          (x) =>
            !x.IsExotic &&
            (this.pilot.has('License', x.Name, 2) ||
              this.pilot.has('License', x.Variant, 2) ||
              !x.LicenseLevel)
        );

      const special = this.pilot.SpecialEquipment.filter((x) => x.ItemType === 'Frame');

      return i.concat(special as Frame[]);
    },
    frames() {
      return CompendiumStore().Frames.filter((x) => !x.IsHidden);
    },
  },
  methods: {
    select(frame: Frame) {
      this.nameDialog = true;
      this.selectedFrame = frame;
    },
    async randomName() {
      this.mechName = await mechname();
    },
    addMech() {
      const newMech = new Mech(this.selectedFrame, this.pilot);
      newMech.Name = this.mechName;
      this.pilot.AddMech(newMech);
      this.mechName = '';
      this.selectedFrame = null;
      this.showAll = false;
      this.nameDialog = false;
      this.$emit('close');
    },
  },
};
</script>
