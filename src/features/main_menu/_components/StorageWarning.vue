<template>
  <div>
    <v-dialog v-model="showIosWarning"
      min-width="300px"
      width="60vw">
      <cc-alert color="warning"
        prominent
        icon="mdi-apple"
        title="Install COMP/CON for Reliable Storage">
        <div>
          iOS browsers limit storage for websites and may
          <b>automatically delete your data</b>
          after 7 days of inactivity. To prevent data loss, install COMP/CON to your home screen:
        </div>
        <ol class="mt-2 ml-4">
          <li>
            Tap the
            <b>Share</b>
            button
            <v-icon size="small"
              icon="mdi-export-variant" />
            in Safari's toolbar
          </li>
          <li>
            Scroll down and tap
            <b>Add to Home Screen</b>
          </li>
          <li>
            Tap
            <b>Add</b>
          </li>
        </ol>
        <div class="mt-2">Once installed, open COMP/CON from your home screen icon.</div>
        <div class="text-center">
          <cc-button class="mt-3"
            color="primary"
            block
            size="x-small"
            @click="showIosWarning = false">
            Continue Anyway
          </cc-button>
        </div>
      </cc-alert>
    </v-dialog>

    <v-dialog v-model="show"
      min-width="300px"
      width="60vw">
      <cc-alert color="error"
        prominent
        icon="mdi-database-alert"
        title="Storage Permission Required!">
        <div v-if="!hasStorage">
          The current browser does not appear to support persistent storage. It is
          <b>strongly recommended</b>
          to run COMP/CON on a browser that is capable of storing persistent app data, or, saving
          and
          running COMP/CON
          <a class="text-secondary"
            href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
            target="_blank">
            as a PWA
            <v-icon size="small"
              icon="mdi-open-in-new" />
          </a>
        </div>
        <div v-else>
          As of the v3 update, COMP/CON requires more local device storage than is available by
          default. Functionality will be impaired unless COMP/CON is granted the
          <b>Persistent Storage Permission</b>
          for this browser.
        </div>
        <div v-if="allowedStorageState === 'denied' || allowedStorageState === 'prompt'"
          class="mt-2 pa-2"
          style="border: white 1px solid">
          <b>
            COMP/CON has detected that persistent storage has been denied for this app. Persistent
            storage must be enabled for COMP/CON to operate correctly
          </b>
        </div>
        <div class="text-center">
          <cc-button class="mt-2"
            color="primary"
            block
            size="x-small"
            @click="show = false">
            Continue
          </cc-button>
        </div>
      </cc-alert>
      <v-fade-transition>
        <div v-if="!show"
          class="text-white">
          <b>Persistent storage activated! Closing alert...</b>
        </div>
      </v-fade-transition>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(false)
const showIosWarning = ref(false)
const hasStorage = ref(false)
const allowedStorage = ref(false)
const allowedStorageState = ref('')
const hasQuota = ref(false)

function isIosBrowser() {
      const isIos =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (!isIos) return false;
      const isStandalone =
        (navigator as any).standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;
      return !isStandalone;
    }
async function hasPermanentStorage() {
      await navigator.storage.persist();
      return await navigator.storage.persisted();
    }
async function hasPermanentStoragePermission() {
      try {
        const res = await navigator.permissions.query({
          name: 'persistent-storage',
        });
        return res.state;
      } catch {
        return 'granted';
      }
    }
async function storageQuota() {
  const est = await navigator.storage.estimate()
  if (!est.quota) return false
  return est.quota / 1048576 > 5
}

onMounted(async () => {
  if (isIosBrowser()) {
    showIosWarning.value = true
    return
  }
  hasStorage.value = await hasPermanentStorage()
  allowedStorageState.value = await hasPermanentStoragePermission()
  allowedStorage.value = allowedStorageState.value === 'granted'
  hasQuota.value = await storageQuota()
  show.value = (!hasStorage.value || !allowedStorage.value) && !hasQuota.value
})
</script>
