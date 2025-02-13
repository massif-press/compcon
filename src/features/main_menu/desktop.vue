<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="!$vuetify.display.mdAndDown" ref="log" />
    <v-container fluid style="height: calc(100vh - 85px); margin-top: 20px">
      <v-row justify="space-between" align="center" style="height: 100%">
        <main-btn
          icon="cc:compendium"
          :to="'/srd'"
          help="Equipment Database"
          @hover="ccLog('compendium')">
          Compendium
        </main-btn>
        <main-btn
          icon="cc:pilot"
          :to="'/pilot_management'"
          help="Manage Pilots"
          @hover="ccLog('pilot')">
          Pilot Roster
        </main-btn>
        <main-btn
          icon="cc:encounter"
          :to="'/gm'"
          help="Manage Campaigns, Encounters, and NPCs"
          @hover="ccLog('gm')">
          GM Toolkit
        </main-btn>
        <main-btn
          icon="cc:content_manager"
          help="Import Content Packs"
          @hover="ccLog('content')"
          @clicked="extraContentModal = true">
          Content Manager
          <cc-tooltip
            v-if="missingContent"
            inline
            title="Unloadable Content Detected"
            content="COMP/CON has detected one or more items that are missing Lancer Content Pack data. These items cannot be loaded without installing and activated LCPs. These issues may be able to be resolved in the Content Manager.">
            <v-icon color="warning" size="30" icon="mdi-alert" class="mb-2" />
          </cc-tooltip>
          <extra-content v-model="extraContentModal" />
        </main-btn>
        <main-btn
          icon="cc:campaign"
          :to="'/active-mode'"
          help="Run an Encounter or Active Character Sheet"
          @hover="ccLog('encounter')">
          Active Mode
        </main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary" app fixed height="32">
      <v-row no-gutters justify="space-around" align="center">
        <v-col cols="auto" class="text-center mr-3">
          <cc-modal title="Cloud Account" icon="mdi-satellite-uplink" extended>
            <template #activator="{ open }">
              <cc-button
                size="small"
                :color="isLoggedIn ? 'success' : ''"
                :loading="startingUp"
                :prepend-icon="isLoggedIn ? 'mdi-satellite-uplink' : 'mdi-account-off-outline'"
                class="mr-2"
                @click="open">
                <span>{{ isLoggedIn ? 'Connected' : 'Log In' }}</span>
              </cc-button>
            </template>
            <sign-in />
          </cc-modal>
          <cloud-notifications />
        </v-col>

        <v-col cols="auto" class="ml-auto text-right">
          <v-row dense justify="space-between">
            <v-col cols="auto">
              <cc-modal title="Options" icon="mdi-cog" extended>
                <template #activator="{ open }">
                  <cc-button
                    size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('options')"
                    @click="open">
                    Options
                  </cc-button>
                </template>
                <options-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-dialog title="About" icon="mdi-information" extended>
                <template #activator="{ open }">
                  <cc-button
                    size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('about')"
                    @click="open">
                    About
                  </cc-button>
                </template>
                <about-page />
              </cc-dialog>
            </v-col>

            <v-col cols="auto">
              <cc-modal title="Credits" icon="cc:gms" extended>
                <template #activator="{ open }">
                  <cc-button
                    size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('credits')"
                    @click="open">
                    Credits
                  </cc-button>
                </template>
                <credits-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-modal title="Help" icon="mdi-help-circle" extended>
                <template #activator="{ open }">
                  <cc-button
                    size="small"
                    variant="tonal"
                    color="highlight"
                    @mouseenter="ccLog('help')"
                    @click="open">
                    Help
                  </cc-button>
                </template>
                <help-page />
              </cc-modal>
            </v-col>

            <v-col cols="auto">
              <cc-button
                target="_blank"
                color="warning"
                size="small"
                variant="tonal"
                href="https://www.patreon.com/compcon">
                Support This Project
              </cc-button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts">
import MainTitle from './_components/MainTitle.vue';
import MainBtn from './_components/MainBtn.vue';
import CCLog from './_components/CCLog.vue';
import SignIn from './_components/login/index.vue';
import ExtraContent from '../nav/pages/ExtraContent/index.vue';
import AboutPage from '../nav/pages/About.vue';
import CreditsPage from '../nav/pages/Credits.vue';
import HelpPage from '../nav/pages/Help.vue';
import OptionsPage from '../nav/pages/Options/index.vue';
import { UserStore, PilotStore, NpcStore } from '@/stores';
import CloudNotifications from '../nav/CloudNotifications.vue';

export default {
  name: 'landing-page',
  components: {
    MainTitle,
    MainBtn,
    CCLog,
    ExtraContent,
    CreditsPage,
    AboutPage,
    HelpPage,
    OptionsPage,
    SignIn,
    CloudNotifications,
  },
  data: () => ({
    importDialog: false,
    fileValue: undefined,
    extraContentModal: false,
  }),
  computed: {
    isLoggedIn() {
      return UserStore().IsLoggedIn;
    },
    startingUp() {
      return UserStore().IsLoading;
    },
    missingContent() {
      return (
        PilotStore().Pilots.some((x) => x.BrewController.HasError) ||
        NpcStore().Npcs.some((x) => x.BrewController.HasError)
      );
    },
  },
  methods: {
    ccLog(btn: string) {
      switch (btn) {
        case 'compendium':
          (this.$refs['log'] as any).print(
            'man compendium',
            'Browse the database of LANCER frames, equipment, and rules'
          );
          break;
        case 'pilot':
          (this.$refs['log'] as any).print(
            'man pilot-sheet',
            'Create and manage pilots and their mechs, print character sheets, and enable active play mode'
          );
          break;
        case 'gm':
          (this.$refs['log'] as any).print(
            'man gm-tools',
            'Build and manage NPCs and encounters, and run missions with NPCs and pilots'
          );
          break;
        case 'campaign':
          (this.$refs['log'] as any).print('man campaigns', 'work in progress');
          break;
        case 'content':
          (this.$refs['log'] as any).print(
            'man homebrew',
            'Manage and create COMP/CON expansion data'
          );
          break;
        case 'encounter':
          (this.$refs['log'] as any).print(
            'man activemode',
            'GM an Encounter, open or continue an Active Character Sheet, or create or join a cloud-based Table (coming soon!)'
          );
          break;
        case 'options':
          (this.$refs['log'] as any).print(
            'compcon -settings --verbose',
            'Open the options manager'
          );
          break;
        case 'about':
          (this.$refs['log'] as any).print('compcon --v', 'About COMP/CON');
          break;
        case 'help':
          (this.$refs['log'] as any).print('compcon --h', 'Open the COMP/CON help page');
          break;
        case 'update':
          (this.$refs['log'] as any).print(
            'gms-upm compcon changelog -l',
            'View COMP/CON changelog and latest updates'
          );
        default:
          break;
      }
    },
  },
};
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
