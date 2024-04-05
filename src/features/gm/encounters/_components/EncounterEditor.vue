<template>
  <v-card flat>
    <div v-show="item">
      <v-card class="rounded-0 pb-12 elevation-0">
        <v-toolbar density="compact" class="rounded-0 pl-2" color="primary">
          <div class="heading h3 pa-1 text-white">
            <v-icon start size="large" icon="mdi-robot-industrial" /> ENCOUNTER EDITOR
          </div>
          <v-spacer />
          <v-btn icon @click="$emit('exit')">
            <v-icon large color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col cols="9">
              <v-row dense>
                <v-col>
                  <div class="heading mech mt-n5" style="min-width: 30vw">
                    <cc-short-string-editor
                      large
                      justify="start"
                      :placeholder="item.Name"
                      @set="item.Name = $event">
                      <div class="heading-block">
                        {{ item.Name }}
                      </div>
                    </cc-short-string-editor>
                  </div>
                </v-col>
              </v-row>

              <div class="text-overline">ENCOUNTER DETAILS</div>
              <cc-rich-text-area :item="item" note-property="Description" />

              <sitrep-editor :item="item" />

              <environment-editor :item="item" />
            </v-col>
            <v-col cols="3" class="text-center ml-auto">
              <gm-folder-editor :item="item" class="mb-1" />
              <gm-label-editor :item="item" class="mb-4" />
              <v-card>
                <v-tabs v-model="mapTab" grow color="secondary" bg-color="panel" density="compact">
                  <v-tab>Map</v-tab>
                  <v-tab>Image</v-tab>
                </v-tabs>
                <v-window v-model="mapTab">
                  <v-window-item
                    ><v-card style="height: 100%" variant="outlined">
                      <map-preview ref="mapPreview" v-if="item.Map" :map="item.Map" />
                      <v-row
                        v-else
                        style="min-height: 22vw; max-width: 100%"
                        align="center"
                        justify="center">
                        <v-col>
                          <i class="text-disabled text-caption">No Map Data</i>
                        </v-col>
                      </v-row>
                    </v-card>
                    <cc-solo-dialog ref="mapEditor" title="Map Editor" fullscreen no-actions>
                      <map-editor :encounter="item" @exit="exitMapEditor" />
                    </cc-solo-dialog>
                    <v-btn
                      small
                      variant="outlined"
                      block
                      color="accent"
                      @click="($refs as any).mapEditor.show()">
                      Edit Map</v-btn
                    ></v-window-item
                  >
                  <v-window-item>
                    <cc-img :src="item.PortraitController.Image" />
                    <v-btn
                      small
                      variant="outlined"
                      block
                      color="accent"
                      @click="($refs as any).imageSelector.open()">
                      Change Image
                    </v-btn>
                    <cc-image-selector
                      ref="imageSelector"
                      :item="item"
                      type="doodad"
                      @set="item.PortraitController.Image = $event" />
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>

          <combatant-editor :encounter="item" />

          <cc-icon-divider icon="mdi-robot-industrial" class="mt-2" />
          <div class="text-caption">ADDITIONAL DETAIL</div>
          <section-editor :item="item" />
          <v-divider class="my-2" />
          <div class="text-caption">CLOCKS</div>
          <cc-clock
            v-for="c in item.NarrativeController.Clocks"
            :clock="c"
            class="mx-1 my-2"
            @delete="item.NarrativeController.DeleteClock(c)" />
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn
                color="accent"
                variant="outlined"
                size="small"
                @click="item.NarrativeController.AddClock()">
                <v-icon start>mdi-plus</v-icon>
                Add New Clock
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="text-caption">TABLES</div>
          <cc-rollable-table
            v-for="t in item.NarrativeController.Tables"
            :table="t"
            class="mx-1 my-2"
            @delete="item.NarrativeController.DeleteTable(t)" />
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn
                color="accent"
                variant="outlined"
                size="small"
                @click="item.NarrativeController.AddTable()">
                <v-icon start>mdi-plus</v-icon>
                Add New Table
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="text-caption mb-2">
            GM NOTES
            <v-tooltip location="top" :open-delay="300">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="13"
                  icon="mdi-information-outline"
                  class="mt-n1 fade-select" />
              </template>
              <span
                >This is only visible to the GM and will be hidden in player-facing material.</span
              >
            </v-tooltip>
          </div>
          <cc-rich-text-area :item="item" note-property="Note" />
        </v-container>
      </v-card>
    </div>
    <v-footer app color="panel">
      <v-btn variant="tonal" size="small" :to="`/gm/print/${typeText.toLowerCase()}/${item.ID}`"
        ><v-icon start icon="mdi-printer" />Print</v-btn
      >
      <v-btn variant="tonal" size="small" class="ml-2" @click="exportItem(item)"
        ><v-icon start icon="mdi-upload" />Export</v-btn
      >
      <v-spacer />
      <v-menu v-model="dupeMenu" offset-y offset-x top left>
        <template #activator="{ props }">
          <v-btn variant="tonal" size="small" class="mx-3" v-bind="props"
            ><v-icon start icon="mdi-content-copy" />Duplicate</v-btn
          >
        </template>
        <cc-confirmation content="Confirm duplication of this NPC" @confirm="dupe()" />
      </v-menu>
      <v-menu v-model="deleteMenu" offset-y offset-x top left>
        <template #activator="{ props }">
          <v-btn variant="tonal" size="small" color="error" class="mx-3" v-bind="props"
            ><v-icon start icon="mdi-delete" />Delete</v-btn
          >
        </template>
        <cc-confirmation
          content="This will reset delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
          @confirm="deleteItem()" />
      </v-menu>
      <v-btn variant="tonal" size="small" color="secondary" class="mx-3" @click="save()"
        ><v-icon start icon="mdi-content-save" />Save and Exit</v-btn
      >
    </v-footer>
  </v-card>
</template>

<script lang="ts">
import { CompendiumStore, EncounterStore } from '@/stores';
import NoteEditor from '../../_components/NoteEditor.vue';
import SectionEditor from '../../_components/SectionEditor.vue';
import GmLabelEditor from '../../_components/_subcomponents/GMLabelEditor.vue';
import GmFolderEditor from '../../_components/_subcomponents/GMFolderEditor.vue';
import SitrepEditor from './SitrepEditor.vue';
import EnvironmentEditor from './EnvironmentEditor.vue';
import MapEditor from './map/MapEditor.vue';
import MapPreview from './map/MapPreview.vue';
import { Encounter } from '@/classes/encounter/Encounter';
import exportAsJson from '@/util/jsonExport';

import CombatantEditor from './combatants/CombatantEditor.vue';

export default {
  name: 'gm-encounter-editor',
  components: {
    SectionEditor,
    NoteEditor,
    GmLabelEditor,
    GmFolderEditor,
    MapEditor,
    SitrepEditor,
    EnvironmentEditor,
    MapPreview,
    CombatantEditor,
  },
  props: {
    isNew: { type: Boolean },
    showDescription: { type: Boolean },
    item: { type: Object, required: true },
  },
  emits: ['exit'],
  data: () => ({
    printDialog: false,
    dupeMenu: false,
    deleteMenu: false,
    mapTab: 0,
  }),
  computed: {
    typeText() {
      if (!this.item) return 'ERR';
      return this.item.ItemType.toUpperCase();
    },
    sitreps() {
      return CompendiumStore().Sitreps;
    },
  },
  methods: {
    exitMapEditor() {
      (this.$refs as any).mapEditor.hide();

      (this.$refs as any).mapPreview.update();
    },
    exit() {
      this.$emit('exit');
    },
    saveAsNew() {
      EncounterStore().AddEncounter(this.item as Encounter);
      this.exit();
    },
    save() {
      EncounterStore().SaveEncounterData();
      this.$emit('exit');
    },
    deleteItem() {
      (this.item as Encounter).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      EncounterStore().CloneEncounter(this.item as Encounter);
      this.$emit('exit');
    },
    exportItem(item) {
      exportAsJson(Encounter.Serialize(item), `${item.Name}.json`);
    },
  },
};
</script>
