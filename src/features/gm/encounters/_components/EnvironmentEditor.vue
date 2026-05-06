<template>
  <div class="text-overline">Environment</div>
  <v-card class="py-2 px-4"
    variant="outlined"
    style="border-color: rgb(var(--v-theme-panel))">
    <v-row dense>
      <v-col>
        <cc-short-string-editor justify="start"
          :readonly="readonly"
          :placeholder="item.Environment.Name"
          @set="item.Environment.Name = $event">
          <span class="heading h3">{{ item.Environment.Name }}</span>
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
        <cc-button color="primary"
          size="small"
          :prepend-icon="showPresets ? 'mdi-chevron-double-down' : 'mdi-chevron-double-right'"
          @click="showPresets = !showPresets">
          PRESETS
        </cc-button>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <v-card v-if="showPresets"
        flat
        tile
        variant="tonal"
        color="secondary"
        class="px-1">
        <v-chip-group show-arrows>
          <v-chip v-for="environment in environments"
            :key="environment.Name"
            size="small"
            class="rounded-0"
            label
            @click="setEnvironment(environment)">
            {{ environment.Name }}
          </v-chip>
        </v-chip-group>
        <template v-if="userPresets.length > 0">
          <v-divider class="my-1" />
          <div class="text-cc-overline text-disabled px-2">MY PRESETS</div>
          <v-chip-group>
            <v-chip v-for="(preset, i) in userPresets"
              :key="preset.id"
              size="small"
              class="rounded-0"
              label
              @click="loadUserPreset(preset)">
              {{ preset.name }}
              <v-icon size="14"
                class="ml-1"
                icon="mdi-close"
                @click.stop="stagedDeleteIndex = i; deleteConfirmDialog = true" />
            </v-chip>
          </v-chip-group>
        </template>
      </v-card>
    </v-slide-y-transition>

    <v-textarea v-model="item.Environment.Description"
      :readonly="readonly"
      label="Description"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mt-2" />

    <cc-solo-dialog v-model="confirmDialog"
      title="environment data modified"
      icon="mdi-undo-variant"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        This environment has been modified. Loading a new preset will delete these changes. Are you
        sure you want to continue?
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary"
          size="small"
          @click="confirmDialog = false">cancel</cc-button>
        <v-spacer />
        <cc-button color="success"
          size="small"
          @click="confirm">confirm</cc-button>
      </div>
    </cc-solo-dialog>

    <cc-solo-dialog v-model="deleteConfirmDialog"
      title="delete preset"
      icon="mdi-delete"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        Delete preset
        <b>{{ stagedDeleteIndex >= 0 ? userPresets[stagedDeleteIndex]?.name : '' }}</b>?
        This cannot be undone.
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary"
          size="small"
          @click="deleteConfirmDialog = false">cancel</cc-button>
        <v-spacer />
        <cc-button color="error"
          size="small"
          @click="confirmDeletePreset">delete</cc-button>
      </div>
    </cc-solo-dialog>

    <v-row justify="end">
      <v-col cols="auto">
        <cc-button v-if="!readonly"
          color="accent"
          size="small"
          class="mt-2"
          prepend-icon="mdi-content-save-outline"
          :disabled="!item.Environment.modified"
          @click="savePreset">
          Save Preset
        </cc-button>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { v4 as uuid } from 'uuid';
import { Environment, EnvironmentInstance, type IEnvironmentData } from '@/classes/Environment';
import { Encounter } from '@/classes/encounter/Encounter';
import { CompendiumStore } from '@/stores';
import { GetValue, SetValue } from '@/io/Storage';

const STORAGE_KEY = 'user_environment_presets';

export default {
  name: 'GmEnvironmentEditor',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    dialog: false,
    showPresets: false,
    confirmDialog: false,
    stagedEnvironment: null as EnvironmentInstance | null,
    userPresets: [] as IEnvironmentData[],
    deleteConfirmDialog: false,
    stagedDeleteIndex: -1,
  }),
  computed: {
    environments() {
      return CompendiumStore().Environments;
    },
  },
  async created() {
    this.userPresets = (await GetValue(STORAGE_KEY)) || [];
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
    loadUserPreset(preset: IEnvironmentData) {
      this.setEnvironment(new Environment(preset));
    },
    async savePreset() {
      const base = this.item.Environment.Name.replace(/ \(\d+\)$/, '');
      const existing = [
        ...this.environments.map((e) => e.Name),
        ...this.userPresets.map((p) => p.name),
      ];
      let name = base;
      if (existing.includes(name)) {
        let i = 2;
        while (existing.includes(`${base} (${i})`)) i++;
        name = `${base} (${i})`;
      }
      const preset: IEnvironmentData = {
        id: uuid(),
        name,
        modified: false,
        description: this.item.Environment.Description,
      };
      this.userPresets.push(preset);
      await SetValue(STORAGE_KEY, this.userPresets);
    },
    async confirmDeletePreset() {
      this.userPresets.splice(this.stagedDeleteIndex, 1);
      await SetValue(STORAGE_KEY, this.userPresets);
      this.deleteConfirmDialog = false;
      this.stagedDeleteIndex = -1;
    },
  },
};
</script>
