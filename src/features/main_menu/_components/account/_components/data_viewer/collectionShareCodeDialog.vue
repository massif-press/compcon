<template>
  <cc-share-code-importer
    ref="importer"
    importType="collection"
    title="Add New Subscription"
    @set-query-result="queryResult = $event">
    <template #result>
      <collection-info :collection="queryResult" />
    </template>

    <template #actions>
      <v-btn
        flat
        color="accent"
        class="mb-1"
        :loading="dlLoading"
        :disabled="!($refs as any).importer.canDownload"
        @click="subscribe()">
        subscribe
      </v-btn>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import CollectionInfo from './collectionInfo.vue';

export default {
  name: 'share-code-dialog',
  components: { CollectionInfo },
  data: () => ({
    queryResult: null as any,
    dlLoading: false,
  }),
  methods: {
    async subscribe() {
      this.dlLoading = true;
      if (!this.queryResult) return;
      await UserStore().addContentSubscription(this.queryResult);
      await UserStore().updateRemoteCollection(this.queryResult);
      this.dlLoading = false;
      (this.$refs as any).importer.reset();
      (this.$refs as any).importer.close();
    },
  },
};
</script>
