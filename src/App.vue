<template>
  <v-app id="app">
    <a href="#main-content"
      class="skip-link">{{ $t('common.skipToMainContent') }}</a>
    <pwa-update-prompt />
    <cc-notify />
    <navbar aria-label="Main navigation" />
    <div :style="`height: ${heightOffset}`"
      class="no-print" />
    <main id="main-content"
      tabindex="-1">
      <router-view :key="$route.fullPath" />
    </main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useDisplay } from 'vuetify'
import CcNotify from '@/ui/notification/CCNotify.vue'
import Navbar from './features/nav/index.vue'
import PwaUpdatePrompt from '@/ui/components/PWAUpdatePrompt.vue'
import { UserStore, CompendiumStore } from './stores'
import type { UserProfile } from '@/user'
import {
  CompendiumDataKey,
  UserDataKey,
  type CompendiumDataProvider,
  type UserDataProvider,
} from '@/ui/providers'

const _display = useDisplay()

defineOptions({ name: 'CompCon' })

provide<CompendiumDataProvider>(CompendiumDataKey, {
  get Statuses() {
    return CompendiumStore().Statuses
  },
  get Frames() {
    return CompendiumStore().Frames
  },
  get NpcClasses() {
    return CompendiumStore().NpcClasses
  },
  get NpcFeatures() {
    return CompendiumStore().NpcFeatures
  },
  get ContentPacks() {
    return CompendiumStore().ContentPacks
  },
  getItemCollection: (itemType) => CompendiumStore().getItemCollection(itemType),
  referenceLink: (item, internal) => CompendiumStore().referenceLink(item, internal),
})
provide<UserDataProvider>(UserDataKey, {
  get User() {
    return UserStore().User as UserProfile
  },
  get IsLoggedIn() {
    return UserStore().IsLoggedIn
  },
  get CloudImages() {
    return UserStore().CloudImages
  },
  get CloudStorageUsed() {
    return UserStore().CloudStorageUsed
  },
  get MaxCloudStorage() {
    return UserStore().MaxCloudStorage
  },
  get CloudStorageFull() {
    return UserStore().CloudStorageFull
  },
  downloadLcp: (pack) => UserStore().downloadLcp(pack),
  refreshDbData: () => UserStore().refreshDbData(),
})

document.documentElement.setAttribute('data-font', 'inter')
window.addEventListener('beforeunload', UserStore().OnUnload)

const heightOffset = computed(() => {
  if (_display.xs.value) {
    return '24px'
  } else {
    return '41px'
  }
})

</script>
