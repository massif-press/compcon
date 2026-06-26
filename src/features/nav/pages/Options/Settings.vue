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
          {{ $t('nav.settingsPage.showUpdateMessages') }}
        </cc-button>
        <migration-repair-dialog />

      </v-col>
      <v-col cols="auto">
        <cc-switch v-model="userViewExotics"
          color="exotic"
          density="compact"
          off-icon="mdi-star-off-outline"
          on-icon="mdi-star"
          :tooltip="$t('nav.settingsPage.showExoticsTooltip')"
          :label="$t('nav.settingsPage.showExoticsLabel')"></cc-switch>
        <br />
        <cc-switch v-model="userDesktopTables"
          color="exotic"
          density="compact"
          off-icon="mdi-table"
          on-icon="mdi-table-large"
          :tooltip="$t('nav.settingsPage.showDesktopTablesTooltip')"
          :label="$t('nav.settingsPage.showDesktopTablesLabel')"></cc-switch>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12"
        sm="6">
        <div>
          <cc-heading is-title
            :text="$t('nav.settingsPage.theme')" />
          <cc-select v-model="theme"
            :items="themes"
            :item-title="item => `${item.name}`"
            :item-subtitle="item => `${item.category}`" />

          <i v-if="themes.find(x => x.id === theme)?.category === 'Community Theme'"
            class="text-caption"
            style="opacity: 0.75">
            <i18n-t keypath="nav.settingsPage.communityThemesBy"
              tag="span"
              scope="global">
              <template #vialra>
                <a target="_blank"
                  href="https://github.com/vialra">{{ themeContributors.vialra }}</a>
              </template>
              <template #asger>{{ themeContributors.asger }}</template>
              <template #thecrystalwoods>
                <a target="_blank"
                  href="https://github.com/Lunardog15">{{ themeContributors.thecrystalwoods }}</a>
              </template>
              <template #suji>
                <a target="_blank"
                  href="https://github.com/nimoooos">{{ themeContributors.suji }}</a>
              </template>
            </i18n-t>
          </i>
        </div>
        <div>
          <cc-heading is-title
            :text="$t('nav.settingsPage.font')" />
          <cc-select v-model="font"
            :items="fonts"
            item-title="label"
            item-value="value" />
        </div>
        <div>
          <cc-heading is-title
            :text="$t('language.selectLanguage')" />
          <cc-select v-model="language"
            :items="languages"
            item-title="name"
            item-value="code" />
          <div v-if="showLanguageNote"
            class="text-center">
            <v-progress-linear v-model="completeness[language]"
              :color="getTransColor(language)"
              height="26"
              class="mt-1">
              <v-chip variant="elevated"
                flat
                size="x-small"
                color="panel">
                <v-icon start
                  :color="getTransColor(language)"
                  :icon="getTransColor(language) === 'success' ? 'mdi-check-outline' : getTransColor(language) === 'warning' ? 'mdi-alert-circle-outline' : 'mdi-alert-circle'"
                  size="18" />
                <strong class="text-caption">
                  {{ $t('language.pctTransComplete',
                    { pct: completeness[language].toFixed(2) }) }}
                </strong>
              </v-chip>
            </v-progress-linear>
            <div class="text-caption text-disabled font-italic pt-1"
              style="line-height: 1">
              {{ $t('language.experimentalNote') }}
            </div>
          </div>

        </div>
      </v-col>
      <v-col cols="
            12"
        sm="6">
        <cc-heading is-title
          :text="$t('nav.settingsPage.logLevel')" />
        <v-menu>
          <template #activator="{ props }">
            <v-list-item v-bind="props"
              three-line
              border>
              <v-list-item-title>{{ $t('nav.settingsPage.logLevelLabel') }}</v-list-item-title>
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
          :text="$t('nav.settingsPage.errorReporting')"
          class="mt-3 mb-1" />
        <v-row>
          <v-col cols="auto">
            <cc-checkbox v-model="user.ErrorReporting"
              :disabled="user.EnhancedReporting"
              color="primary" />
          </v-col>
          <v-col cols="auto"
            :class="`text-${user.ErrorReporting ? 'success' : 'disabled'}`">
            {{ $t('nav.settingsPage.errorReportingPrefix') }} {{ user.ErrorReporting ? $t('nav.settingsPage.enabled') : $t('nav.settingsPage.disabled') }}
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top"
              max-width="400px">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  class="fade-select mx-1"
                  icon="mdi-information-slab-box-outline" />
              </template>
              {{ $t('nav.settingsPage.errorReportingTooltip') }}
              <strong class="text-accent">
                {{ $t('nav.settingsPage.errorReportingPiiNote') }}
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
              {{ $t('nav.settingsPage.enhancedReportingStatus', {
                status: user.EnhancedReporting ?
                  $t('nav.settingsPage.enabled') : $t('nav.settingsPage.disabled')
              }) }}
            </v-col>
            <v-col cols="auto">
              <v-tooltip location="top"
                max-width="400px">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    class="fade-select mx-1"
                    icon="mdi-information-slab-box-outline" />
                </template>

                <i18n-t keypath="nav.settingsPage.enhancedReportingTooltip"
                  tag="span"
                  scope="global">
                  <template #nonAnon>
                    <strong class="text-accent">{{ $t('nav.settingsPage.enhancedReportingPiiNote')
                    }}</strong>
                  </template>
                  <template #notNecessary>
                    <strong class="text-accent">{{
                      $t('nav.settingsPage.enhancedReportingNotNecessary') }}</strong>
                  </template>
                </i18n-t>
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
          :tooltip="$t('nav.settingsPage.createBackupTooltip')"
          @click="bulkExport">
          {{ $t('nav.settingsPage.createBackup') }}
        </cc-button>
        <cc-button v-if="v2BackupData"
          block
          size="x-small"
          color="primary"
          prepend-icon="mdi-database"
          :tooltip="$t('nav.settingsPage.downloadV2Tooltip')"
          @click="downloadV2Backup">
          {{ $t('nav.settingsPage.downloadV2Backup') }}
        </cc-button>
      </v-col>

      <v-col cols="12"
        md="6">
        <cc-dialog :title="$t('nav.settingsPage.loadBackup')"
          :close-on-click="false">
          <template #activator="{ open }">
            <cc-button block
              size="large"
              color="primary"
              :tooltip="$t('nav.settingsPage.loadBackupTooltip')"
              prepend-icon="mdi-database"
              @click="open()">
              {{ $t('nav.settingsPage.loadBackup') }}
            </cc-button>
          </template>
          <template #default="{ close }">
            <v-card-text class="pa-6">
              <div v-if="!isV2File">
                <div class="text-cc-overline text-disabled">
                  // {{ $t('nav.settingsPage.importStrategy') }}
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
                    {{ $t('nav.settingsPage.mergeStrategy') }}
                  </v-btn>
                  <v-btn value="overwrite">
                    {{ $t('nav.settingsPage.overwriteStrategy') }}
                  </v-btn>
                </v-btn-toggle>
                <cc-alert v-if="strategy === 'append'"
                  color="warning"
                  variant="outlined"
                  class="mb-4">
                  <p class="text-text">
                    {{ $t('nav.settingsPage.mergeWarning') }}
                  </p>
                </cc-alert>
                <cc-alert v-else-if="strategy === 'overwrite'"
                  color="error"
                  variant="outlined"
                  :title="$t('nav.titles.warning')"
                  icon="mdi-alert"
                  class="mb-4">
                  {{ $t('nav.settingsPage.overwriteWarning') }}
                </cc-alert>
              </div>

              <v-file-input v-model="fileValue"
                accept=".compcon"
                variant="outlined"
                density="compact"
                hide-details
                :label="$t('nav.settingsPage.selectBulkFile')"
                prepend-icon="mdi-paperclip"
                @change="onFileSelect" />

              <cc-alert v-if="isV2File"
                color="warning"
                icon="mdi-alert"
                variant="outlined"
                :title="$t('nav.settingsPage.v2BackupDetected')"
                class="mt-4">
                <p class="text-text">
                  {{ $t('nav.settingsPage.v2BackupDescription') }}
                </p>
                <p class="mt-2">
                  {{ $t('nav.settingsPage.v2AppendNote') }}
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
                    {{ isV2File ? $t('nav.settingsPage.importV2Backup') : $t('nav.settingsPage.confirmImport') }}
                  </cc-button>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </cc-dialog>

      </v-col>
    </v-row>

    <v-row justify="end">
      <cc-button v-if="v2MigrationComplete"
        size="small"
        color="panel"
        :tooltip="$t('nav.settingsPage.resetV2Tooltip')"
        @click="resetV2Migration">
        {{ $t('nav.settingsPage.resetV2Migration') }}
      </cc-button>
    </v-row>
    <v-row justify="end">
      <!-- eslint-disable @intlify/vue-i18n/no-raw-text -- dev-only test page links -->
      <v-btn size="x-small"
        variant="text"
        to="/ui-test">UI Test I</v-btn>
      <v-btn size="x-small"
        variant="text"
        to="/ui-test-new">UI Test II</v-btn>
      <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import * as allThemes from '@/ui/style/themes'
import { UserStore, NavStore } from '@/stores'
import { SUPPORTED_LOCALES, i18n } from '@/i18n'
import { completeness, fetchCompleteness, QUALITY_THRESHOLD } from '@/i18n/completeness'
const t = i18n.global.t
import { exportAll, importAll } from '@/io/BulkData'
import { saveFile } from '@/io/Data'
import { ClearAllData } from '@/io/Storage'
import { isFullBackup, processFullBackup, downloadFullBackup } from '@/io/FullImporter'
import { GetValue, SetValue } from '@/io/Storage'
import { notify } from '@/util/notify'
import MigrationRepairDialog from './components/MigrationRepairDialog.vue'

const { mdAndDown: mobile } = useDisplay()
const themeObj = useTheme()

const themeContributors = {
  vialra: 'vialra,',
  asger: 'Asger Toft,',
  thecrystalwoods: 'thecrystalwoods,',
  suji: 'Suji',
}

const user = computed(() => UserStore().User)

const logLevels = [
  { name: 'Debug', key: 'debug', level: 1, detail: 'Record all log messages (very slow)' },
  { name: 'Info', key: 'info', level: 2, detail: 'Record info, warning, and error messages' },
  { name: 'Warning', key: 'warn', level: 3, detail: 'Record warning and error messages (recommended)' },
  { name: 'Error', key: 'error', level: 4, detail: 'Record only error messages' },
]

const fonts = [
  { label: 'Inter (v3 default)', value: 'inter' },
  { label: 'Noto Sans (v3 alt)', value: 'noto' },
  { label: 'Helvetica (v2 default)', value: 'helvetica' },
  { label: 'OpenDyslexic (experimental)', value: 'opendyslexic' },
]

const themes = Object.keys(allThemes).map(x => ({
  id: (allThemes as any)[x].id,
  name: (allThemes as any)[x].name,
  value: x,
  category: (allThemes as any)[x].category || '',
})).sort((a, b) => a.category.localeCompare(b.category))

const fileValue = ref<any>(null)
const strategy = ref('append')
const stagedImportData = ref<any>(null)
const isV2File = ref(false)
const importLoading = ref(false)
const v2BackupData = ref<any>(null)
const v2MigrationComplete = ref(false)
const logLevel = ref(logLevels.find(x => x.key === UserStore().User.LogLevel) || logLevels[2])

const userViewExotics = computed({
  get: () => user.value.Option('showExotics'),
  set: (newVal: boolean) => user.value.SetOption('showExotics', newVal),
})

const userDesktopTables = computed({
  get: () => user.value.View('useDesktopTables', false),
  set: (newVal: boolean) => user.value.SetView('useDesktopTables', newVal),
})

const font = computed({
  get: () => user.value.Font,
  set: (newVal: string) => {
    user.value.Font = newVal
    document.documentElement.setAttribute('data-font', newVal)
  },
})

const theme = computed({
  get: () => user.value.Theme,
  set: (newVal: string) => {
    user.value.Theme = newVal
    themeObj.global.name.value = newVal
    window.location.reload()
  },
})

const languages = computed(() =>
  SUPPORTED_LOCALES.map(l => {
    return {
      code: l.code,
      name: l.name,
    }
  })
)

const language = computed({
  get: () => NavStore().Language,
  set: (newVal: string) => NavStore().setLanguage(newVal),
})

const showLanguageNote = computed(() => {
  return language.value !== 'en'
})

onMounted(async () => {
  v2BackupData.value = await GetValue('v2_backup_download')
  v2MigrationComplete.value = !!(await GetValue('v2_migration_complete'))
  fetchCompleteness()
})

function reload() {
  location.reload()
}

function showUpdates() {
  user.value.ReadMessages = []
  reload()
}

function setLogLevel(item: typeof logLevels[number]) {
  logLevel.value = item
  user.value.LogLevel = item.key
}

function downloadV2Backup() {
  downloadFullBackup(v2BackupData.value)
}

async function resetV2Migration() {
  await SetValue('v2_migration_complete', null)
  await SetValue('v2_migration_dismissed', null)
  v2MigrationComplete.value = false
  reload()
}

async function bulkExport() {
  const result = await exportAll()
  await saveFile(
    `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
    result,
    'Save COMP/CON Archive'
  )
}

async function onFileSelect(event: Event) {
  const file = (event?.target as HTMLInputElement)?.files?.[0]
  if (!(file instanceof File)) return
  try {
    const outer = JSON.parse(await file.text())
    if (isFullBackup(outer)) {
      isV2File.value = true
      stagedImportData.value = outer
    } else {
      isV2File.value = false
      stagedImportData.value = typeof outer.data === 'string'
        ? JSON.parse(outer.data)
        : outer.data
    }
  } catch (err) {
    stagedImportData.value = null
    isV2File.value = false
    notify({
      title: t('notify.settings.unableToReadFileTitle'),
      text: t('notify.settings.errorPrefix', { err }),
      color: 'error', icon: 'mdi-database-off-outline',
    })
  }
}

async function doImport(close: () => void) {
  importLoading.value = true
  try {
    if (isV2File.value) {
      const result = await processFullBackup(stagedImportData.value)
      const parts: string[] = []
      if (result.pilotsImported) parts.push(`${result.pilotsImported} pilot(s) imported`)
      if (result.pilotsBackedUp) parts.push(`${result.pilotsBackedUp} pilot(s) pending LCPs`)
      if (result.npcsImported) parts.push(`${result.npcsImported} NPC(s) imported`)
      if (result.npcsBackedUp) parts.push(`${result.npcsBackedUp} NPC(s) pending LCPs`)
      if (result.encountersImported) parts.push(`${result.encountersImported} encounter(s) imported`)
      if (result.encountersBackedUp) parts.push(`${result.encountersBackedUp} encounter(s) pending NPCs`)
      if (result.lcpsImported) parts.push(`${result.lcpsImported} content pack(s) installed`)
      notify({
        title: t('notify.settings.v2BackupImportedTitle'),
        text: parts.length ? parts.join(', ') + '.' : t('notify.settings.v2NoData'),
        icon: 'mdi-database-arrow-left-outline',
      })
    } else {
      await importAll(stagedImportData.value, strategy.value === 'overwrite')
      notify({
        title: t('notify.settings.dataImportSuccessTitle'),
        text: strategy.value === 'overwrite'
          ? t('notify.settings.dataReplaced')
          : t('notify.settings.dataMerged'),
        icon: 'mdi-database-arrow-left-outline',
      })
    }
    stagedImportData.value = null
    isV2File.value = false
    fileValue.value = null
    close()
  } catch (err) {
    notify({
      title: t('notify.settings.unableToImportTitle'),
      text: t('notify.settings.errorPrefix', { err }),
      color: 'error', icon: 'mdi-database-off-outline',
    })
  }
  importLoading.value = false
}
function getTransColor(code: string) {
  const pct = completeness.value[code] || 0
  if (pct >= QUALITY_THRESHOLD) return 'success'
  if (pct > 60) return 'warning'
  return 'error'
}
</script>
