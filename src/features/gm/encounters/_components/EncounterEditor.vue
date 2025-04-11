<template>
  <v-card>
    <div v-show="item">
      <v-card class="rounded-0 pb-12 elevation-0">
        <v-toolbar density="compact" class="rounded-0 pl-2" color="primary">
          <div class="heading h3 pa-1 text-white">
            <v-icon start size="large" icon="cc:encounter" />
            ENCOUNTER EDITOR
          </div>
          <v-spacer />
          <v-btn icon @click="$emit('exit')">
            <v-icon large color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row density="compact">
            <v-col cols="9">
              <v-row class="heading h1" dense>
                <cc-remote-hover :item="item" color="accent" />
                <cc-missing-content-hover :item="item" />
                <v-col>
                  <div class="mt-n3">
                    <cc-short-string-editor
                      large
                      :readonly="isRemote"
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
              <cc-rich-text-area :readonly="isRemote" v-model="item.Description" />

              <sitrep-editor :readonly="isRemote" :item="item" />

              <environment-editor :readonly="isRemote" :item="item" />
            </v-col>
            <v-col cols="3" class="text-center ml-auto">
              <gm-folder-editor :readonly="isRemote" :item="item" class="mb-1" />
              <gm-label-editor :readonly="isRemote" :item="item" class="mb-4" />
              <v-card flat tile>
                <v-tabs
                  v-model="mapTab"
                  grow
                  color="secondary"
                  bg-color="panel"
                  density="compact"
                  height="20">
                  <v-tab>Map</v-tab>
                  <v-tab>Image</v-tab>
                </v-tabs>
                <v-window v-model="mapTab">
                  <v-window-item>
                    <v-card style="height: 100%" variant="outlined">
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
                    <cc-modal title="Map Editor">
                      <template #activator="{ open }">
                        <cc-button
                          v-if="!isRemote"
                          size="x-small"
                          block
                          color="primary"
                          @click="open">
                          Edit Map
                        </cc-button>
                      </template>
                      <template #default="{ close }">
                        <map-editor :encounter="item" @exit="close" />
                      </template>
                    </cc-modal>
                  </v-window-item>
                  <v-window-item>
                    <cc-img :src="item.PortraitController.Image" />
                    <cc-modal title="Set Map Image">
                      <template #activator="{ open }">
                        <cc-button
                          v-if="!isRemote"
                          size="x-small"
                          block
                          color="primary"
                          @click="open">
                          Change Image
                        </cc-button>
                      </template>
                      <cc-image-selector
                        ref="imageSelector"
                        :item="item"
                        type="doodad"
                        @set="item.PortraitController.Image = $event" />
                    </cc-modal>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>

          <combatant-editor :encounter="item" :readonly="isRemote" />

          <cc-icon-divider icon="mdi-robot-industrial" class="mt-2" />
          <div class="text-caption">ADDITIONAL DETAIL</div>
          <section-editor :readonly="isRemote" :item="item" />
          <v-divider class="my-2" />
          <div class="text-caption">CLOCKS</div>
          <cc-clock
            v-for="c in item.NarrativeController.Clocks"
            :readonly="isRemote"
            :clock="c"
            class="mx-1 my-2"
            @delete="item.NarrativeController.DeleteClock(c)" />
          <v-row v-if="!isRemote" justify="end">
            <v-col cols="auto">
              <cc-button color="primary" size="small" @click="item.NarrativeController.AddClock()">
                <v-icon start>mdi-plus</v-icon>
                Add New Clock
              </cc-button>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="text-caption">TABLES</div>
          <cc-rollable-table
            v-for="t in item.NarrativeController.Tables"
            :readonly="isRemote"
            :table="t"
            class="mx-1 my-2"
            @delete="item.NarrativeController.DeleteTable(t)" />
          <v-row v-if="!isRemote" justify="end">
            <v-col cols="auto">
              <cc-button color="primary" size="small" @click="item.NarrativeController.AddTable()">
                <v-icon start>mdi-plus</v-icon>
                Add New Table
              </cc-button>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="text-caption mb-2">ADDITIONAL NOTES</div>
          <cc-rich-text-area :readonly="isRemote" v-model="item.Note" />
        </v-container>
      </v-card>
    </div>
    <v-footer app color="panel" height="28" class="border-t-sm">
      <cc-button
        size="small"
        color="primary"
        :to="`/gm/print/${typeText.toLowerCase()}/${item.ID}`">
        <v-icon start icon="mdi-printer" />
        Print
      </cc-button>
      <cc-button size="small" color="primary" class="ml-2" @click="exportItem(item)">
        <v-icon start icon="mdi-upload" />
        Export
      </cc-button>
      <v-spacer />
      <v-dialog max-width="800px">
        <template #activator="{ props }">
          <cc-button v-if="!isRemote && isAuthed" color="accent" v-bind="props" size="small">
            <v-icon start icon="mdi-broadcast" />
            Share Code
          </cc-button>
        </template>
        <template #default="{ isActive }">
          <v-card>
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title>Share Code</v-toolbar-title>
              <v-spacer />
              <cc-button icon @click="isActive.value = false">
                <v-icon>mdi-close</v-icon>
              </cc-button>
            </v-toolbar>
            <v-card-text>
              <v-alert density="compact" border prominent icon="mdi-alert">
                A share code will allow other users with COMP/CON cloud accounts to download a copy
                of this item and subscribe to updates you make. Please be conscientious when
                updating data that is shared with others.
              </v-alert>
              <div v-if="item.CloudController.ShareCode">
                <v-row justify="center">
                  <v-col cols="auto">
                    <div class="text-overline mb-n6">item SHARE CODE</div>
                    <b
                      class="text-accent"
                      style="font-size: 50px; letter-spacing: 15px"
                      v-text="
                        `${item.CloudController.ShareCode.substring(
                          0,
                          4
                        )}&ndash;${item.CloudController.ShareCode.substring(4, 8)}&ndash;${item.CloudController.ShareCode.substring(8, 12)}`
                      " />
                    <v-tooltip text="Copy share code to clipboard">
                      <template #activator="{ props }">
                        <cc-button
                          v-bind="props"
                          icon
                          size="small"
                          variant="text"
                          class="ml-n3"
                          @click="copyCode()">
                          <v-icon>mdi-clipboard-text-outline</v-icon>
                        </cc-button>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
      <v-spacer v-if="!isRemote && isAuthed" />

      <v-menu v-if="isRemote" v-model="convertMenu" offset-y offset-x top left>
        <template #activator="{ props }">
          <cc-button size="small" class="mx-3" v-bind="props">
            <v-icon start icon="mdi-content-copy" />
            Convert
          </cc-button>
        </template>
        <cc-confirmation
          content="Converting this item to local data will allow local editing but remove its remote link to the
      author's cloud account, and prevent any further updates from being received. To re-enable
      remote syncing, you will have to re-import this item via its share code."
          @confirm="convert()" />
      </v-menu>

      <v-tooltip v-if="isRemote">
        <template #activator="{ props }">
          <cc-button
            size="small"
            :disabled="item.CloudController.SyncStatus === 'Synced'"
            class="mx-3"
            v-bind="props">
            <v-icon start>mdi-cloud-sync</v-icon>
            Update
          </cc-button>
        </template>
        {{
          isAuthed
            ? item.CloudController.SyncStatus === 'Synced'
              ? 'Item is up to date with remote changes'
              : 'Download all remote changes to this item, overwriting local data.'
            : 'Must be logged in to update'
        }}
      </v-tooltip>

      <v-menu v-if="!isRemote" v-model="dupeMenu" offset-y offset-x top left>
        <template #activator="{ props }">
          <cc-button size="small" color="primary" class="mx-3" v-bind="props">
            <v-icon start icon="mdi-content-copy" />
            Duplicate
          </cc-button>
        </template>
        <cc-confirmation content="Confirm duplication of this NPC" @confirm="dupe()" />
      </v-menu>

      <v-menu v-if="!isRemote" v-model="deleteMenu" offset-y offset-x top left>
        <template #activator="{ props }">
          <cc-button size="small" color="error" class="mx-3" v-bind="props">
            <v-icon start icon="mdi-delete" />
            Delete
          </cc-button>
        </template>
        <cc-confirmation
          content="This will reset delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
          @confirm="deleteItem()" />
      </v-menu>
      <cc-button size="small" color="secondary" class="mx-3" @click="save()">
        <v-icon start icon="mdi-content-save" />
        Save and Exit
      </cc-button>
    </v-footer>
  </v-card>
</template>

<script lang="ts">
import { CompendiumStore, EncounterStore, UserStore } from '@/stores';
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
import { CloudController } from '@/classes/components';

export default {
  name: 'gm-encounter-editor',
  components: {
    SectionEditor,
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
    convertMenu: false,
    mapTab: 0,
    loading: false,
  }),
  computed: {
    typeText() {
      if (!this.item) return 'ERR';
      return this.item.ItemType.toUpperCase();
    },
    sitreps() {
      return CompendiumStore().Sitreps;
    },
    isRemote() {
      return (this.item as any).SaveController.IsRemote;
    },
    isAuthed() {
      return UserStore().IsLoggedIn;
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
    async remoteUpdate() {
      try {
        await CloudController.UpdateRemote(this.item);
        await UserStore().refreshDbData();
        this.$notify({
          title: `Sync Complete`,
          text: `${this.item.ItemType} ${this.item.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync ${this.item.ItemType} ${this.item.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    async convert() {
      this.loading = true;
      UserStore().deleteRemoteItem(this.item.SaveController.RemoteCode);
      this.item.CloudController.GenerateMetadata();
      this.item.SaveController.ClearRemote();
      await UserStore().refreshDbData();
      this.loading = false;
    },
    copyCode() {
      navigator.clipboard.writeText(this.item.CloudController.ShareCode);
      this.$notify({
        title: 'Copied',
        text: 'Share code copied to clipboard',
        data: { icon: 'mdi-clipboard-check', color: 'success' },
      });
    },
  },
};
</script>
