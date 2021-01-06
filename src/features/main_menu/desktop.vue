<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="$vuetify.breakpoint.mdAndUp" ref="log" />
    <v-container style="height: calc(100vh - 135px)">
      <v-row justify="space-between" style="height:100%">
        <main-btn
          icon="cci-compendium"
          :to="'/compendium'"
          help="Equipment Database"
          @hover="ccLog('compendium')"
        >
          Compendium
        </main-btn>
        <main-btn
          icon="cci-pilot"
          :to="'/pilot_management'"
          help="Manage Pilots"
          :loading="pilotLoading"
          @hover="ccLog('pilot')"
        >
          Pilot Roster
        </main-btn>
        <main-btn
          icon="cci-encounter"
          :to="'/gm'"
          help="Manage NPCs/Encounters/Missions"
          @hover="ccLog('gm')"
        >
          Encounter Toolkit
        </main-btn>
        <!-- <main-btn icon="cci-campaign" disabled help="Feature In Progress">
          Campaign Manager
        </main-btn> -->
        <main-btn
          icon="cci-content-manager"
          help="Import Content Packs"
          @hover="ccLog('content')"
          @clicked="$refs.contentModal.show()"
        >
          Content Manager
        </main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary" fixed>
      <v-row no-gutters justify="space-around" align="center">
        <v-col cols="auto" class="text-center mr-3">
          <v-btn small dark outlined @click="bulkExport">
            <v-icon left>mdi-database</v-icon>
            Create COMP/CON Data Backup
            <cc-tooltip
              inline
              content="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often."
            >
              <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
            </cc-tooltip>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="text-center">
          <v-dialog v-model="importDialog" width="50%">
            <template v-slot:activator="{ on }">
              <v-btn small dark outlined v-on="on">
                <v-icon left>mdi-database-refresh</v-icon>
                Load COMP/CON Data Backup
                <cc-tooltip
                  inline
                  content="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often."
                >
                  <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="pa-6">
                <p class="text-center heading h3 text--text">
                  This will OVERWRITE
                  <b class="accent--text">ALL</b>
                  local COMP/CON data.
                  <br />
                  This
                  <b class="accent--text">cannot</b>
                  be undone.
                </p>
                <v-file-input
                  v-model="fileValue"
                  accept=".compcon"
                  outlined
                  dense
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
                small
                dark
                text
                @mouseenter="ccLog('options')"
                @click="$refs.optionsModal.show()"
              >
                Options
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn small dark text @mouseenter="ccLog('about')" @click="$refs.aboutModal.show()">
                About
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn small dark text @mouseenter="ccLog('help')" @click="$refs.helpModal.show()">
                Help
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                target="_blank"
                color="warning"
                small
                dark
                text
                href="https://www.patreon.com/compcon"
              >
                Support This Project
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
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
import Vue from 'vue'
import { exportAll, importAll } from '@/io/BulkData'
import { saveFile } from '@/io/Dialog'
import MainTitle from './_components/MainTitle.vue'
import MainBtn from './_components/MainBtn.vue'
import CCLog from './_components/CCLog.vue'
import ContentPage from '../nav/pages/ExtraContent/index.vue'
import AboutPage from '../nav/pages/About.vue'
import HelpPage from '../nav/pages/Help.vue'
import OptionsPage from '../nav/pages/Options/index.vue'

export default Vue.extend({
  name: 'landing-page',
  components: {
    MainTitle,
    MainBtn,
    CCLog,
    ContentPage,
    AboutPage,
    HelpPage,
    OptionsPage,
  },
  data: () => ({
    pilotLoading: false,
    importDialog: false,
    fileValue: null,
  }),
  beforeRouteLeave(to, from, next) {
    if (to.path === '/pilot_management') this.pilotLoading = true
    next()
  },
  methods: {
    async bulkExport() {
      const result = await exportAll()
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        JSON.stringify(result),
        'Save COMP/CON Archive'
      )
    },
    async bulkImport(file) {
      await importAll(file)
        .then(() => this.$notify('Data import successful', 'confirmation'))
        .catch(err => this.$notify(`ERROR: Unable to import: ${err}`, 'error'))
      this.importDialog = false
    },
    ccLog(btn: string) {
      switch (btn) {
        case 'compendium':
          this.$refs['log'].print(
            'man compendium',
            'Browse the database of LANCER frames, equipment, and rules'
          )
          break
        case 'pilot':
          this.$refs['log'].print(
            'man pilot-sheet',
            'Create and manage pilots and their mechs, print character sheets, and enable active play mode'
          )
          break
        case 'gm':
          this.$refs['log'].print(
            'man gm-tools',
            'Build and manage NPCs and encounters, and run missions with NPCs and pilots'
          )
          break
        case 'campaign':
          this.$refs['log'].print('man campaigns', 'work in progress')
          break
        case 'content':
          this.$refs['log'].print('man homebrew', 'Manage and create COMP/CON expansion data')
          break
        case 'options':
          this.$refs['log'].print('compcon -settings --verbose', 'Open the options manager')
          break
        case 'about':
          this.$refs['log'].print('compcon --v', 'About COMP/CON')
          break
        case 'help':
          this.$refs['log'].print('compcon --h', 'Open the COMP/CON help page')
          break
        case 'update':
          this.$refs['log'].print(
            'gms-upm compcon changelog -l',
            'View COMP/CON changelog and latest updates'
          )
        default:
          break
      }
    },
  },
})
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
