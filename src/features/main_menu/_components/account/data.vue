<template>
  <v-container :class="!mobile && 'px-12'">
    <v-progress-linear
      :model-value="(cloudUseMb / cloudMaxMb) * 100"
      color="secondary"
      bg-color="primary"
      height="35">
      <v-chip size="small" variant="elevated" elevation="0">
        {{ ((cloudUseMb / cloudMaxMb) * 100).toFixed(3) }}%
      </v-chip>
    </v-progress-linear>
    <div class="text-center flavor-text">
      DATA USAGE
      <cc-slashes />
      {{ (cloudUseMb >= 1 ? cloudUseMb : cloudUseKb).toFixed(2) }}
      {{ cloudUseMb >= 1 ? 'MB' : 'KB' }} of {{ cloudMaxMb.toFixed(2) }} MB
      <v-btn size="x-small" variant="tonal" color="exotic">
        <v-icon icon="mdi-star" start size="large" />
        Upgrade
      </v-btn>
    </div>
    <br />

    <sync-settings />

    <cloud-data-viewer />

    <cloud-archive />

    <div class="my-8 text-right">
      <v-btn color="accent" size="small" disabled>Account Migration Tool</v-btn>
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
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
