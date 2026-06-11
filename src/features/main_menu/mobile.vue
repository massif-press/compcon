<template>
  <div class="pa-1 px-2"
    style="height: calc(100vh - 40px)">
    <div class="text-center">
      <v2-auto block />
    </div>
    <div style="position: absolute; top: 0; left: 0; right: 0; container-type: inline-size">
      <div class="bg-primary text-center">
        <span class="heading text-white"
          style="letter-spacing: 3cqw; line-height: 38pt; font-size: 33pt">
          COMP/CON
        </span>
        <div class="text-cc-overline"
          style="position: absolute; right: 2px; opacity: 0.8">
          v.{{ appVersion }}
        </div>
      </div>
    </div>

    <div class="d-flex justify-center align-center py-3 mt-4"
      style="height: calc(100% - 28px)">
      <v-row dense
        justify="space-around"
        style="height: 100%">
        <mobile-btn icon="cc:compendium"
          title="Compendium"
          :to="'/srd'" />
        <mobile-btn icon="cc:pilot"
          title="Roster"
          text="Manage Pilots"
          :to="'/pilot_management'" />
        <mobile-btn v-if="landscape"
          icon="cc:encounter"
          title="GM Toolkit"
          text="Manage Pilots"
          :to="'/gm'" />
        <mobile-btn icon="cc:content_manager"
          title="Content"
          @clicked="extraContentModal = true" />
        <extra-content v-model="extraContentModal" />
        <mobile-btn icon="cc:campaign"
          title="Active Mode"
          :to="'/active-mode'" />
      </v-row>
    </div>

    <v-bottom-navigation density="compact"
      class="bg-primary"
      style="border-radius: 12px; left: 12px; right: 12px; width: auto; bottom: calc(env(safe-area-inset-bottom, 0px) + 8px); box-shadow: 0 4px 16px rgba(0,0,0,0.4);">
      <v-row no-gutters
        align="center"
        justify="space-around">
        <v-col cols="auto">
          <cc-modal title="Cloud Account"
            icon="mdi-cloud-sync">
            <template #activator="{ open }">
              <cc-button v-if="landscape"
                :loading="startingUp"
                size="small"
                class="mx-2"
                :variant="isLoggedIn ? '' : 'outlined'"
                :color="isLoggedIn ? 'success' : ''"
                @click="open">
                {{ isLoggedIn ? $t('mainMenu.menu.connected') : $t('mainMenu.auth.signIn') }}
              </cc-button>

              <cc-button v-else
                :loading="startingUp"
                size="small"
                class="mx-2"
                :variant="isLoggedIn ? '' : 'outlined'"
                :color="isLoggedIn ? 'success' : ''"
                :icon="isLoggedIn ? 'mdi-cloud-sync' : 'mdi-cloud-off-outline'"
                @click="open" />
            </template>
            <sign-in />
          </cc-modal>
        </v-col>

        <v-divider vertical
          class="mr-2" />

        <v-col cols="auto">
          <cc-modal title="Options"
            icon="mdi-cog">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.menu.options') }}
              </cc-button>
            </template>
            <options-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal title="About"
            icon="mdi-information">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.menu.about') }}
              </cc-button>
            </template>
            <about-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal title="Credits"
            icon="cc:gms">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.menu.credits') }}
              </cc-button>
            </template>
            <credits-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal title="Help"
            icon="mdi-help-circle">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0"
                size="small"
                variant="text"
                @click="open">
                {{ $t('mainMenu.menu.help') }}
              </cc-button>
            </template>
            <help-page />
          </cc-modal>
        </v-col>
      </v-row>
    </v-bottom-navigation>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import MobileBtn from './_components/MobileBtn.vue'
import ExtraContent from '../nav/pages/ExtraContent/index.vue'
import CreditsPage from '../nav/pages/Credits.vue'
import AboutPage from '../nav/pages/About.vue'
import HelpPage from '../nav/pages/Help.vue'
import OptionsPage from '../nav/pages/Options/index.vue'
import { UserStore } from '@/stores'
import SignIn from './_components/login/index.vue'
import V2Auto from '../nav/pages/ExtraContent/components/v2Auto.vue'

const _display = useDisplay()

defineOptions({ name: 'LandingPageMobile' })

const extraContentModal = ref(false)

const userstore = computed(() => {
      return UserStore()
    })
const isLoggedIn = computed(() => {
      return UserStore().IsLoggedIn
    })
const startingUp = computed(() => {
      return UserStore().IsLoading
    })
const appVersion = computed(() => {
      return APP_VERSION || 'dev'
    })
const landscape = computed(() => {
      return _display.smAndUp.value
    })
</script>
