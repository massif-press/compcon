<template>
  <div class="text-overline">SITREP</div>
  <v-card class="py-2 px-4" variant="outlined" style="border-color: rgb(var(--v-theme-panel))">
    <v-row align="center">
      <v-col>
        <cc-short-string-editor
          justify="start"
          :readonly="readonly"
          :placeholder="item.Sitrep.Name"
          @set="item.Sitrep.Name = $event">
          <span class="heading h3">{{ item.Sitrep.Name }}</span>
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
        <cc-button
          color="primary"
          size="small"
          :prepend-icon="showPresets ? 'mdi-chevron-double-down' : 'mdi-chevron-double-right'"
          @click="showPresets = !showPresets">
          PRESETS
        </cc-button>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <v-card v-if="showPresets" flat tile variant="tonal" color="secondary" class="px-1">
        <v-chip-group>
          <v-chip
            v-for="sitrep in sitreps"
            :key="sitrep.Name"
            size="small"
            class="rounded-0"
            label
            @click="setSitrep(sitrep)">
            {{ sitrep.Name }}
          </v-chip>
        </v-chip-group>
      </v-card>
    </v-slide-y-transition>

    <v-textarea
      v-model="item.Sitrep.Description"
      :readonly="readonly"
      label="Description"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2 mt-2" />
    <v-textarea
      v-if="shownKeys.includes('Deployment')"
      v-model="item.Sitrep.Deployment"
      :readonly="readonly"
      label="Deployment"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon
          v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('Deployment')" />
      </template>
    </v-textarea>
    <v-textarea
      v-if="shownKeys.includes('Objective')"
      v-model="item.Sitrep.Objective"
      :readonly="readonly"
      label="Objective"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon
          v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('Objective')" />
      </template>
    </v-textarea>
    <v-textarea
      v-if="shownKeys.includes('ControlZone')"
      v-model="item.Sitrep.ControlZone"
      :readonly="readonly"
      label="Control Zone"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon
          v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('ControlZone')" />
      </template>
    </v-textarea>
    <v-textarea
      v-if="shownKeys.includes('Extraction')"
      v-model="item.Sitrep.Extraction"
      :readonly="readonly"
      label="Extraction"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon
          v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('Extraction')" />
      </template>
    </v-textarea>

    <v-card v-for="(c, i) in item.Sitrep.Conditions" class="pa-2">
      <v-text-field
        v-model="c.title"
        :readonly="readonly"
        label="Title"
        density="compact"
        hide-details
        class="mb-2">
        <template #append>
          <v-icon
            v-if="!readonly"
            icon="mdi-delete"
            class="fade-select"
            @click="item.Sitrep.Conditions.splice(i)" />
        </template>
      </v-text-field>
      <v-textarea
        v-model="c.condition"
        :readonly="readonly"
        label="Conditions"
        density="compact"
        rows="1"
        variant="outlined"
        auto-grow
        hide-details
        class="mb-2" />
    </v-card>

    <v-row v-if="!readonly" justify="space-around">
      <v-col v-for="key in keys.filter((x) => !item.Sitrep[x])" cols="auto">
        <cc-button color="primary" size="small" prepend-icon="mdi-plus" @click="showKey(key)">
          {{ key }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          color="primary"
          size="small"
          prepend-icon="mdi-plus"
          @click="item.Sitrep.Conditions.push({ title: 'New Condition', condition: '' })">
          Condition
        </cc-button>
      </v-col>
    </v-row>

    <cc-solo-dialog
      v-model="confirmDialog"
      title="sitrep modified"
      icon="mdi-undo-variant"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        This sitrep has been modified. Loading a new preset will delete these changes. Are you sure
        you want to continue?
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary" size="small" @click="confirmDialog = false">cancel</cc-button>
        <v-spacer />
        <cc-button color="success" size="small" @click="confirm(item.Sitrep)">confirm</cc-button>
      </div>
    </cc-solo-dialog>
  </v-card>
</template>

<script lang="ts">
import { Encounter } from '@/classes/encounter/Encounter';
import { Sitrep, SitrepInstance } from '@/classes/encounter/Sitrep';
import { CompendiumStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'gm-sitrep-editor',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    keys: ['Deployment', 'Objective', 'ControlZone', 'Extraction'],
    shownKeys: [] as string[],
    confirmDialog: false,
    showPresets: false,
  }),
  computed: {
    sitreps() {
      return CompendiumStore().Sitreps;
    },
  },
  created() {
    this.shownKeys = this.keys.filter((x) => this.item.Sitrep[x].length);
  },
  methods: {
    showKey(key: string) {
      if (!this.shownKeys.includes(key)) this.shownKeys.push(key);
    },
    removeKey(key: string) {
      this.item.Sitrep[key] = '';
      this.shownKeys = this.shownKeys.filter((x) => x !== key);
    },
    setSitrep(sitrep: Sitrep) {
      if (this.item.Sitrep.modified) {
        this.confirmDialog = true;
        return;
      }
      this._setSitrep(sitrep);
    },
    confirm(sitrep: Sitrep) {
      this.confirmDialog = false;
      this._setSitrep(sitrep);
    },
    _setSitrep(sitrep) {
      this.item.Sitrep = new SitrepInstance(this.item as Encounter, sitrep);
      this.shownKeys = this.keys.filter((x) => this.item.Sitrep[x].length);
    },
  },
};
</script>
