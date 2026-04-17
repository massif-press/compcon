<template>
  <cc-share-code-importer ref="importer"
    :import-type="importType"
    :block-btn="blockBtn"
    :size="size"
    :color="color"
    :full-width="fullWidth"
    :subtitle="subtitle"
    @set-query-result="queryResult = $event">
    <template #result>
      <div v-if="queryResult === null"
        class="text-center">
        <v-progress-circular indeterminate
          color="primary"></v-progress-circular>
      </div>
      <div v-else>
        <v-row dense
          class="mb-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Name</v-col>
          <v-col cols="9">{{ queryResult.name }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Author</v-col>
          <v-col cols="9">{{ queryResult.author }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Type</v-col>
          <v-col cols="9">{{ queryResult.sortkey.split('_')[1] }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Created</v-col>
          <v-col cols="9">{{ new Date(queryResult.created).toLocaleString() }}</v-col>
        </v-row>
        <v-row dense
          class="my-n2">
          <v-col cols="auto"
            class="heading h4 text-accent mr-2">Last Updated</v-col>
          <v-col cols="9">{{ new Date(queryResult.item_modified).toLocaleString() }}</v-col>
        </v-row>
      </div>
    </template>
    <template #actions>
      <cc-button color="primary"
        class="my-1"
        :loading="dlLoading"
        :disabled="!($refs as any).importer.isLoggedIn || ($refs as any).importer.isUserOwned || !($refs as any).importer.canDownload"
        :tooltip="!($refs as any).importer.isLoggedIn
          ? 'You must be logged in to add items as remote resources.'
          : 'Adding this item as a remote resource will create a readonly version of this item linked to the author\'s original data. When the author saves an update to this item to their COMP/CON cloud account, your local version can receive those changes.'"
        @click="downloadAsRemote()">
        add as remote resource
      </cc-button>
      <br />
      <cc-button size="small"
        color="primary"
        :loading="dlLoading"
        :disabled="!($refs as any).importer.canDownload"
        tooltip="Adding this item as a local copy will create a new, editable version of this item saved
            to your local COMP/CON data. Changes made to this item will not affect the author's
            original data, and you will not receive updates from the author."
        @click="downloadAsCopy(false)">
        add as local copy
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { CloudController } from '@/classes/components';
import { DownloadViaCode } from '@/io/apis/account';
import { UserStore } from '@/stores';

export default {
  name: 'ShareCodeDialog',
  props: {
    importType: {
      type: String,
      required: false,
      default: 'item',
    },
    blockBtn: {
      type: Boolean,
    },
    size: {
      type: String,
      required: false,
      default: 'small',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['close'],
  data: () => ({
    queryResult: null as any,
    dlLoading: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    async downloadAsRemote() {
      if (!UserStore().IsLoggedIn) return;
      await this.downloadAsCopy(true);
    },
    async downloadAsCopy(remote = false) {
      this.dlLoading = true;
      const itemData = await DownloadViaCode(this.queryResult.code);
      const itemType = this.queryResult.sortkey.split('_')[1];
      const item = await CloudController.NewByType(itemType, itemData);
      if (remote) {
        item.CloudController.setRemoteMetadata(this.queryResult);
        if (UserStore().IsLoggedIn)
          UserStore().addRemoteItem(this.queryResult.code);
      } else {
        item.CloudController.GenerateMetadata();
      }
      await CloudController.AddByType(itemType, item);

      this.dlLoading = false;
      (this.$refs as any).importer.reset();
      ((this.$refs as any).importer as any).$refs.modal.close();
    },
  },
};
</script>
