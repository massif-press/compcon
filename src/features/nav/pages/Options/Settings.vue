<template>
  <v-container :class="!mobile && 'px-12'">
    <v-row align="center"
      justify="space-between"
      dense>
      <v-col cols="auto">
        <cc-button block
          color="primary"
          size="small"
          prepend-icon="mdi-bell-ring-outline"
          @click="showUpdates">
          Show Update Messages
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-switch v-model="userViewExotics"
          color="exotic"
          density="compact"
          off-icon="mdi-star-off-outline"
          on-icon="mdi-star"
          tooltip="Enabling this option may reveal campaign spoilers and it is recommended to leave this setting DISABLED if you are not the GM"
          label="Show Exotic items in the Compendium"></cc-switch>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12"
        sm="6">
        <div>
          <cc-heading is-title
            text="Theme" />
          <cc-select v-model="theme"
            :items="themes.sort((a, b) => a.community - b.community)"
            :item-title="item => `${item.name}${item.community ? ' (Community)' : ''}`" />

          <i class="text-caption"
            style="opacity: 0.75">
            Community themes by
            <a target="_blank"
              href="https://github.com/vialra">
              vialra,
            </a>
            Asger Toft,
            <a target="_blank"
              href="https://github.com/Lunardog15">
              thecrystalwoods,
            </a>
            and
            <a target="_blank"
              href="https://github.com/nimoooos">
              Suji
            </a>
          </i>
        </div>
        <div>
          <cc-heading is-title
            text="Font" />
          <cc-select v-model="font"
            :items="fonts"
            item-title="label"
            item-value="value" />
        </div>
      </v-col>
      <v-col cols="
            12"
        sm="6">
        <cc-heading is-title
          text="Log Level" />
        <v-menu>
          <template #activator="{ props }">
            <v-list-item v-bind="props"
              three-line
              border>
              <v-list-item-title>Log level:</v-list-item-title>
              <v-list-item-subtitle>
                <b class="text-uppercase">{{ logLevel.name }}</b>
              </v-list-item-subtitle>
              <template #append>
                <v-icon>mdi-chevron-down</v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item v-for="item in logLevels"
              :key="item.level"
              :title="item.name"
              :subtitle="item.detail"
              @click="setLogLevel(item)" />
          </v-list>
        </v-menu>

        <cc-heading is-title
          text="Error Reporting"
          class="mt-3 mb-1" />
        <v-row>
          <v-col cols="auto">
            <cc-checkbox v-model="user.ErrorReporting"
              :disabled="user.EnhancedReporting"
              color="primary" />
          </v-col>
          <v-col cols="auto"
            :class="`text-${user.ErrorReporting ? 'success' : 'disabled'}`">
            Error reporting {{ user.ErrorReporting ? 'enabled' : 'disabled' }}
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top"
              max-width="400px">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  class="fade-select mx-1"
                  icon="mdi-information-slab-box-outline" />
              </template>
              Error reporting allows anonymous error data to be sent to the developer to help
              identify and resolve bugs and other issues.
              <strong class="text-accent">
                No personally identifiable information is collected at this level.
              </strong>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-slide-y-reverse-transition>
          <v-row v-if="user.ErrorReporting">
            <v-col cols="auto">
              <cc-checkbox v-model="user.EnhancedReporting"
                color="primary" />
            </v-col>
            <v-col cols="auto"
              :class="`text-${user.EnhancedReporting ? 'success' : 'disabled'}`">
              Enhanced error reporting {{ user.EnhancedReporting ? 'enabled' : 'disabled' }}
            </v-col>
            <v-col cols="auto">
              <v-tooltip location="top"
                max-width="400px">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    class="fade-select mx-1"
                    icon="mdi-information-slab-box-outline" />
                </template>

                Enhanced error reporting sends the developer additional data, including
                <strong class="text-accent">
                  non-anonymous information, specifically IP address and user ID
                </strong>
                . All other PII is scrubbed before transmission. This is
                <strong class="text-accent">not necessary</strong>
                unless you are actively working with the developer to resolve a specific issue and
                have been asked to enable this setting.
              </v-tooltip>
            </v-col>
          </v-row>
        </v-slide-y-reverse-transition>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12"
        md="6">
        <cc-button block
          size="large"
          color="primary"
          prepend-icon="mdi-database"
          tooltip="COMP/CON relies on your browser's secure storage to save and load its data. Generally, this data is safe from deletion, but certain browser settings and utilities can sometimes clear this data, resulting in the loss of your COMP/CON data. It's good practice to back up your data from time to time."
          @click="bulkExport">
          Create Data Backup
        </cc-button>
        <cc-button v-if="v2BackupData"
          block
          size="x-small"
          color="primary"
          prepend-icon="mdi-database"
          tooltip="COMP/CON has saved a complete backup of your v2 COMP/CON data. This can be imported into the v2 app at old.compcon.app."
          @click="downloadV2Backup">
          Download Stored v2 Backup
        </cc-button>
      </v-col>

      <v-col cols="12"
        md="6">
        <cc-dialog title="Load Data Backup"
          :close-on-click="false">
          <template #activator="{ open }">
            <cc-button block
              size="large"
              color="primary"
              tooltip=".compcon files are COMP/CON bulk export files that contain all of your local data in a single file. You can create a .compcon backup file using the 'Create Data Backup' button. Use this option to load .compcon backup files that you have created or obtained from another source. It is recommended to create a backup before loading a .compcon file, especially if the file came from another source."
              prepend-icon="mdi-database"
              @click="open()">
              Load Data Backup
            </cc-button>
          </template>
          <template #default="{ close }">
            <v-card-text class="pa-6">
              <div v-if="!isV2File">
                <div class="text-cc-overline text-disabled">
                  // Import Strategy
                </div>
                <v-btn-toggle v-model="strategy"
                  mandatory
                  size="small"
                  color="primary"
                  flat
                  tile
                  density="compact"
                  class="mb-4">
                  <v-btn value="append">
                    Merge with existing data
                  </v-btn>
                  <v-btn value="overwrite">
                    Overwrite all existing data
                  </v-btn>
                </v-btn-toggle>
                <cc-alert v-if="strategy === 'append'"
                  color="warning"
                  variant="outlined"
                  class="mb-4">
                  <p class="text-text">
                    COMP/CON will attempt to merge import data with your existing data.
                  </p>
                </cc-alert>
                <cc-alert v-else-if="strategy === 'overwrite'"
                  color="error"
                  variant="outlined"
                  title="Warning"
                  icon="mdi-alert"
                  class="mb-4">
                  The overwrite strategy will replace all of your existing local data with the data
                  from the imported file and cannot be undone. It is strongly recommended to
                  create a backup before using this option.
                </cc-alert>
              </div>

              <v-file-input v-model="fileValue"
                accept=".compcon"
                variant="outlined"
                density="compact"
                hide-details
                autofocus
                label="Select .compcon Bulk Export File"
                prepend-icon="mdi-paperclip"
                @change="onFileSelect" />

              <cc-alert v-if="isV2File"
                color="warning"
                icon="mdi-alert"
                variant="outlined"
                title="v2 Backup Detected"
                class="mt-4">
                <p class="text-text">
                  This is a v2 COMP/CON backup file. It will be processed using the v2 import
                  system: content packs will be installed first, followed by pilots, NPCs, and
                  encounters. Items that require LCPs not present in this backup will be saved to
                  pending v2 imports in the Content Manager.
                </p>
                <p class="mt-2">
                  v2 backup imports are always processed using the "append" strategy.
                </p>
              </cc-alert>

              <v-row v-if="stagedImportData"
                justify="end"
                class="mt-4">
                <v-col cols="auto">
                  <cc-button color="primary"
                    :loading="importLoading"
                    prepend-icon="mdi-database-arrow-left-outline"
                    @click="doImport(close)">
                    {{ isV2File ? 'Import v2 Backup' : 'Confirm Import' }}
                  </cc-button>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </cc-dialog>

      </v-col>
    </v-row>

    <div class="text-right">
      <v-btn size="x-small"
        variant="text"
        to="/ui-test">
        UI Test I
      </v-btn>
      <v-btn size="x-small"
        variant="text"
        to="/ui-test-new">
        UI Test II
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import * as allThemes from '@/ui/style/themes'

import { UserStore } from '@/stores'
import { exportAll, importAll } from '@/io/BulkData'
import { saveFile } from '@/io/Data'
import { ClearAllData } from '@/io/Storage'
import { isFullBackup, processFullBackup, downloadFullBackup } from '@/io/FullImporter'
import { GetValue } from '@/io/Storage'

export default {
  name: 'OptionsSettings',
  emits: ['show-message'],
  data: () => ({
    importDialog: false,
    fileValue: null as any,
    deleteDialog: false,
    strategy: 'append',
    stagedImportData: null as any,
    isV2File: false,
    importLoading: false,
    v2BackupData: null as any,
    logLevel: {
      name: 'Warning',
      level: 3,
      detail: 'Record warning and error messages (recommended)',
    },
    logLevels: [
      {
        name: 'Debug',
        key: 'debug',
        level: 1,
        detail: 'Record all log messages (very slow)',
      },
      {
        name: 'Info',
        key: 'info',
        level: 2,
        detail: 'Record info, warning, and error messages',
      },
      {
        name: 'Warning',
        key: 'warn',
        level: 3,
        detail: 'Record warning and error messages (recommended)',
      },
      { name: 'Error', key: 'error', level: 4, detail: 'Record only error messages' },
    ],
    fonts: [
      { label: 'Inter (v3 default)', value: 'inter' },
      { label: 'Noto Sans (v3 alt)', value: 'noto' },
      { label: 'Helvetica (v2 default)', value: 'helvetica' },
      { label: 'OpenDyslexic (experimental)', value: 'opendyslexic' },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown
    },
    user() {
      return UserStore().User
    },
    userViewExotics: {
      get: function () {
        return this.user.Option('showExotics')
      },
      set: function (newVal) {
        this.user.SetOption('showExotics', newVal)
      },
    },
    font: {
      get: function () {
        return this.user.Font
      },
      set: function (newVal) {
        this.user.Font = newVal
        document.documentElement.setAttribute('data-font', newVal)
      },
    },
    theme: {
      get: function () {
        return this.user.Theme
      },
      set: function (newVal) {
        this.user.Theme = newVal
        this.$vuetify.theme.global.name = newVal
        window.location.reload()
      },
    },
    userID() {
      return this.user.ID
    },
    themes() {
      return Object.keys(allThemes).map(x => ({
        name: allThemes[x].name,
        value: x,
        community: allThemes[x].community,
      }))
    },
  },
  created() {
    this.logLevel =
      this.logLevels.find(x => x.key === this.user.LogLevel) || this.logLevels[2]
  },
  async mounted() {
    this.v2BackupData = await GetValue('v2_backup_download')
  },
  methods: {
    reload() {
      location.reload()
    },
    showUpdates() {
      this.user.ReadMessages = []
      this.reload()
    },
    setLogLevel(item) {
      this.logLevel = item
      this.user.LogLevel = item.key
    },
    downloadV2Backup() {
      downloadFullBackup(this.v2BackupData)
    },
    async bulkExport() {
      const result = await exportAll()
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        result,
        'Save COMP/CON Archive'
      )
    },
    async onFileSelect(event) {
      const file = event?.target?.files?.[0]
      if (!(file instanceof File)) return
      try {
        const outer = JSON.parse(await file.text())
        if (isFullBackup(outer)) {
          // v2 format: top-level array of {filename, data} entries
          this.isV2File = true
          this.stagedImportData = outer
        } else {
          this.isV2File = false
          this.stagedImportData = typeof outer.data === 'string'
            ? JSON.parse(outer.data)
            : outer.data
        }
      } catch (err) {
        this.stagedImportData = null
        this.isV2File = false
        this.$notify({
          title: 'Unable to read file',
          text: `ERROR: ${err}`,
          data: { color: 'error', icon: 'mdi-database-off-outline' },
        })
      }
    },
    async doImport(close) {
      this.importLoading = true
      try {
        if (this.isV2File) {
          const result = await processFullBackup(this.stagedImportData)
          const parts = [] as string[]
          if (result.pilotsImported) parts.push(`${result.pilotsImported} pilot(s) imported`)
          if (result.pilotsBackedUp) parts.push(`${result.pilotsBackedUp} pilot(s) pending LCPs`)
          if (result.npcsImported) parts.push(`${result.npcsImported} NPC(s) imported`)
          if (result.npcsBackedUp) parts.push(`${result.npcsBackedUp} NPC(s) pending LCPs`)
          if (result.encountersImported) parts.push(`${result.encountersImported} encounter(s) imported`)
          if (result.encountersBackedUp) parts.push(`${result.encountersBackedUp} encounter(s) pending NPCs`)
          if (result.lcpsImported) parts.push(`${result.lcpsImported} content pack(s) installed`)
          this.$notify({
            title: 'v2 backup imported',
            text: parts.length ? parts.join(', ') + '.' : 'No data found.',
            data: { icon: 'mdi-database-arrow-left-outline' },
          })
        } else {
          await importAll(this.stagedImportData, this.strategy === 'overwrite')
          this.$notify({
            title: 'Data import successful',
            text: this.strategy === 'overwrite'
              ? 'All existing data has been replaced with imported data.'
              : 'Imported data has been merged with existing data.',
            data: { icon: 'mdi-database-arrow-left-outline' },
          })
        }
        this.stagedImportData = null
        this.isV2File = false
        this.fileValue = null
        close()
      } catch (err) {
        this.$notify({
          title: 'Unable to import data',
          text: `ERROR: ${err}`,
          data: { color: 'error', icon: 'mdi-database-off-outline' },
        })
      }
      this.importLoading = false
    },
    async deleteAll() {
      this.user.Reset();
      await ClearAllData();
      window.location.reload();
    },
  },
}
</script>
