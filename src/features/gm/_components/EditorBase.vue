<template>
  <div v-show="item">
    <v-card class="rounded-0 pb-12 elevation-0" color="transparent">
      <v-container style="position: relative">
        <div style="position: absolute; top: 0; right: 0">
          <cc-brew-info v-if="item.BrewController" :controller="item.BrewController" />
        </div>
        <v-row>
          <v-col cols="12" md="9">
            <slot name="builder" />
            <div v-if="!readonly || (readonly && item.Description?.length > 0)">
              <div class="text-cc-overline">{{ typeText }} DESCRIPTION</div>
              <cc-rich-text-area :key="item.ID" :readonly="readonly" v-model="item.Description" />
            </div>
            <slot name="stats" />
          </v-col>
          <v-col cols="12" md="3" class="ml-auto pt-4">
            <v-row dense>
              <v-col cols="6" md="12">
                <gm-folder-editor :readonly="readonly" :item="item" class="mb-1" />
                <gm-label-editor :readonly="readonly" :item="item" class="mb-4" />
              </v-col>
              <v-col cols="6" md="12">
                <cc-img :src="item.PortraitController.Image" />
                <cc-modal v-if="!readonly" title="select image">
                  <template #activator="{ open }">
                    <cc-button
                      size="x-small"
                      block
                      prepend-icon="mdi-image-edit"
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
              </v-col>
              <v-col cols="12" v-if="!readonly || (readonly && item.Note.length)">
                <v-divider v-if="!mobile" class="my-3" />
                <cc-text-area
                  :readonly="readonly"
                  v-model="item.Note"
                  color="primary"
                  variant="outlined"
                  label="gm notes" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <slot />
      </v-container>
    </v-card>
  </div>

  <editor-footer
    v-if="!hideFooter && !readonly"
    :item="item"
    @print="routePrint($event)"
    @export="$emit('export', $event)"
    @exit="$emit('exit')" />
</template>

<script lang="ts">
import SectionEditor from './SectionEditor.vue';
import GmLabelEditor from './_subcomponents/GMLabelEditor.vue';
import GmFolderEditor from './_subcomponents/GMFolderEditor.vue';
import EditorFooter from './_subcomponents/EditorFooter.vue';
import { CloudController } from '@/classes/components';
import { UserStore } from '@/stores';

export default {
  name: 'gm-editor-base',
  components: {
    SectionEditor,
    GmLabelEditor,
    GmFolderEditor,
    EditorFooter,
  },
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
      else this.$router.push(`/gm/print/npcs/${JSON.stringify([id])}`);
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
