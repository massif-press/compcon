<template>
  <v-container :class="!mobile && 'px-12'">
    <v-row class="mb-2">
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          :text="$t('nav.settingsPage.logLevel')" />
        <div>
          <v-menu>
            <template #activator="{ props }">
              <v-list-item v-bind="props"
                three-line
                border>
                <v-list-item-subtitle>
                  <b class="text-uppercase">{{ level }}</b>
                </v-list-item-subtitle>
                <template #append>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item v-for="item in levels"
                :key="item"
                :title="item"
                @click="level = item" />
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          :text="$t('nav.log.session')" />
        <div>
          <v-menu>
            <template #activator="{ props }">
              <v-list-item v-bind="props"
                three-line
                border>
                <v-list-item-subtitle>
                  <b>{{ selectedSessionName }}</b>
                  <span class="text-disabled ml-2">{{ sessionTime(selectedSession?.startedAt) }}</span>
                </v-list-item-subtitle>
                <template #append>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item v-for="(s, i) in sessions"
                :key="s.id"
                :title="logger.sessionLabel(i)"
                :subtitle="sessionTime(s.startedAt)"
                @click="selectedSessionId = s.id" />
            </v-list>
          </v-menu>
        </div>
      </v-col>
    </v-row>
    <v-expansion-panels multiple
      color="panel"
      flat
      tile>
      <v-expansion-panel v-for="(item, index) in history"
        :key="`log-${index}`"
        height="20px">
        <v-expansion-panel-title>
          <v-chip size="small"
            label
            class="mr-4"
            :color="item.color">{{ item.type }}</v-chip>
          {{ item.message }} - {{ timestamp(item.timestamp) }}
          <span class="text-disabled ml-2">({{ selectedSessionName }})</span>
          <v-spacer />
          <v-btn size="small"
            icon
            variant="plain"
            @click.stop="sendToClipboard(item)">
            <v-icon icon="mdi-content-copy" />
          </v-btn>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="bg-background">
          <v-row>
            <v-col>
              <div v-if="item.errorName"
                class="mb-2">
                <div class="heading h3">{{ $t('nav.log.error') }}</div>
                <v-divider />
                <div class="text-error font-weight-bold">{{ item.errorName }}</div>
                <div class="text-caption">{{ item.errorMessage }}</div>
              </div>
              <div class="heading h3">{{ $t('nav.log.trace') }}</div>
              <v-divider />
              <ul v-if="Array.isArray(item.trace)">
                <li v-for="(t, idxt) in item.trace"
                  :key="`trace-${idxt}`">
                  <div v-html-safe="formatTrace(t)" />
                </li>
              </ul>
              <pre v-else
                class="text-caption"
                style="white-space: pre-wrap; word-break: break-all">{{
                  item.trace }}</pre>

            </v-col>
            <v-col>
              <div class="heading h3">{{ $t('nav.log.caller') }}</div>
              <v-divider />
              <div v-if="item.caller">
                <div class="text-accent font-weight-bold">
                  {{ item.callerName ?? '' }}
                </div>
                <pre class="text-caption"
                  style="white-space: pre-wrap; word-break: break-all">{{
                    safeStringify(item.caller) }}</pre>
              </div>
              <div v-else
                class="text-center text-disabled"><i>{{ $t('nav.log.noData') }}</i></div>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions>
      <v-btn size="small"
        variant="text"
        :disabled="!logger.History.length"
        @click="clearLog()">
        {{ $t('nav.log.clearLog') }}
        <v-icon end
          icon="mdi-delete-sweep" />
      </v-btn>
      <v-spacer />
      <v-btn size="small"
        class="mr-2"
        :disabled="!history.length"
        @click="exportSession()">
        {{ $t('nav.log.exportThisSession') }}
        <v-icon end
          icon="mdi-file-download" />
      </v-btn>
      <v-btn size="small"
        :disabled="!hasAnyEntries"
        @click="exportAll()">
        {{ $t('nav.log.exportAllSessions') }}
        <v-icon end
          icon="mdi-file-download-outline" />
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { notify } from '@/util/notify'
import logger, { LEVELS } from '@/user/logger'

const { mdAndDown: mobile } = useDisplay()
const { t } = useI18n()

const tick = ref(0)

const levels = Object.values(LEVELS)
const level = computed({
  get: () => {
    void tick.value
    return logger.level
  },
  set: v => {
    logger.level = v
    tick.value++
  },
})

const sessions = computed(() => {
  void tick.value
  return logger.Sessions
})

const selectedSessionId = ref(logger.Sessions[0]?.id ?? '')
const selectedSession = computed(
  () => sessions.value.find(s => s.id === selectedSessionId.value) ?? sessions.value[0]
)
const selectedSessionName = computed(() => {
  const idx = selectedSession.value ? sessions.value.indexOf(selectedSession.value) : 0
  return logger.sessionLabel(idx)
})

const history = computed(() => {
  void tick.value
  const severityMap: Record<string, number> = { debug: 1, info: 2, warn: 3, error: 4 }
  const minLevel = severityMap[logger.level] ?? 0
  const entries = selectedSession.value?.entries ?? []
  return entries.filter(item => (severityMap[item.type] ?? 0) >= minLevel).reverse()
})

const hasAnyEntries = computed(() => sessions.value.some(s => s.entries.length))

function sessionTime(ts?: number) {
  if (!ts) return ''
  return new Date(ts).toLocaleString()
}

function clearLog() {
  logger.clear()
  tick.value++
}

function timestamp(t: number) {
  const date = new Date(t)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = String(hours % 12 || 12).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')
  const formattedMilliseconds = String(milliseconds).padStart(3, '0')
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds} ${period}`
}

function formatTrace(t: string) {
  if (!t) return 'no data'
  return (
    t
      .replace('(', '')
      .replace('/', '<div style="font-size:13px; margin-top: -4px; margin-left: 6px">/') +
    '</div>'
  )
}

function sendToClipboard(item: any) {
  const trace = Array.isArray(item.trace) ? item.trace.join('\n') : item.trace
  const text = `${item.message} (${item.type})\n------\ntrace:\n${trace}\n------\n${item.caller ? 'caller:\n' + JSON.stringify(item.caller, null, 2) : 'no caller'
    }`
  navigator.clipboard.writeText(text)
  notify({ type: 'success', text: t('nav.log.copiedToClipboard') })
}

function download(data: string, suffix: string) {
  const blob = new Blob([data], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `compcon-log-${suffix}-${new Date(Date.now()).toLocaleDateString()}.txt`
  a.click()
}

function exportSession() {
  download(logger.export(selectedSessionId.value), 'session')
}

function exportAll() {
  download(logger.export(), 'all')
}

function safeStringify(obj: any) {
  return logger.SafeStringify(obj)
}
</script>
