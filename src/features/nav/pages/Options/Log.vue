<template>
  <v-container :class="!mobile && 'px-12'">
    <div class="text-caption">
      {{ lg.logLevel }}
      <b class="text-uppercase">{{ logger.level }}</b>
    </div>
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
              <div class="heading h3">{{ lg.trace }}</div>
              <v-divider />
              <ul v-if="Array.isArray(item.trace)">
                <li v-for="(t, idxt) in item.trace"
                  :key="`trace-${idxt}`">
                  <div v-html-safe="formatTrace(t)" />
                </li>
              </ul>
              <div v-else
                v-html-safe="formatTrace(item.trace)" />

            </v-col>
            <v-col>
              <div class="heading h3">{{ lg.caller }}</div>
              <v-divider />
              <div v-if="item.caller">
                <div class="text-accent font-weight-bold">
                  {{ item.caller.constructor?.name ?? '' }}
                </div>
                <pre class="text-caption"
                  style="white-space: pre-wrap; word-break: break-all">{{ safeStringify(sanitizeCaller(item.caller)) }}</pre>
              </div>
              <div v-else
                class="text-center text-disabled"><i>{{ lg.noData }}</i></div>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions>
      <v-spacer />
      <v-btn size="small"
        :disabled="!history.length"
        @click="exportLog()">
        {{ lg.exportLog }}
        <v-icon end
          icon="mdi-file-download" />
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script lang="ts">
import logger from '@/user/logger';
import { NAV_STRINGS } from '@/features/nav/strings';

export default {
  name: 'Log',
  setup() {
    return { lg: NAV_STRINGS.log }
  },
  computed: {
    history() {
      const severityMap = { debug: 1, info: 2, warn: 3, error: 4 };
      const minLevel = severityMap[logger.level] ?? 0;
      return logger.History.filter(item => (severityMap[item.type] ?? 0) >= minLevel).reverse();
    },
    logger() {
      return logger;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    timestamp(t: number) {
      const date = new Date(t);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();

      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = String(hours % 12 || 12).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      const formattedMilliseconds = String(milliseconds).padStart(3, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds} ${period}`;
    },
    formatTrace(t: string) {
      if (!t) return 'no data';
      return (
        t
          .replace('(', '')
          .replace('/', '<div style="font-size:13px; margin-top: -4px; margin-left: 6px">/') +
        '</div>'
      );
    },
    sendToClipboard(item: any) {
      const trace = Array.isArray(item.trace) ? item.trace.join('\n') : item.trace;
      const text = `${item.message} (${item.type})\n------\ntrace:\n${trace}\n------\n${item.caller ? 'caller:\n' + JSON.stringify(item.caller, null, 2) : 'no caller'
        }`;
      navigator.clipboard.writeText(text);
      this.$notify({
        type: 'success',
        text: this.lg.copiedToClipboard,
      });
    },
    exportLog() {
      const data = logger.export();
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compcon-log-${new Date(Date.now()).toLocaleDateString()}.txt`;
      a.click();
    },
    safeStringify(obj) {
      return logger.SafeStringify(obj);
    },
    sanitizeCaller(caller: any) {
      if (!caller || typeof caller !== 'object') return caller;
      const out: Record<string, any> = {};
      for (const key of Object.keys(caller)) {
        if (key.startsWith('$')) continue;
        out[key] = key.toLowerCase() === 'password' ? '[REDACTED]' : caller[key];
      }
      return out;
    },
  },
};
</script>
