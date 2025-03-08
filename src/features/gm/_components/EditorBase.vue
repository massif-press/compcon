<template>
  <div v-show="item">
    <v-card class="rounded-0 pb-12 elevation-0" color="transparent">
      <v-toolbar
        v-if="(isRemote && !hideToolbar) || (!readonly && !hideToolbar)"
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
        <div style="position: absolute; top: 0; right: 0">
          <cc-brew-info v-if="item.BrewController" :controller="item.BrewController" />
        </div>
        <v-row>
          <v-col cols="9">
            <slot name="builder" />
            <div v-if="!readonly || (readonly && item.Description?.length > 0)">
              <div class="text-cc-overline">{{ typeText }} DESCRIPTION</div>
              <cc-rich-text-area :readonly="readonly" v-model="item.Description" />
            </div>
            <slot name="stats" />
          </v-col>
          <v-col cols="3" class="ml-auto pt-4">
            <gm-folder-editor :readonly="readonly" :item="item" class="mb-1" />
            <gm-label-editor :readonly="readonly" :item="item" class="mb-4" />
            <cc-img :src="item.PortraitController.Image" />
            <div v-if="!readonly">
              <cc-button
                size="x-small"
                block
                prepend-icon="mdi-image-edit"
                color="primary"
                @click="($refs as any).imageSelector.open()">
                Change Image
              </cc-button>
              <cc-image-selector
                ref="imageSelector"
                :item="item"
                type="doodad"
                @set="item.PortraitController.Image = $event" />
            </div>
            <div v-if="!readonly || (readonly && item.Note.length)">
              <v-divider class="my-3" />
              <cc-text-area
                :readonly="readonly"
                v-model="item.Note"
                color="primary"
                variant="outlined"
                label="gm notes" />
            </div>
          </v-col>
        </v-row>
        <slot />
      </v-container>
    </v-card>
  </div>
  <v-footer v-if="isRemote || (!readonly && !hideFooter)" app color="surface" class="px-3">
    <v-menu v-if="!isRemote" v-model="deleteMenu" max-width="500px">
      <template #activator="{ props }">
        <cc-button prepend-icon="mdi-delete" size="small" color="error" v-bind="props">
          Delete
        </cc-button>
      </template>
      <v-card-text>
        <cc-confirmation
          content="This will reset delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
          @confirm="deleteItem()" />
      </v-card-text>
    </v-menu>

    <v-spacer />

    <cc-button prepend-icon="mdi-printer" size="small" @click="routePrint(item.ID)">
      Print
    </cc-button>
    <cc-button prepend-icon="mdi-upload" size="small" class="ml-2" @click="$emit('export', item)">
      Export
    </cc-button>
    <slot name="footer" />

    <v-dialog max-width="800px">
      <template #activator="{ props }">
        <cc-button
          v-if="!isRemote && isAuthed"
          color="accent"
          @click="props.onClick($event)"
          variant="tonal"
          size="small">
          <v-icon start icon="mdi-broadcast" />
          Share Code
        </cc-button>
      </template>
      <template #default="{ isActive }">
        <v-card>
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title>Share Code</v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="isActive.value = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-alert variant="tonal" density="compact" border prominent icon="mdi-alert">
              A share code will allow other users with COMP/CON cloud accounts to download a copy of
              this item and subscribe to updates you make. Please be conscientious when updating
              data that is shared with others.
            </v-alert>
            <div v-if="item.CloudController.ShareCode">
              <v-row justify="center">
                <v-col sm="1">
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
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        variant="text"
                        class="ml-n3"
                        @click="copyCode()">
                        <v-icon>mdi-clipboard-text-outline</v-icon>
                      </v-btn>
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
        <cc-button variant="tonal" size="small" class="mx-3" v-bind="props">
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
        <cc-button size="small" class="ml-3" v-bind="props">
          <v-icon start icon="mdi-content-copy" />
          Duplicate
        </cc-button>
      </template>
      <cc-confirmation content="Confirm duplication of this NPC" @confirm="copy()" />
    </v-menu>

    <cc-button
      v-if="isRemote"
      variant="tonal"
      size="small"
      color="secondary"
      class="mx-3"
      @click="$emit('exit')">
      <v-icon start icon="mdi-arrow-left" />
      Exit
    </cc-button>
  </v-footer>
</template>

<script lang="ts">
import NoteEditor from './NoteEditor.vue';
import SectionEditor from './SectionEditor.vue';
import GmLabelEditor from './_subcomponents/GMLabelEditor.vue';
import GmFolderEditor from './_subcomponents/GMFolderEditor.vue';
import { CloudController } from '@/classes/components';
import { UserStore } from '@/stores';

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
    convertMenu: false,
    loading: false,
  }),
  computed: {
    typeText() {
      if (!this.item) return 'ERR';
      return this.item.ItemType.toUpperCase();
    },
    isRemote() {
      return this.item.SaveController.IsRemote;
    },
    isAuthed() {
      return UserStore().IsLoggedIn;
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
    routePrint(id: string) {
      const narrativeTypes = ['character', 'location', 'faction'];
      if (narrativeTypes.includes(this.item.ItemType.toLowerCase()))
        this.$router.push(`/gm/print/narrative/${JSON.stringify([id])}`);
      else this.$router.push(`/gm/print/${JSON.stringify([id])}`);
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
