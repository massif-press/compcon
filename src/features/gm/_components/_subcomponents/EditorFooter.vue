<template>
  <v-footer app
    color="surface"
    class="px-3"
    :class="mobile && 'mb-1'"
    :height="mobile ? 28 : 'auto'">
    <v-menu v-model="deleteMenu"
      max-width="500px">
      <template #activator="{ props }">
        <cc-button prepend-icon="mdi-delete"
          :size="mobile ? 'x-small' : 'small'"
          color="error"
          v-bind="props">
          Delete
        </cc-button>
      </template>
      <v-card-text>
        <cc-confirmation
          content="This will delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
          @confirm="deleteItem()" />
      </v-card-text>
    </v-menu>

    <v-spacer />

    <cc-button prepend-icon="mdi-printer"
      :size="mobile ? 'x-small' : 'small'"
      @click="$emit('print', item.ID)">
      Print
    </cc-button>
    <cc-button prepend-icon="mdi-upload"
      :size="mobile ? 'x-small' : 'small'"
      class="ml-2"
      @click="$emit('export', item)">
      Export
    </cc-button>
    <slot name="footer" />

    <cc-dialog v-if="!isRemote && isAuthed"
      title="Share Code"
      icon="mdi-broadcast"
      :close-on-click="false">
      <template #activator="{ open }">
        <cc-button color="panel"
          class="mx-2"
          :size="mobile ? 'x-small' : 'small'"
          @click="open">
          <v-icon start
            icon="mdi-broadcast" />
          Share Code
        </cc-button>
      </template>
      <share-dialog :item="item" />
    </cc-dialog>
    <v-spacer v-if="!isRemote && isAuthed" />

    <v-menu v-if="isRemote"
      v-model="convertMenu"
      offset-y
      offset-x
      top
      left>
      <template #activator="{ props }">
        <cc-button :size="mobile ? 'x-small' : 'small'"
          class="mx-3"
          v-bind="props">
          <v-icon start
            icon="mdi-content-copy" />
          Convert
        </cc-button>
      </template>
      <cc-confirmation content="Converting this item to local data will allow local editing but remove its remote link to the
      author's cloud account, and prevent any further updates from being received. To re-enable
      remote syncing, you will have to re-import this item via its share code."
        @confirm="$emit('convert')" />
    </v-menu>

    <v-tooltip v-if="isRemote">
      <template #activator="{ props }">
        <cc-button :size="mobile ? 'x-small' : 'small'"
          :disabled="item.CloudController.isSynced"
          class="mx-3"
          v-bind="props">
          <v-icon start>mdi-cloud-sync</v-icon>
          Update
        </cc-button>
      </template>
      {{
        isAuthed
          ? item.CloudController.isSynced
            ? 'Item is up to date with remote changes'
            : 'Download all remote changes to this item, overwriting local data.'
          : 'Must be logged in to update'
      }}
    </v-tooltip>

    <v-menu v-if="!isRemote"
      v-model="dupeMenu"
      offset-y
      offset-x
      top
      left>
      <template #activator="{ props }">
        <cc-button :size="mobile ? 'x-small' : 'small'"
          class="ml-3"
          v-bind="props">
          <v-icon start
            icon="mdi-content-copy" />
          Duplicate
        </cc-button>
      </template>
      <cc-confirmation content="Confirm duplication of this NPC"
        @confirm="dupe()" />
    </v-menu>

    <cc-button v-if="isRemote"
      variant="tonal"
      :size="mobile ? 'x-small' : 'small'"
      color="secondary"
      class="mx-3"
      @click="$emit('exit')">
      <v-icon start
        icon="mdi-arrow-left" />
      Exit
    </cc-button>
  </v-footer>
</template>

<script lang="ts">
import { NpcStore, UserStore } from '@/stores';
import { useMobile } from '@/composables/useMobile';
import ShareDialog from '@/shared/ShareDialog.vue';

export default {
  name: 'GmEditorFooter',
  components: { ShareDialog },
  mixins: [useMobile],
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    hideToolbar: { type: Boolean, default: false },
  },
  emits: ['exit', 'export', 'convert', 'print'],
  data: () => ({
    deleteMenu: false,
    dupeMenu: false,
    convertMenu: false,
  }),
  computed: {
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
      const dupe = this.item.Clone();
      NpcStore().AddNpc(dupe);
      this.dupeMenu = false;
    },
  },
};
</script>
