<template>
  <v-snackbar
    v-model="show"
    tile
    elevation="50"
    color="error"
    app
    centered
    absolute
    style="z-index: 999"
    timeout="-1"
    vertical
  >
    <v-alert color="error" prominent icon="mdi-database-alert" class="white--text">
      <div class="heading h2 text-center mb-2">Storage Permission Required!</div>
      <div v-if="!hasStorage">
        The current browser does not appear to support persistent storage. It is
        <b>strongly recommended</b>
        to run COMP/CON on a different browser that is capable of storing persistent app data, or,
        saving COMP/CON as a PWA.
      </div>
      <div v-else>
        As of the X.X.X update, COMP/CON requires more local device storage than is available by
        default. Functionality will be impaired unless COMP/CON is granted the
        <b>Persistant Storage Permission</b>
        for this browser.
      </div>
      <div
        v-if="allowedStorageState === 'denied' || allowedStorageState === 'prompt'"
        class="mt-2 pa-2"
        style="border: white 1px solid"
      >
        <b>
          COMP/CON has detected that persistent storage has been denied for this app. Persistent
          storage must be enabled for COMP/CON to operate correctly
        </b>
      </div>
    </v-alert>
    <v-fade-transition>
      <div v-if="!show" class="white--text">
        <b>Persistent storage activated! Closing alert...</b>
      </div>
    </v-fade-transition>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" class="fadeSelect" @click="show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'storage-warning',
  data: () => ({
    show: false,
    hasStorage: false,
    allowedStorage: false,
    allowedStorageState: '',
  }),
  async mounted() {
    this.hasStorage = await this.hasPermanentStorage()
    this.allowedStorageState = await this.hasPermanentStoragePermission()
    this.allowedStorage = this.allowedStorageState === 'granted'
    this.show = !this.hasStorage || !this.allowedStorage
  },
  methods: {
    async hasPermanentStorage() {
      return await navigator.storage.persist()
    },
    async hasPermanentStoragePermission() {
      const res = await navigator.permissions.query({ name: 'persistent-storage' })

      return res.state
    },
  },
})
</script>
