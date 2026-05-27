<template>
  <cc-share-code-importer ref="importer"
    import-type="pilot"
    block-btn
    title="Add from Share Code"
    :user-id="userId"
    :remote-items="remoteItems"
    @set-query-result="queryResult = $event">
    <template #result>
      <share-code-result :query-result="queryResult" />
    </template>
    <template #actions>
      <cc-button color="primary"
        class="mb-1 mt-4 text-left"
        block
        :loading="dlLoading"
        tooltip="This will add a copy of this pilot to your encounter. If the author updates their original data, you will not receive those changes."
        @click="addToEncounter">
        add to encounter
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { CloudController } from '@/classes/components/cloud/CloudController';
import { downloadFromS3 } from '@/io/apis/account';
import { UserStore } from '@/stores';
import ShareCodeResult from '@/shared/ShareCodeResult.vue';

export default {
  name: 'ShareCodeDialog',
  components: { ShareCodeResult },
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
    mobile() { return this.$vuetify.display.mdAndDown },
    userId() { return UserStore().Cognito?.userId },
    remoteItems() { return UserStore().UserMetadata?.RemoteItems ?? [] },
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
