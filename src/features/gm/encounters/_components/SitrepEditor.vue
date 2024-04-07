<template>
  <div class="text-overline">SITREP</div>
  <v-card class="pa-2" variant="outlined" style="border-color: rgb(var(--v-theme-panel))">
    <v-row dense>
      <v-col>
        <cc-short-string-editor
          justify="start"
          :placeholder="item.Sitrep.Name"
          @set="item.Sitrep.Name = $event">
          <span class="heading h3">{{ item.Sitrep.Name }}</span>
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
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
            <v-row>
              <v-col cols="2">
                <v-list>
                  <v-list-item
                    v-for="sitrep in sitreps"
                    :title="sitrep.Name"
                    @click="staged = sitrep" />
                </v-list>
              </v-col>
              <v-col v-if="staged">
                <v-card-text>
                  <div class="text-caption">SITREP</div>
                  <div class="heading h2">{{ staged.Name }}</div>
                  <fieldset class="my-2">
                    <legend class="ml-2">
                      <span class="mx-1 text-caption">Description</span>
                    </legend>
                    <p v-html="staged.Description" class="px-2 pb-2" />
                  </fieldset>

                  <fieldset v-if="staged.Deployment" class="my-2">
                    <legend class="ml-2">
                      <span class="mx-1 text-caption">Deployment</span>
                    </legend>
                    <p v-html="staged.Deployment" class="px-2 pb-2" />
                  </fieldset>

                  <fieldset v-if="staged.Objective" class="my-2">
                    <legend class="ml-2">
                      <span class="mx-1 text-caption">Objective</span>
                    </legend>
                    <p v-html="staged.Objective" class="px-2 pb-2" />
                  </fieldset>

                  <fieldset v-if="staged.ControlZone" class="my-2">
                    <legend class="ml-2">
                      <span class="mx-1 text-caption">Control Zone</span>
                    </legend>
                    <p v-html="staged.ControlZone" class="px-2 pb-2" />
                  </fieldset>

                  <fieldset v-if="staged.Extraction" class="my-2">
                    <legend class="ml-2">
                      <span class="mx-1 text-caption">Extraction</span>
                    </legend>
                    <p v-html="staged.Extraction" class="px-2 pb-2" />
                  </fieldset>

                  <fieldset v-if="staged.Conditions && staged.Conditions.length" class="my-2">
                    <legend class="ml-2">
                      <span class="mx-1 text-caption">Conditions</span>
                    </legend>
                    <p v-html="staged.Conditions" class="px-2 pb-2" />
                  </fieldset>
                </v-card-text>
              </v-col>
            </v-row>
            <v-divider />
            <v-card-actions>
              <v-btn text @click="dialog = false">Cancel</v-btn>
              <v-spacer />
              <v-btn color="accent" @click="assignPreset()">Assign</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="staged = null"
          icon
          variant="tonal"
          class="fade-select"
          color="error"
          size="x-small"
          ><v-icon icon="mdi-delete" size="large"
        /></v-btn>
      </v-col>
    </v-row>

    <v-textarea
      v-model="item.Sitrep.Description"
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
      label="Deployment"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon icon="mdi-close" class="fade-select" @click="removeKey('Deployment')" />
      </template>
    </v-textarea>
    <v-textarea
      v-if="shownKeys.includes('Objective')"
      v-model="item.Sitrep.Objective"
      label="Objective"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon icon="mdi-close" class="fade-select" @click="removeKey('Objective')" />
      </template>
    </v-textarea>
    <v-textarea
      v-if="shownKeys.includes('ControlZone')"
      v-model="item.Sitrep.ControlZone"
      label="Control Zone"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon icon="mdi-close" class="fade-select" @click="removeKey('ControlZone')" />
      </template>
    </v-textarea>
    <v-textarea
      v-if="shownKeys.includes('Extraction')"
      v-model="item.Sitrep.Extraction"
      label="Extraction"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon icon="mdi-close" class="fade-select" @click="removeKey('Extraction')" />
      </template>
    </v-textarea>

    <v-card v-for="(c, i) in item.Sitrep.Conditions" class="pa-2">
      <v-text-field
        v-model="item.Sitrep.Conditions[i].title"
        label="Title"
        density="compact"
        hide-details
        class="mb-2">
        <template #append>
          <v-icon icon="mdi-delete" class="fade-select" @click="item.Sitrep.Conditions.splice(i)" />
        </template>
      </v-text-field>
      <v-textarea
        v-model="item.Sitrep.Conditions[i].condition"
        label="Conditions"
        density="compact"
        rows="1"
        variant="outlined"
        auto-grow
        hide-details
        class="mb-2" />
    </v-card>

    <v-row>
      <v-col v-for="key in keys.filter((x) => !item.Sitrep[x])" cols="auto">
        <v-btn
          variant="tonal"
          color="accent"
          size="small"
          prepend-icon="mdi-plus"
          @click="showKey(key)">
          {{ key }}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          variant="tonal"
          color="accent"
          size="small"
          prepend-icon="mdi-plus"
          @click="item.Sitrep.Conditions.push({ title: 'New Condition', condition: '' })">
          Condition
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Encounter } from '@/classes/encounter/Encounter';
import { SitrepInstance } from '@/classes/encounter/Sitrep';
import { CompendiumStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'gm-sitrep-editor',
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    staged: null as any,
    keys: ['Deployment', 'Objective', 'ControlZone', 'Extraction'],
    shownKeys: [] as string[],
  }),
  computed: {
    sitreps() {
      return CompendiumStore().Sitreps;
    },
  },
  methods: {
    assignPreset() {
      this.item.Sitrep = new SitrepInstance(this.item as Encounter, this.staged);
      console.log(this.item.Sitrep);
      this.shownKeys = this.keys.filter((x) => this.item.Sitrep[x].length);
      this.dialog = false;
    },
    showKey(key: string) {
      if (!this.shownKeys.includes(key)) this.shownKeys.push(key);
    },
    removeKey(key: string) {
      this.item.Sitrep[key] = '';
      this.shownKeys = this.shownKeys.filter((x) => x !== key);
    },
  },
};
</script>
