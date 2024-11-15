<template>
  <div class="text-overline">Environment</div>
  <v-card class="pa-2" variant="outlined" style="border-color: rgb(var(--v-theme-panel))">
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
      <v-col v-if="!readonly" cols="auto">
        <v-dialog v-model="dialog">
          <template #activator="{ props }">
            <v-btn v-bind="props" color="accent" variant="tonal">Load Preset</v-btn>
          </template>
          <v-card>
            <v-toolbar density="compact">
              <v-toolbar-title>Load Preset</v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-chip-group column class="px-5" selected-class="text-exotic">
              <v-chip v-for="Environment in environments" @click="staged = Environment">
                {{ Environment.Name }}
              </v-chip>
            </v-chip-group>

            <v-col v-if="staged">
              <v-card-text>
                <div class="text-caption">Environment</div>
                <div class="heading h2">{{ staged.Name }}</div>
                <fieldset class="my-2">
                  <legend class="ml-2">
                    <span class="mx-1 text-caption">Description</span>
                  </legend>
                  <p v-html="staged.Description" class="px-2 pb-2" />
                </fieldset>
              </v-card-text>
            </v-col>
            <v-row v-else align="center" justify="center">
              <v-col cols="auto">
                <v-card-text>
                  <i class="text-caption text-center">Select an Environment</i>
                </v-card-text>
              </v-col>
            </v-row>
            <v-divider />
            <v-card-actions>
              <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
              <v-spacer />
              <v-btn color="accent" @click="assignPreset()">Assign</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col v-if="!readonly" cols="auto">
        <v-btn
          @click="staged = null"
          icon
          variant="tonal"
          class="fade-select"
          color="error"
          size="x-small">
          <v-icon icon="mdi-delete" size="large" />
        </v-btn>
      </v-col>
    </v-row>

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
    staged: null as any,
  }),
  computed: {
    environments() {
      return CompendiumStore().Environments;
    },
  },
  methods: {
    assignPreset() {
      this.item.Environment = new EnvironmentInstance(this.item as Encounter, this.staged);
      this.dialog = false;
    },
  },
};
</script>
