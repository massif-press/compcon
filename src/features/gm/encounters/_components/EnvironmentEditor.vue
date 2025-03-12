<template>
  <div class="text-overline">Environment</div>
  <v-card class="py-2 px-4" variant="outlined" style="border-color: rgb(var(--v-theme-panel))">
    <v-row dense>
      <v-col>
        <cc-short-string-editor
          justify="start"
          :readonly="readonly"
          :placeholder="item.Environment.Name"
          @set="item.Environment.Name = $event">
          <span class="heading h3">{{ item.Environment.Name }}</span>
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
            v-for="environment in environments"
            :key="environment.Name"
            size="small"
            class="rounded-0"
            label
            @click="setEnvironment(environment)">
            {{ environment.Name }}
          </v-chip>
        </v-chip-group>
      </v-card>
    </v-slide-y-transition>

    <v-textarea
      v-model="item.Environment.Description"
      :readonly="readonly"
      label="Description"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mt-2" />

    <cc-solo-dialog
      v-model="confirmDialog"
      title="environment data modified"
      icon="mdi-undo-variant"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        This environment has been modified. Loading a new preset will delete these changes. Are you
        sure you want to continue?
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary" size="small" @click="confirmDialog = false">cancel</cc-button>
        <v-spacer />
        <cc-button color="success" size="small" @click="confirm">confirm</cc-button>
      </div>
    </cc-solo-dialog>
  </v-card>
</template>

<script lang="ts">
import { EnvironmentInstance } from '@/classes/Environment';
import { Encounter } from '@/classes/encounter/Encounter';
import { CompendiumStore } from '@/stores';

import _ from 'lodash';

export default {
  name: 'gm-environment-editor',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    dialog: false,
    showPresets: false,
    confirmDialog: false,
    stagedEnvironment: null as EnvironmentInstance | null,
  }),
  computed: {
    environments() {
      return CompendiumStore().Environments;
    },
  },
  methods: {
    setEnvironment(environment) {
      if (this.item.Environment.modified) {
        this.stagedEnvironment = environment;
        this.confirmDialog = true;
        return;
      }
      this._setEnvironment(environment);
    },
    confirm() {
      this.confirmDialog = false;
      this._setEnvironment(this.stagedEnvironment);
      this.stagedEnvironment = null;
    },
    _setEnvironment(environment) {
      this.item.Environment = new EnvironmentInstance(this.item as Encounter, environment);
    },
  },
};
</script>
