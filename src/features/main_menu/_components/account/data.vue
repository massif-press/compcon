<template>
  <v-container :class="!mobile && 'px-12'">
    <v-progress-linear
      :model-value="(cloudUseMb / cloudMaxMb) * 100"
      color="secondary"
      bg-color="primary"
      tile
      height="35">
      <v-chip size="small" tile variant="elevated" elevation="0">
        {{ ((cloudUseMb / cloudMaxMb) * 100).toFixed(3) }}%
      </v-chip>
    </v-progress-linear>
    <div class="text-center flavor-text">
      DATA USAGE
      <cc-slashes />
      {{ (cloudUseMb >= 1 ? cloudUseMb : cloudUseKb).toFixed(2) }}
      {{ cloudUseMb >= 1 ? 'MB' : 'KB' }} of {{ cloudMaxMb.toFixed(2) }} MB
      <cc-button size="small" variant="tonal" color="info" prepend-icon="mdi-star" class="my-1">
        Upgrade
      </cc-button>
    </div>
    <br />
    <sync-settings />
    <br />
    <cloud-data-viewer />
    <br />
    <cloud-archive />

    <div class="my-8 text-right">
      <cc-button color="accent" size="small" disabled>Account Migration Tool</cc-button>
    </div>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import CloudArchive from './_components/cloudArchive.vue';
import CloudDataViewer from './_components/cloudDataViewer.vue';
import SyncSettings from './_components/syncSettings.vue';

export default {
  name: 'cloud-account-data',
  components: { SyncSettings, CloudDataViewer, CloudArchive },
  computed: {
    cloudUseKb() {
      return UserStore().CloudStorageUsed / 1024;
    },
    cloudUseMb() {
      return UserStore().CloudStorageUsed / 1024 / 1024;
    },
    cloudMaxMb() {
      return UserStore().MaxCloudStorage / 1024 / 1024;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
