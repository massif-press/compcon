<template>
  <div>
    <h3 class="heading accent--text">User Options</h3>
    <v-row dense>
      <v-col md="12" lg="6" class="mr-3">
        <div class="flavor-text">
          <b>USER ID:</b>
          <span class="accent--text">
            {{ userID }}
          </span>
        </div>
        <v-divider />
        <div class="text-center">
          <div>
            <v-btn large block color="info" class="my-1" @click="reload">
              Download Updates and Reload
            </v-btn>
            <v-btn block color="accent" class="my-1" @click="showMessage()">
              Show Latest Update Message
            </v-btn>
            <v-divider class="my-2" />
          </div>
          <div class="text-center my-2">
            <v-btn block large color="primary" @click="bulkExport">
              <v-icon left>mdi-database</v-icon>
              Create Data Backup
              <cc-tooltip
                inline
                content="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often."
              >
                <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
          </div>
          <div class="text-center my-2">
            <v-dialog v-model="importDialog" width="50%">
              <template v-slot:activator="{ on }">
                <v-btn block large color="primary" v-on="on">
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
          </div>
          <v-divider class="my-3" />
          <v-dialog v-model="deleteDialog" width="80%">
            <template v-slot:activator="{ on }">
              <v-btn small block color="error" class="my-1" v-on="on">
                <v-icon left v-html="'mdi-alert'" />
                Delete All User Data
                <v-icon right v-html="'mdi-alert'" />
              </v-btn>
            </template>
            <v-card flat tile>
              <v-card-text>
                <v-alert
                  prominent
                  dark
                  color="error"
                  icon="mdi-alert-circle"
                  border="bottom"
                  class="my-3"
                >
                  <span class="heading h2">WARNING // WARNING // WARNING</span>
                </v-alert>
                <p class="text-center heading h2 text--text">
                  This will delete
                  <b class="accent--text">ALL</b>
                  local COMP/CON data.
                  <br />
                  This
                  <b class="accent--text">cannot</b>
                  be undone.
                  <br />
                  <br />
                  <b class="accent--text">Are you sure you want to continue?</b>
                </p>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn color="secondary" text large @click="deleteDialog = false">Dismiss</v-btn>
                <v-spacer />
                <v-btn color="error" text @click="deleteAll">
                  <v-icon left v-html="'mdi-alert'" />
                  Delete All User Data
                  <v-icon right v-html="'mdi-alert'" />
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
      <v-col>
        <h3 class="heading accent--text mb-n2">Advanced Options</h3>
        <v-switch v-model="userSaveStrategy" color="secondary" inset dense hide-details>
          <span slot="label">
            Enable Performant Saving
            <cc-tooltip
              title="Save Strategy"
              :content="`COMP/CON tries to write changes to your save data every time a value changes. On some systems this can cause poor app performance. Enabling Performant Saving restricts saving data to page navigation and browser exit events, increasing performance at a cost of save reliablity. This option works best on Chrome browsers.`"
              inline
            >
              <v-icon>mdi-information-outline</v-icon>
            </cc-tooltip>
          </span>
        </v-switch>
        <v-switch v-model="userViewExotics" color="exotic" inset dense hide-details>
          <span slot="label">
            Show Exotic items in the Compendium
            <cc-tooltip
              title="SPOILER ALERT"
              content="Enabling this option may reveal campaign spoilers and it is recommended to leave this setting DISABLED
              if you are not the GM"
              inline
            >
              <v-icon color="warning">mdi-alert</v-icon>
            </cc-tooltip>
          </span>
        </v-switch>
        <v-switch v-model="userAllowQuickstart" color="exotic" inset dense hide-details>
          <span slot="label">Enable quick pilot creation and level-up</span>
        </v-switch>
        <h3 class="heading accent--text mt-2">Theme</h3>
        <v-select
          v-model="theme"
          dense
          outlined
          hide-details
          :items="themes"
          item-text="name"
          @change="updateUserTheme"
        />
        &emsp;
        <i>
          Community themes by
          <a target="_blank" href="https://github.com/vialra">vialra,</a>
          Asger Toft,
          <a target="_blank" href="https://github.com/Lunardog15">thecrystalwoods,</a>
          and
          <a target="_blank" href="https://github.com/nimoooos">Suji</a>
        </i>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h3 class="heading accent--text">Deleted Items (local data only)</h3>
    <deleted-items />

    <v-divider class="my-4" />

    <h3 class="heading accent--text">Achievements</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p>

    <div class="text-right">
      <router-link to="./ui-test">
        <v-btn small text>UI Test</v-btn>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import allThemes from '@/ui/style/themes'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { exportAll, importAll, clearAllData } from '@/io/BulkData'
import { saveFile } from '@/io/Dialog'
import DeletedItems from './DeletedItems.vue'
import { SetTheme } from '@/classes/utility/ThemeManager'

export default Vue.extend({
  name: 'options-settings',
  components: { DeletedItems },
  data: () => ({
    themes: [],
    importDialog: false,
    fileValue: null,
    deleteDialog: false,
  }),
  computed: {
    user() {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile
    },
    userViewExotics: {
      get: function () {
        return this.user.GetView('showExotics')
      },
      set: function (newval) {
        this.user.SetView('showExotics', newval)
      },
    },
    userAllowQuickstart: {
      get: function () {
        return this.user.GetView('quickstart')
      },
      set: function (newval) {
        this.user.SetView('quickstart', newval)
      },
    },
    userSaveStrategy: {
      get: function () {
        return this.user.GetView('savePerformant')
      },
      set: function (newval) {
        this.user.SetView('savePerformant', newval)
      },
    },
    theme: {
      get: function () {
        return this.user.Theme
      },
      set: function (newval) {
        this.user.Theme = newval
        SetTheme(this.theme, this.$vuetify)
      },
    },
    userID() {
      return this.user.id
    },
    userTheme() {
      return this.user.Theme
    },
  },
  created() {
    for (const k in allThemes) {
      const e = allThemes[k]
      this.themes.push({ name: e.name, value: e.id })
    }
  },
  methods: {
    reload() {
      location.reload()
    },
    showMessage() {
      const store = getModule(UserStore, this.$store)
      store.UserProfile.WelcomeHash = ''
      localStorage.removeItem('cc-welcome-hash')
      this.reload()
    },
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
    async deleteAll() {
      await clearAllData(false)
      this.deleteDialog = false
    },
    async updateUserTheme() {
      this.$store.dispatch('updateUserData')
    },
  },
})
</script>
