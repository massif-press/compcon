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
          <i18n-t keypath="mainMenu.storage.iosWarning" tag="span" scope="global">
            <template #emphasis><b>{{ $t("mainMenu.storage.autoDeleteData") }}</b></template>
          </i18n-t>
        </div>
        <ol class="mt-2 ml-4">
          <li>
            <i18n-t keypath="mainMenu.storage.iosStep1" tag="span" scope="global">
              <template #share><b>{{ $t("mainMenu.storage.shareLabel") }}</b></template>
              <template #icon><v-icon size="small" icon="mdi-export-variant" /></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="mainMenu.storage.iosStep2" tag="span" scope="global">
              <template #target><b>{{ $t("mainMenu.storage.addToHomeScreen") }}</b></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="mainMenu.storage.iosStep3" tag="span" scope="global">
              <template #target><b>{{ $t("common.add") }}</b></template>
            </i18n-t>
          </li>
        </ol>
        <div class="mt-2">{{ $t("mainMenu.storage.onceInstalled") }}</div>
        <div class="text-center">
          <cc-button class="mt-3"
            color="primary"
            block
            size="x-small"
            @click="showIosWarning = false">
            {{ $t("mainMenu.storage.continueAnyway") }}
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
          <i18n-t keypath="mainMenu.storage.noStorageWarning" tag="span" scope="global">
            <template #recommended><b>{{ $t("mainMenu.storage.stronglyRecommended") }}</b></template>
            <template #pwaLink><a class="text-secondary" href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank">{{ $t("mainMenu.storage.asPwa") }}<v-icon size="small" icon="mdi-open-in-new" /></a></template>
          </i18n-t>
        </div>
        <div v-else>
          <i18n-t keypath="mainMenu.storage.v3StorageWarning" tag="span" scope="global">
            <template #permission><b>{{ $t("mainMenu.storage.persistentStoragePermission") }}</b></template>
          </i18n-t>
        </div>
        <div v-if="allowedStorageState === 'denied' || allowedStorageState === 'prompt'"
          class="mt-2 pa-2"
          style="border: white 1px solid">
          <b>{{ $t("mainMenu.storage.denialNotice") }}</b>
        </div>
        <div class="text-center">
          <cc-button class="mt-2"
            color="primary"
            block
            size="x-small"
            @click="show = false">
            {{ $t("common.continue") }}
          </cc-button>
        </div>
      </cc-alert>
      <v-fade-transition>
        <div v-if="!show"
          class="text-white">
          <b>{{ $t("mainMenu.storage.activated") }}</b>
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
