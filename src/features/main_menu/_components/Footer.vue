<template>
  <v-footer color="primary" fixed>
    <v-row no-gutters justify="space-around" align="center">
      <v-col cols="auto" class="text-center mr-3">
        <v-btn small light elevation="0" class="pulse" @click="$refs.loginModal.show()">
          <v-icon left>
            {{ userstore.IsLoggedIn ? 'cci-pilot' : 'mdi-account-off-outline' }}
          </v-icon>
          <span>{{ userstore.IsLoggedIn ? 'Connected' : 'Log In' }}</span>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="ml-1 mr-3"><v-divider vertical class="d-inline" /></v-col>
      <v-col cols="auto" class="text-center mr-3">
        <v-btn small dark outlined @click="bulkExport">
          <v-icon left>mdi-database</v-icon>
          Create Data Backup
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
              Load Data Backup
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
              @mouseenter="$emit('log', 'options')"
              @click="$refs.optionsModal.show()"
            >
              Options
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              small
              dark
              text
              @mouseenter="$emit('log', 'about')"
              @click="$refs.aboutModal.show()"
            >
              About
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              small
              dark
              text
              @mouseenter="$emit('log', 'about')"
              @click="$refs.creditsModal.show()"
            >
              Credits
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              small
              dark
              text
              @mouseenter="$emit('log', 'help')"
              @click="$refs.helpModal.show()"
            >
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
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import SignIn from './login/index.vue'
import ContentPage from '../../nav/pages/ExtraContent/index.vue'
import AboutPage from '../../nav/pages/About.vue'
import CreditsPage from '../../nav/pages/Credits.vue'
import HelpPage from '../../nav/pages/Help.vue'
import OptionsPage from '../../nav/pages/Options/index.vue'
import { exportAll, importAll } from '@/io/BulkData'
import { saveFile } from '@/io/Dialog'
import { UserStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'main-footer',
  components: {
    ContentPage,
    CreditsPage,
    AboutPage,
    HelpPage,
    OptionsPage,
    SignIn,
  },
  data: () => ({
    importDialog: false,
    fileValue: null,
  }),
  computed: {
    userstore() {
      return getModule(UserStore, this.$store)
    },
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
  },
})
</script>
