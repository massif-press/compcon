<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="!$vuetify.display.mdAndDown"
      ref="log" />
    <v-container fluid
      style="height: calc(100vh - 85px); margin-top: 20px">
      <v-row justify="space-between"
        align="center"
        style="height: 100%">
        <main-btn icon="cc:compendium"
          :to="'/srd'"
          help="Equipment Database"
          @hover="ccLog('compendium')">
          {{ $t('common.compendium') }}
        </main-btn>
        <main-btn icon="cc:pilot"
          :to="'/pilot_management'"
          help="Manage Pilots"
          @hover="ccLog('pilot')">
          {{ $t('common.pilotRoster') }}
        </main-btn>
        <main-btn icon="cc:encounter"
          :to="'/gm'"
          help="Manage Campaigns, Encounters, and NPCs"
          @hover="ccLog('gm')">
          {{ $t('gm.landing.toolkit') }}
        </main-btn>
        <main-btn icon="cc:campaign"
          :to="'/active-mode'"
          help="Run an Encounter or Active Character Sheet"
          @hover="ccLog('encounter')">
          {{ $t('common.activeMode') }}
        </main-btn>
        <main-btn icon="cc:content_manager"
          help="Import Content Packs"
          @hover="ccLog('content')"
          @clicked="extraContentModal = true">
          {{ $t('common.contentManager') }}
          <v-tooltip v-if="hasV2Backups"
            :text="$t('mainMenu.actions.v2ImportsAwaitingResolution')">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-alert"
                size="24"
                color="warning"
                class="ml-1 mt-n2" />
            </template>
          </v-tooltip>


          <extra-content v-model="extraContentModal" />
        </main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary"
      app
      fixed
      height="32">
      <v-row no-gutters
        justify="space-around"
        align="center">
        <v-col cols="auto"
          class="text-center mr-1">
          <cc-modal :title="$t('common.cloudAccount')"
            icon="mdi-cloud-sync">
            <template #activator="{ open }">
              <cc-button size="small"
                :color="isLoggedIn ? 'success' : ''"
                :loading="startingUp"
                :prepend-icon="isLoggedIn ? 'mdi-cloud-sync' : 'mdi-cloud-off-outline'"
                class="mr-2"
                @click="open">
                <span>{{ isLoggedIn ? $t('mainMenu.menu.connected') : $t('mainMenu.menu.logIn') }}</span>
              </cc-button>
            </template>
            <sign-in />
          </cc-modal>
        </v-col>
        <v-col cols="auto"
          class="text-center">
          <cloud-notifications />
        </v-col>

        <v-col cols="auto"
          class="ml-auto text-right">
          <v-row dense
            justify="space-between">
            <v-col cols="auto">
              <cc-modal :title="$t('common.options')"
                icon="mdi-cog">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('options')"
                    @click="open">
                    {{ $t('common.options') }}
                  </cc-button>
                </template>
                <options-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-dialog :title="$t('common.about')"
                icon="mdi-information">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('about')"
                    @click="open">
                    {{ $t('common.about') }}
                  </cc-button>
                </template>
                <about-page />
              </cc-dialog>
            </v-col>

            <v-col cols="auto">
              <cc-modal :title="$t('common.credits')"
                icon="cc:gms">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('credits')"
                    @click="open">
                    {{ $t('common.credits') }}
                  </cc-button>
                </template>
                <credits-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-modal :title="$t('common.help')"
                icon="mdi-help-circle">
                <template #activator="{ open }">
                  <cc-button size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('help')"
                    @click="open">
                    {{ $t('common.help') }}
                  </cc-button>
                </template>
                <help-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-button target="_blank"
                color="warning"
                size="small"
                variant="tonal"
                href="https://www.patreon.com/compcon">
                {{ $t('mainMenu.menu.supportProject') }}
              </cc-button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import MainTitle from './_components/MainTitle.vue';
import MainBtn from './_components/MainBtn.vue';
import CCLog from './_components/CCLog.vue';
import SignIn from './_components/login/index.vue';
import ExtraContent from '../nav/pages/ExtraContent/index.vue';
import AboutPage from '../nav/pages/About.vue';
import CreditsPage from '../nav/pages/Credits.vue';
import HelpPage from '../nav/pages/Help.vue';
import OptionsPage from '../nav/pages/Options/index.vue';
import { UserStore } from '@/stores';
import CloudNotifications from '../nav/CloudNotifications.vue';
import { getV2Backups } from '@/io/V2Importer';

defineOptions({ name: 'LandingPageDesktop' })

const log = ref<InstanceType<typeof CCLog> & { print: (user: string, response: string) => void } | null>(null)

const extraContentModal = ref(false)
const v2BackupCount = ref(0)

onMounted(async () => {
  await loadV2BackupCount();
});

const isLoggedIn = computed(() => {
  return UserStore().IsLoggedIn;
})
const startingUp = computed(() => {
  return UserStore().IsLoading;
})
const hasV2Backups = computed(() => {
  return v2BackupCount.value > 0;
})

async function loadV2BackupCount() {
  v2BackupCount.value = (await getV2Backups()).length;
}
function ccLog(btn: string) {
  switch (btn) {
    case 'compendium':
      log.value?.print(
        'man compendium',
        'Browse the database of LANCER frames, equipment, and rules'
      );
      break;
    case 'pilot':
      log.value?.print(
        'man pilot-sheet',
        'Create and manage pilots and their mechs, print character sheets, and enable active play mode'
      );
      break;
    case 'gm':
      log.value?.print(
        'man gm-tools',
        'Build and manage NPCs and encounters, and run missions with NPCs and pilots'
      );
      break;
    case 'campaign':
      log.value?.print('man campaigns', 'work in progress');
      break;
    case 'content':
      log.value?.print(
        'man homebrew',
        'Manage and create COMP/CON expansion data'
      );
      break;
    case 'encounter':
      log.value?.print(
        'man activemode',
        'GM an Encounter, open or continue an Active Character Sheet, or create or join a cloud-based Table (coming soon!)'
      );
      break;
    case 'options':
      log.value?.print(
        'compcon -settings --verbose',
        'Open the options manager'
      );
      break;
    case 'about':
      log.value?.print('compcon --v', 'About COMP/CON');
      break;
    case 'help':
      log.value?.print('compcon --h', 'Open the COMP/CON help page');
      break;
    case 'update':
      log.value?.print(
        'gms-upm compcon changelog -l',
        'View COMP/CON changelog and latest updates'
      );
      break;
    default:
      break;
  }
}
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 90vh;
  background: url(../../assets/ui/grid.png);
  animation: 600s scroll infinite linear;
  top: 0;
  left: 0;
}

@keyframes scroll {
  100% {
    background-position: -3000px -3000px;
  }
}
</style>
