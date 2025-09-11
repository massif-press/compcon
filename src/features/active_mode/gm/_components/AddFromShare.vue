<template>
  <cc-share-code-importer
    ref="importer"
    importType="pilot"
    blockBtn
    title="Add from Share Code"
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
      <cc-button
        color="primary"
        class="mb-1 mt-4 text-left"
        block
        :loading="dlLoading"
        :disabled="!($refs as any).importer.canDownload"
        tooltip="This will add a copy of this pilot to your encounter. If the author updates their original data, you will not receive those changes."
        @click="addToEncounter">
        add to encounter
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { CloudController } from '@/classes/components';
import { downloadFromS3 } from '@/io/apis/account';

export default {
  name: 'share-code-dialog',
  props: {
    pilots: {
      type: Object,
      required: true,
    },
  },
  emits: ['close', 'add'],
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
    async addToEncounter() {
      this.dlLoading = true;
      const itemData = await downloadFromS3(this.queryResult.uri);
      const itemType = this.queryResult.sortkey.split('_')[1];
      const item = await CloudController.NewByType(itemType, itemData);

      this.pilots.push(item);

      this.$emit('add', item);

      this.dlLoading = false;
      (this.$refs as any).importer.reset();
      ((this.$refs as any).importer as any).$refs.modal.close();
    },
  },
};
</script>
