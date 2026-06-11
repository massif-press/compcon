<template>
  <v-app-bar v-if="!hide"
    app
    color="primary"
    :class="!mobile && 'clipped-large'"
    class="no-print"
    density="compact"
    :height="mobile ? '40' : '58'"
    style="z-index: 998">

    <cc-button v-if="standalone"
      :size="mobile ? 'large' : 'x-large'"
      icon="mdi-arrow-left"
      :tooltip="n.navigateBack"
      tooltip-location="bottom"
      @click="$router.go(-1)" />
    &nbsp;

    <cc-button v-if="standalone"
      :size="mobile ? 'large' : 'x-large'"
      icon="mdi-arrow-right"
      :tooltip="n.navigateForward"
      tooltip-location="bottom"
      @click="$router.go(1)" />
    &nbsp;


    <cc-button :size="mobile ? 'large' : 'x-large'"
      icon="mdi-home"
      :tooltip="n.mainMenu"
      tooltip-location="bottom"
      @click="$router.push({ name: 'main-menu' })" />

    &nbsp;

    <cc-button :size="mobile ? 'large' : 'x-large'"
      icon="mdi-book"
      :tooltip="n.compendium"
      tooltip-location="bottom"
      @click="$router.push({ path: '/srd' })" />

    &nbsp;

    <cc-button :size="mobile ? 'large' : 'x-large'"
      icon="cc:pilot"
      :tooltip="n.pilotManagement"
      tooltip-location="bottom"
      @click="$router.push({ path: '/pilot_management' })" />

    &nbsp;

    <v-menu location="bottom"
      open-on-hover>
      <template #activator="{ props }">
        <span v-bind="props">
          <cc-button :size="mobile ? 'large' : 'x-large'"
            icon="cc:encounter"
            @click="$router.push({ path: '/gm' })" />
        </span>
      </template>
      <v-list density="compact"
        class="text-caption pa-0">
        <v-list-item slim
          @click="$router.push({ path: '/gm/npcs' })">
          {{ n.npcRoster }}
        </v-list-item>
        <v-list-item slim
          @click="$router.push({ path: '/gm/encounters' })">
          {{ n.encounters }}
        </v-list-item>
        <v-list-item slim
          @click="$router.push({ path: '/gm/narrative' })">
          {{ n.narrativeElements }}
        </v-list-item>
        <v-list-item v-if=isDevsite
          slim
          @click="$router.push({ path: '/gm/campaigns' })">
          {{ n.campaignManager }}
        </v-list-item>
      </v-list>
    </v-menu>

    &nbsp;

    <cc-button :size="mobile ? 'large' : 'x-large'"
      icon="cc:campaign"
      :tooltip="n.activeMode"
      tooltip-location="bottom"
      @click="$router.push({ path: '/active-mode' })" />

    &nbsp;

    <v-tooltip location="bottom"
      open-delay="500ms">
      <template #activator="{ props }">
        <span v-bind="props">
          <cc-button :size="mobile ? 'large' : 'x-large'"
            icon="mdi-contain"
            @click="refModal = true"></cc-button>
        </span>
      </template>
      <span>{{ n.quickReference }}</span>
    </v-tooltip>

    &nbsp;

    <cc-modal v-model="refModal"
      :title="n.quickReference">
      <reference is-modal />
    </cc-modal>

    <v-divider v-if="!mobile"
      vertical
      class="ml-4 mr-1" />

    <v-toolbar-title v-if="!mobile">
      <span v-if="StorageWarning">
        <v-tooltip location="bottom"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="warning"
              icon="mdi-database-alert"
              start />
          </template>
          <span>
            <v-chip color="warning"
              variant="elevated"
              size="x-small">
              {{ n.storageWarning }}
            </v-chip>
            {{ n.storageWarningTooltip }}
          </span>
        </v-tooltip>
      </span>
      <span v-else-if="StorageMax">
        <v-tooltip location="bottom"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="error"
              icon="mdi-database-off"
              start />
          </template>
          <span>
            <v-chip color="error"
              variant="elevated"
              size="x-small">
              {{ n.storageAlert }}
            </v-chip>
            {{ n.storageAlertTooltip }}

            <v-alert color="error">
              <b>{{ n.noNewItemsSaved }}</b>
            </v-alert>
            {{ n.storageDetailsPrefix }}
            <b>{{ n.storageTab }}</b>
            {{ n.storageDetailsSuffix }}
          </span>
        </v-tooltip>
        <v-dialog v-model="storageFullDialog"
          width="780px">
          <v-card>
            <v-toolbar color="error"
              class="heading h2">
              <v-toolbar-title>
                <v-icon icon="mdi-database-off"
                  start />
                {{ n.storageLimitExceeded }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon
                @click="storageFullDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p>
                {{ n.storageAlertTooltip }}
                <br />
                <br />
                <b class="text-accent">
                  {{ n.noNewItemsSaved }}
                </b>
                <br />
                <br />
                {{ n.storageDetailsPrefix }}
                <b>{{ n.storageTab }}</b>
                {{ n.storageDetailsSuffix }}
              </p>
            </v-card-text>
          </v-card>
        </v-dialog>
      </span>
      <span v-if="!mobile">
        <span class="heading">{{ n.appName }}</span>
        <span class="flavor-text text-white"
          style="opacity: 0.4">
          &nbsp;{{ appVersion }}
        </span>
      </span>
    </v-toolbar-title>

    <v-spacer />

    <v-chip v-if="!isOnline"
      color="warning"
      size="small"
      prepend-icon="mdi-wifi-off"
      class="mr-2">
      {{ n.offline }}
    </v-chip>

    <v2-auto />

    <search-component />

    <v-divider v-if="!portrait"
      vertical
      class="mx-1" />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <cc-modal :title="n.cloudAccount"
          icon="mdi-cloud-sync-outline">
          <template #activator="{ open }">
            <cc-button v-bind="props"
              class="mx-1"
              :size="mobile ? 'small' : ''"
              icon="mdi-cloud-sync-outline"
              @click="open" />
            <v-badge :model-value="notifications.length > 0"
              dot
              color="secondary"
              :content="notifications.length" />
          </template>
          <cloud-page />
        </cc-modal>
      </template>
      {{ n.cloudAccount }}
    </v-tooltip>

    <v-divider v-if="!mobile"
      vertical
      class="mx-1" />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <cc-modal :title="n.achievements"
          icon="cc:achievement_1">
          <template #activator="{ open }">
            <cc-button v-bind="props"
              class="mx-1"
              :size="mobile ? 'small' : ''"
              icon="cc:achievement_1"
              :disabled="UserStoreLoading"
              @click="open" />
          </template>
          <template #default="{ close }">
            <achievements-page @close="close()" />
          </template>
        </cc-modal>
      </template>
      {{ n.achievements }}
    </v-tooltip>

    <v-divider v-if="!mobile"
      vertical
      class="mx-1" />

    <v-menu>
      <template #activator="{ props }">
        <cc-button class="mx-1"
          :size="mobile ? 'small' : ''"
          icon="mdi-dots-vertical"
          @click="props.onClick($event)" />
      </template>

      <v-list density="compact">
        <v-list-item @click.stop="contentModal = true">{{ n.manageContent }}</v-list-item>
        <content-page v-model="contentModal" />
        <cc-modal title="options"
          icon="mdi-cog">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ n.options }}</v-list-item>
          </template>
          <options-page />
        </cc-modal>
        <cc-modal title="about"
          icon="mdi-information-outline">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ n.about }}</v-list-item>
          </template>
          <about-page />
        </cc-modal>
        <cc-modal title="title"
          icon="cc:gms">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ n.credits }}</v-list-item>
          </template>
          <credits-page />
        </cc-modal>
        <cc-modal title="title"
          icon="mdi-help-circle-outline">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">{{ n.help }}</v-list-item>
          </template>
          <help-page />
        </cc-modal>
        <v-divider />
        <v-list-item target="_blank"
          href="https://www.patreon.com/compcon">
          {{ n.supportCompcon }}
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer v-if="!mobile"
      style="max-width: 20px" />
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import HelpPage from './pages/Help.vue'
import AboutPage from './pages/About.vue'
import CreditsPage from './pages/Credits.vue'
import OptionsPage from './pages/Options/index.vue'
import ContentPage from './pages/ExtraContent/index.vue'
import CloudPage from './pages/Cloud.vue'
import AchievementsPage from './pages/Achievements.vue'
import Reference from '../compendium/Views/Reference/Reference.vue'
import SearchComponent from './search/index.vue'
import V2Auto from './pages/ExtraContent/components/v2Auto.vue'
import { UserStore } from '@/stores'
import { useOnlineStatus } from '@/composables/useOnlineStatus'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()
const router = useRouter()

defineProps<{ pilotManagement?: boolean; encounter?: boolean }>()

const route = useRoute()
const { xs: portrait, mdAndDown: landscape } = useDisplay()
const mobile = portrait
const { isOnline } = useOnlineStatus()
const n = section('nav')

const userStore = UserStore()

const contentModal = ref(false)
const storageFullDialog = ref(userStore.LocalStorageFull)
const refModal = ref(false)

const hide = computed(() => route.path === '/')
const StorageWarning = computed(() => userStore.StorageWarning)
const StorageMax = computed(() => userStore.LocalStorageFull)
const appVersion = APP_VERSION || 'dev'
const notifications = computed(() => userStore.CloudNotifications)
const standalone = window.matchMedia('(display-mode: standalone)').matches
const UserStoreLoading = computed(() => userStore.IsLoading)
const isDevsite = window.location.hostname === 'dev.compcon.app' || window.location.hostname === 'localhost'
</script>
