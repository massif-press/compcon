<template>
  <cc-compendium-browser
    :items="filteredFrames"
    item-type="Frame"
    :options="options"
    equippable
    @equip="select($event)">
    <template #header>
      <div class="heading h4 text-center text-accent">Select New Frame</div>
    </template>

    <template #top>
      <v-row justify="end">
        <v-col cols="auto">
          <cc-switch v-model="showAll" label="Show All Frames" color="error" />
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>

  <cc-solo-modal v-model="nameDialog" shrink title="register new mech" icon="cc:frame">
    <v-row justify="center">
      <v-col cols="11" md="8">
        <span class="text-overline">XK-4-01 // REGISTER MECH NAME</span>
        <v-text-field v-model="mechName" variant="outlined" label="Name" hide-details tile>
          <template #prepend>
            <v-tooltip text="Generate Random Name" location="top">
              <template #activator="{ props }">
                <cc-button
                  v-bind="props"
                  color="accent"
                  icon="mdi-dice-multiple"
                  variant="outlined"
                  @click="randomName()"></cc-button>
              </template>
            </v-tooltip>
          </template>
          <template #append>
            <v-icon v-if="!mechName" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <div class="py-4">
      <cc-button
        block
        color="accent"
        size="small"
        prepend-icon="cc:frame"
        append-icon="mdi-check"
        class="px-10"
        :disabled="!mechName"
        @click="addMech()">
        Register New Mech
      </cc-button>
    </div>
  </cc-solo-modal>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Pilot, Frame, Mech, ItemType } from '@/class';
import { mechname } from '@/io/Generators';
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';

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
      { title: 'Manufacturer', key: 'Source' },
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
      if (this.showAll) return CompendiumStore().Frames.filter((x) => !x.IsHidden);

      return this.pilot.LicenseController.AllowedItems(ItemType.Frame);
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
      AchievementEventSystem.emit('add_mech');
      this.mechName = '';
      this.selectedFrame = null;
      this.showAll = false;
      this.nameDialog = false;
      this.$emit('close');
    },
  },
};
</script>
