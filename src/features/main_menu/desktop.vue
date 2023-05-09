<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="$vuetify.display.mdAndUp" ref="log" />
    <v-container style="height: calc(100vh - 135px); margin-top: 80px">
      <v-row justify="space-between" style="height: 100%">
        <main-btn
          icon="cc:compendium"
          :to="'/srd'"
          help="Equipment Database"
          @hover="ccLog('compendium')"
        >
          Compendium
        </main-btn>
        <main-btn
          icon="cc:pilot"
          :to="'/pilot_management'"
          help="Manage Pilots"
          @hover="ccLog('pilot')"
        >
          Pilot Roster
        </main-btn>
        <!-- <main-btn
          icon="cc:encounter"
          :to="'/gm'"
          help="Manage NPCs/Encounters/Missions"
          @hover="ccLog('gm')"
        >
          Encounter Toolkit
        </main-btn> -->
        <main-btn
          icon="cc:encounter"
          :to="'/gm'"
          help="Manage Campaigns, Encounters, and NPCs"
          @hover="ccLog('gm')"
        >
          GM Toolkit
        </main-btn>
        <main-btn
          icon="cc:content_manager"
          help="Import Content Packs"
          @hover="ccLog('content')"
          @clicked="($refs.contentModal as any).show()"
        >
          Content Manager
          <cc-tooltip
            v-if="missingContent"
            inline
            title="Unloadble Content Detected"
            content="COMP/CON has detected one or more items that are missing Lancer Content Pack data. These items cannot be loaded without installing and activated LCPs. These issues may be able to be resolved in the Content Manager."
          >
            <v-avatar color="white"><v-icon color="error" large>mdi-folder-off</v-icon></v-avatar>
          </cc-tooltip>
        </main-btn>
        <main-btn
          icon="cc:encounter"
          :to="'/active-mode'"
          help="Run an Encounter or Active Character Sheet"
          @hover="ccLog('encounter')"
        >
          Active Mode
        </main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary" app fixed>
      <v-row no-gutters justify="space-around" align="center">
        <v-col cols="auto" class="text-center mr-3">
          <v-btn
            size="small"
            light
            elevation="0"
            class="pulse"
            @click="($refs.loginModal as any).show()"
          >
            <v-icon start>
              {{ userstore.IsLoggedIn ? 'cc:pilot' : 'mdi-account-off-outline' }}
            </v-icon>
            <span>{{ userstore.IsLoggedIn ? 'Connected' : 'Log In' }}</span>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="ml-1 mr-3"><v-divider vertical class="d-inline" /></v-col>
        <v-col cols="auto" class="text-center mr-3">
          <v-btn size="small" dark variant="outlined" @click="bulkExport">
            <v-icon start>mdi-database</v-icon>
            Create Data Backup
            <cc-tooltip
              inline
              content="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often."
            >
              <v-icon end class="fade-select">mdi-help-circle-outline</v-icon>
            </cc-tooltip>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="text-center">
          <v-dialog v-model="importDialog" width="50%">
            <template #activator="{ props }">
              <v-btn size="small" dark variant="outlined" v-bind="props">
                <v-icon start>mdi-database-refresh</v-icon>
                Load Data Backup
                <cc-tooltip
                  inline
                  content="COMP/CON relies on your browser to save and load its data.
                  Settings, utilities, and other applications can erase your
                  browser's localStorage cache, resulting in the loss of your
                  COMP/CON data. It is <b>strongly</b> recommended to back up
                  your data often."
                >
                  <v-icon end class="fade-select">mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="pa-6">
                <p class="text-center heading h3 text-text">
                  This will OVERWRITE
                  <b class="text-accent">ALL</b>
                  local COMP/CON data.
                  <br />
                  This
                  <b class="text-accent">cannot</b>
                  be undone.
                </p>
                <v-file-input
                  v-model="fileValue"
                  accept=".compcon"
                  variant="outlined"
                  density="compact"
                  hide-details
                  autofocus
                  placeholder="Select COMP/CON Bulk Export File"
                  prepend-icon="mdi-paperclip"
                  @change="bulkImport"
                />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>

        <v-col cols="auto" class="ml-auto text-right">
          <v-row no-gutters justify="space-between">
            <v-col cols="auto">
              <v-btn
                size="small"
                dark
                variant="text"
                @mouseenter="ccLog('options')"
                @click="($refs.optionsModal as any).show()"
              >
                Options
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                size="small"
                dark
                variant="text"
                @mouseenter="ccLog('about')"
                @click="($refs.aboutModal as any).show()"
              >
                About
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                size="small"
                dark
                variant="text"
                @mouseenter="ccLog('about')"
                @click="($refs.creditsModal as any).show()"
              >
                Credits
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                size="small"
                dark
                variant="text"
                @mouseenter="ccLog('help')"
                @click="($refs.helpModal as any).show()"
              >
                Help
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                target="_blank"
                color="warning"
                size="small"
                dark
                variant="text"
                href="https://www.patreon.com/compcon"
                tabindex="0"
              >
                Support This Project
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
    <cc-solo-dialog ref="loginModal" large no-confirm title="CLOUD ACCOUNT">
      <sign-in />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="optionsModal"
      large
      no-confirm
      no-pad
      no-title-clip
      title="Options & User Profile"
    >
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About"><about-page /></cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"><help-page /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" fullscreen no-confirm title="Credits">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="contentModal"
      no-title-clip
      no-pad
      large
      no-confirm
      title="Manage Content Packs"
    >
      <content-page />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import { exportAll, importAll } from '@/io/BulkData';
import { saveFile } from '@/io/Dialog';
import MainTitle from './_components/MainTitle.vue';
import MainBtn from './_components/MainBtn.vue';
import CCLog from './_components/CCLog.vue';
import SignIn from './_components/login/index.vue';
import ContentPage from '../nav/pages/ExtraContent/index.vue';
import AboutPage from '../nav/pages/About.vue';
import CreditsPage from '../nav/pages/Credits.vue';
import HelpPage from '../nav/pages/Help.vue';
import OptionsPage from '../nav/pages/Options/index.vue';
import { UserStore, CompendiumStore } from '@/stores';

export default {
  name: 'landing-page',
  components: {
    MainTitle,
    MainBtn,
    CCLog,
    ContentPage,
    CreditsPage,
    AboutPage,
    HelpPage,
    OptionsPage,
    SignIn,
  },
  data: () => ({
    importDialog: false,
    fileValue: undefined,
  }),
  computed: {
    userstore() {
      return UserStore();
    },
    missingContent() {
      const mc = CompendiumStore().MissingContent;
      let b = false;
      if (!mc || !mc.pilots || !mc.npcs) return b;
      for (const key in mc) {
        if (mc[key].length) b = true;
      }
      return b;
    },
  },
  methods: {
    async bulkExport() {
      const result = await exportAll();
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        JSON.stringify(result),
        'Save COMP/CON Archive'
      );
    },
    async bulkImport(file) {
      await importAll(file)
        .then(() => this.$notify('Data import successful', 'confirmation'))
        .catch((err) => this.$notify(`ERROR: Unable to import: ${err}`, 'error'));
      this.importDialog = false;
    },
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
  height: 100vh;
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
