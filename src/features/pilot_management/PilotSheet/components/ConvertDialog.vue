<template>
  <v-card-text>
    <v-alert variant="tonal" density="compact" border prominent icon="mdi-alert">
      Converting this pilot to local data will allow local editing but remove its remote link to the
      author's cloud account, and prevent any further updates from being received. To re-enable
      remote syncing, you will have to re-import this pilot via its share code.
    </v-alert>

    <div>
      <v-btn
        color="primary"
        class="mt-3"
        @click="convert()"
        :loading="loading"
        :disabled="loading"
        block>
        Convert to Local
      </v-btn>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import { generateCode, refreshItem } from '@/io/apis/share';
import { UserStore } from '@/stores';

export default {
  name: 'share-dialog',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    loading: false,
  }),
  emits: ['close'],
  methods: {
    async convert() {
      this.loading = true;
      UserStore().deleteRemoteItem(this.pilot.SaveController.RemoteCode);
      this.pilot.CloudController.GenerateMetadata();
      this.pilot.SaveController.ClearRemote();
      await UserStore().refreshDbData();
      this.loading = false;
      this.$emit('close');
    },
  },
};
</script>
