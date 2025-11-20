<template>
  <v-footer
    app
    color="surface"
    class="px-3"
    :class="mobile && 'mb-1'"
    :height="mobile ? 28 : 'auto'">
    <v-menu v-if="!isRemote" v-model="deleteMenu" max-width="500px">
      <template #activator="{ props }">
        <cc-button
          prepend-icon="mdi-delete"
          :size="mobile ? 'x-small' : 'small'"
          color="error"
          v-bind="props">
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

    <cc-button
      prepend-icon="mdi-printer"
      :size="mobile ? 'x-small' : 'small'"
      @click="$emit('print', item.ID)">
      Print
    </cc-button>
    <cc-button
      prepend-icon="mdi-upload"
      :size="mobile ? 'x-small' : 'small'"
      class="ml-2"
      @click="$emit('export', item)">
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
          :size="mobile ? 'x-small' : 'small'">
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
                        :size="mobile ? 'x-small' : 'small'"
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
        <cc-button variant="tonal" :size="mobile ? 'x-small' : 'small'" class="mx-3" v-bind="props">
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
          :size="mobile ? 'x-small' : 'small'"
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
        <cc-button :size="mobile ? 'x-small' : 'small'" class="ml-3" v-bind="props">
          <v-icon start icon="mdi-content-copy" />
          Duplicate
        </cc-button>
      </template>
      <cc-confirmation content="Confirm duplication of this NPC" @confirm="copy()" />
    </v-menu>

    <cc-button
      v-if="isRemote"
      variant="tonal"
      :size="mobile ? 'x-small' : 'small'"
      color="secondary"
      class="mx-3"
      @click="$emit('exit')">
      <v-icon start icon="mdi-arrow-left" />
      Exit
    </cc-button>
  </v-footer>
</template>

<script>
import { UserStore } from '@/stores';

export default {
  name: 'gm-editor-footer',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    hideToolbar: { type: Boolean, default: false },
  },
  data: () => ({
    deleteMenu: false,
    dupeMenu: false,
    convertMenu: false,
  }),
  emits: ['exit', 'export'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    isRemote() {
      return this.item.SaveController.IsRemote;
    },
    isAuthed() {
      return UserStore().IsLoggedIn;
    },
  },
  methods: {
    async save() {
      await this.item.SaveController.Save();
    },
    deleteItem() {
      this.item.SaveController.Delete();
      this.deleteMenu = false;
      this.$emit('exit');
    },
    dupe() {
      this.item.SaveController.Dupe();
      this.dupeMenu = false;
    },
  },
};
</script>
