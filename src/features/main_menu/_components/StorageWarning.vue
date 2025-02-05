<template>
  <v-dialog v-model="show" min-width="300px" width="60vw">
    <cc-alert
      color="error"
      prominent
      icon="mdi-database-alert"
      title="Storage Permission Required!">
      <div v-if="!hasStorage">
        The current browser does not appear to support persistent storage. It is
        <b>strongly recommended</b>
        to run COMP/CON on a browser that is capable of storing persistent app data, or, saving and
        running COMP/CON
        <a
          class="text-secondary"
          href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
          target="_blank">
          as a PWA
          <v-icon size="small" icon="mdi-open-in-new" />
        </a>
      </div>
      <div v-else>
        As of the v3 update, COMP/CON requires more local device storage than is available by
        default. Functionality will be impaired unless COMP/CON is granted the
        <b>Persistent Storage Permission</b>
        for this browser.
      </div>
      <div
        v-if="allowedStorageState === 'denied' || allowedStorageState === 'prompt'"
        class="mt-2 pa-2"
        style="border: white 1px solid">
        <b>
          COMP/CON has detected that persistent storage has been denied for this app. Persistent
          storage must be enabled for COMP/CON to operate correctly
        </b>
      </div>
      <div class="text-center">
        <cc-button class="mt-2" color="primary" block size="x-small" @click="show = false">
          Continue
        </cc-button>
      </div>
    </cc-alert>
    <v-fade-transition>
      <div v-if="!show" class="text-white">
        <b>Persistent storage activated! Closing alert...</b>
      </div>
    </v-fade-transition>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'storage-warning',
  data: () => ({
    show: false,
    hasStorage: false,
    allowedStorage: false,
    allowedStorageState: '',
    hasQuota: false,
  }),
  async created() {
    this.hasStorage = await this.hasPermanentStorage();
    this.allowedStorageState = await this.hasPermanentStoragePermission();
    this.allowedStorage = this.allowedStorageState === 'granted';
    this.hasQuota = await this.storageQuota();
    this.show = (!this.hasStorage || !this.allowedStorage) && !this.hasQuota;
  },
  methods: {
    async hasPermanentStorage() {
      await navigator.storage.persist();
      return await navigator.storage.persisted();
    },
    async hasPermanentStoragePermission() {
      const res = await navigator.permissions.query({
        name: 'persistent-storage',
      });
      return res.state;
    },
    async storageQuota() {
      const est = await navigator.storage.estimate();
      if (!est.quota) return false;
      return est.quota / 1048576 > 5;
    },
  },
};
</script>
