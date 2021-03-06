<template>
  <div>
    <h3 class="heading accent--text">User Options</h3>
    <v-row dense>
      <v-col md="12" lg="8" class="mr-3">
        <div class="flavor-text">
          <b>USER ID:</b>
          <span class="accent--text">
            {{ userID }}
          </span>
        </div>
        <v-divider />
        <div class="text-center">
          <div>
            <v-btn outlined block color="info" class="my-1" @click="reload">
              Download Updates and Reload
            </v-btn>
            <v-btn outlined block small color="accent" class="my-1" @click="showMessage()">
              Show Latest Update Message
            </v-btn>
            <v-divider class="my-2" />
          </div>
          <v-btn outlined block color="secondary" class="my-1" @click="bulkExport">
            Export All COMP/CON Data
          </v-btn>
          <v-dialog v-model="importDialog" width="50%">
            <template v-slot:activator="{ on }">
              <v-btn outlined block color="secondary" class="my-1" v-on="on">
                Import All COMP/CON Data
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="pa-6">
                <p class="text-center heading h2 text--text">
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
        <h3 class="heading accent--text">Theme</h3>
        <v-select
          v-model="theme"
          dense
          outlined
          :items="themes"
          item-text="name"
          @change="setTheme"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h3 class="heading accent--text">Achievements</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p>

    <div class="text-right">
      <v-btn small text to="./ui-test">UI Test</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import allThemes from '@/ui/style/themes'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { exportAll, importAll, exportV1Pilots, clearAllData } from '@/io/BulkData'
import { saveFile } from '@/io/Dialog'

export default Vue.extend({
  name: 'options-settings',
  data: () => ({
    theme: 'gms',
    themes: [],
    importDialog: false,
    fileValue: null,
    deleteDialog: false,
  }),
  computed: {
    userID() {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile.id
    },
    userTheme() {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile.Theme
    },
  },
  created() {
    this.theme = this.userTheme
    for (const k in allThemes) {
      if (allThemes.hasOwnProperty(k)) {
        const e = allThemes[k]
        this.themes.push({ name: e.name, value: e.id })
      }
    }
  },
  methods: {
    reload() {
      location.reload(true)
    },
    setTheme() {
      const profile = getModule(UserStore, this.$store).UserProfile
      Vue.set(profile, 'Theme', this.theme)
      const isDark = allThemes[this.theme].type === 'dark'

      if (isDark) {
        this.$vuetify.theme.themes.dark = allThemes[this.theme].colors
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.themes.light = allThemes[this.theme].colors
        this.$vuetify.theme.dark = false
      }
    },
    showMessage() {
      const store = getModule(UserStore, this.$store)
      store.UserProfile.WelcomeHash = ''
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
      this.importDialog = false
    },
    async deleteAll() {
      await clearAllData()
      this.deleteDialog = false
    },
  },
})
</script>
