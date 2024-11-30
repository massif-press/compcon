<template>
  <cc-share-code-importer
    ref="importer"
    :importType="importType"
    @set-query-result="queryResult = $event">
    <template #result>
      <div v-if="queryResult === null" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else>
        <v-row dense class="mb-n2">
          <v-col cols="auto" class="heading h4 text-accent mr-2">Name</v-col>
          <v-col cols="9">{{ queryResult.name }}</v-col>
        </v-row>
        <v-row dense class="my-n2">
          <v-col cols="auto" class="heading h4 text-accent mr-2">Author</v-col>
          <v-col cols="9">{{ queryResult.author }}</v-col>
        </v-row>
        <v-row dense class="my-n2">
          <v-col cols="auto" class="heading h4 text-accent mr-2">Type</v-col>
          <v-col cols="9">{{ queryResult.sortkey.split('_')[1] }}</v-col>
        </v-row>
        <v-row dense class="my-n2">
          <v-col cols="auto" class="heading h4 text-accent mr-2">Created</v-col>
          <v-col cols="9">{{ new Date(queryResult.created).toLocaleString() }}</v-col>
        </v-row>
        <v-row dense class="my-n2">
          <v-col cols="auto" class="heading h4 text-accent mr-2">Last Updated</v-col>
          <v-col cols="9">{{ new Date(queryResult.item_modified).toLocaleString() }}</v-col>
        </v-row>
      </div>
    </template>
    <template #actions>
      <v-btn
        flat
        color="accent"
        class="mb-1"
        :loading="dlLoading"
        :disabled="!($refs as any).importer.canDownload"
        @click="downloadAsRemote()">
        add as remote resource
        <v-tooltip location="top" max-width="300px">
          <template v-slot:activator="{ props }">
            <v-icon end class="fade-select" v-bind="props">mdi-help-circle-outline</v-icon>
          </template>
          <span>
            Adding this item as a remote resource will create a readonly version of this item linked
            to the author's original data. When the author saves an update to this item to their
            COMP/CON cloud account, your local version can receive those changes.
          </span>
        </v-tooltip>
      </v-btn>
      <br />
      <v-btn
        size="small"
        flat
        color="accent"
        :loading="dlLoading"
        :disabled="!($refs as any).importer.canDownload"
        @click="downloadAsCopy(false)">
        add as local copy
        <v-tooltip location="top" max-width="300px">
          <template v-slot:activator="{ props }">
            <v-icon end class="fade-select" v-bind="props">mdi-help-circle-outline</v-icon>
          </template>
          <span>
            Adding this item as a local copy will create a new, editable version of this item saved
            to your local COMP/CON data. Changes made to this item will not affect the author's
            original data, and you will not receive updates from the author.
          </span>
        </v-tooltip>
      </v-btn>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { CloudController } from '@/classes/components';
import { downloadFromS3 } from '@/io/apis/account';
import { UserStore } from '@/stores';

export default {
  name: 'share-code-dialog',
  props: {
    importType: {
      type: String,
      required: false,
      default: 'item',
    },
  },
  data: () => ({
    queryResult: null as any,
    dlLoading: false,
  }),
  methods: {
    async downloadAsRemote() {
      await this.downloadAsCopy(true);
    },
    async downloadAsCopy(remote = false) {
      this.dlLoading = true;
      const itemData = await downloadFromS3(this.queryResult.uri);
      const itemType = this.queryResult.sortkey.split('_')[1];
      const item = await CloudController.NewByType(itemType, itemData);
      if (remote) {
        item.CloudController.setRemoteMetadata(this.queryResult);
        UserStore().addRemoteItem(this.queryResult.code);
      } else {
        item.CloudController.GenerateMetadata();
      }
      await CloudController.AddByType(itemType, item);

      this.dlLoading = false;
      (this.$refs as any).importer.reset();
      (this.$refs as any).importer.close();
    },
  },
};
</script>
