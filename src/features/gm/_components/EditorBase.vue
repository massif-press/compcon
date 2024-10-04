<template>
  <div v-show="item">
    <v-card class="rounded-0 pb-12 elevation-0" color="transparent">
      <v-toolbar
        v-if="!readonly && !hideToolbar"
        density="compact"
        class="rounded-0 pl-2"
        color="primary">
        <div class="heading h3 pa-1 text-white">
          <v-icon start size="large" icon="mdi-robot-industrial" />
          {{ typeText }} EDITOR
        </div>
        <v-spacer />
        <v-btn icon @click="$emit('exit')">
          <v-icon large color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container style="position: relative">
        <div style="position: absolute; top: 4px; right: -10px">
          <cc-brew-info v-if="item.BrewController" :controller="item.BrewController" />
        </div>
        <v-row>
          <v-col cols="9">
            <slot name="builder" />
            <div v-if="!readonly || (readonly && item.Description?.length > 0)">
              <div class="text-overline">{{ typeText }} DESCRIPTION</div>
              <cc-rich-text-area :readonly="readonly" v-model="item.Description" />
            </div>
            <slot name="stats" />
          </v-col>
          <v-col cols="3" class="text-center ml-auto">
            <gm-folder-editor :readonly="readonly" :item="item" class="mb-1" />
            <gm-label-editor :readonly="readonly" :item="item" class="mb-4" />
            <cc-img :src="item.PortraitController.Image" />
            <div v-if="!readonly">
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
            </div>
          </v-col>
        </v-row>
        <slot />
        <cc-icon-divider v-if="!readonly" icon="mdi-robot-industrial" />

        <div v-if="!readonly || (readonly && item.NarrativeController.TextItems.length)">
          <div class="text-caption">ADDITIONAL DETAIL</div>
          <section-editor :item="item" :readonly="readonly" />
        </div>

        <div v-if="!readonly || (readonly && item.NarrativeController.Clocks.length)">
          <v-divider class="my-2" />
          <div class="text-caption">CLOCKS</div>
          <cc-clock
            v-for="c in item.NarrativeController.Clocks"
            :clock="c"
            class="mx-1 my-2"
            :readonly="readonly"
            @delete="item.NarrativeController.DeleteClock(c)" />
          <v-row v-if="!readonly" justify="end">
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
        </div>

        <div v-if="!readonly || (readonly && item.NarrativeController.Tables.length)">
          <v-divider class="my-2" />
          <div
            v-if="!readonly || (readonly && item.NarrativeController.Tables.length)"
            class="text-caption">
            TABLES
          </div>
          <cc-rollable-table
            v-for="t in item.NarrativeController.Tables"
            :table="t"
            class="mx-1 my-2"
            :readonly="readonly"
            @delete="item.NarrativeController.DeleteTable(t)" />
          <v-row v-if="!readonly" justify="end">
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
        </div>

        <div v-if="!readonly || (readonly && item.Note.length)">
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
              <span>
                This is only visible to the GM and will be hidden in player-facing material.
              </span>
            </v-tooltip>
          </div>
          <cc-rich-text-area :readonly="readonly" v-model="item.Note" />
        </div>
      </v-container>
    </v-card>
  </div>
  <v-footer
    v-if="!readonly && !hideFooter"
    app
    color="panel"
    :style="footerOffset ? 'margin-bottom: 30px' : ''">
    <v-btn variant="tonal" size="small" @click="routePrint(item.ID)">
      <v-icon start icon="mdi-printer" />
      Print
    </v-btn>
    <v-btn variant="tonal" size="small" class="ml-2" @click="$emit('export', item)">
      <v-icon start icon="mdi-upload" />
      Export
    </v-btn>
    <slot name="footer" />
    <v-spacer />
    <v-menu v-model="dupeMenu" offset-y offset-x top left>
      <template #activator="{ props }">
        <v-btn variant="tonal" size="small" class="mx-3" v-bind="props">
          <v-icon start icon="mdi-content-copy" />
          Duplicate
        </v-btn>
      </template>
      <cc-confirmation content="Confirm duplication of this NPC" @confirm="copy()" />
    </v-menu>
    <v-menu v-model="deleteMenu" offset-y offset-x top left>
      <template #activator="{ props }">
        <v-btn variant="tonal" size="small" color="error" class="mx-3" v-bind="props">
          <v-icon start icon="mdi-delete" />
          Delete
        </v-btn>
      </template>
      <cc-confirmation
        content="This will reset delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
        @confirm="deleteItem()" />
    </v-menu>
    <v-btn variant="tonal" size="small" color="secondary" class="mx-3" @click="saveExit()">
      <v-icon start icon="mdi-content-save" />
      Save and Exit
    </v-btn>
  </v-footer>
</template>

<script lang="ts">
import NoteEditor from './NoteEditor.vue';
import SectionEditor from './SectionEditor.vue';
import GmLabelEditor from './_subcomponents/GMLabelEditor.vue';
import GmFolderEditor from './_subcomponents/GMFolderEditor.vue';

export default {
  name: 'gm-editor-base',
  components: { SectionEditor, NoteEditor, GmLabelEditor, GmFolderEditor },
  props: {
    showDescription: { type: Boolean },
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    hideToolbar: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    footerOffset: { type: Boolean, default: false },
  },
  emits: ['exit', 'save', 'add-new', 'copy', 'delete', 'export'],
  data: () => ({
    printDialog: false,
    dupeMenu: false,
    deleteMenu: false,
  }),
  computed: {
    typeText() {
      if (!this.item) return 'ERR';
      return this.item.ItemType.toUpperCase();
    },
  },
  methods: {
    deleteItem() {
      this.$emit('delete');
    },
    copy() {
      this.$emit('copy');
      this.$emit('exit');
    },
    saveExit() {
      this.$emit('save');
    },
    routePrint(id: string) {
      const narrativeTypes = ['character', 'location', 'faction'];
      if (narrativeTypes.includes(this.item.ItemType.toLowerCase()))
        this.$router.push(`/gm/print/narrative/${JSON.stringify([id])}`);
      else this.$router.push(`/gm/print/${JSON.stringify([id])}`);
    },
  },
};
</script>
