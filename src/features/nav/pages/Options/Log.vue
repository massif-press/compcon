<template>
  <v-container>
    <div style="max-height: 525px; overflow-y: scroll">
      <div class="text-caption">
        Log level:
        <b class="text-uppercase">{{ logger.level }}</b>
      </div>
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="item in history">
          <v-expansion-panel-title>
            <v-chip size="small" label class="mr-4" :color="item.color">{{ item.type }}</v-chip>
            {{ item.message }} - {{ timestamp(item.timestamp) }}
            <v-spacer />
            <v-btn size="small" icon variant="plain" @click.stop="sendToClipboard(item)">
              <v-icon icon="mdi-content-copy" />
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col>
                <div class="heading h3">TRACE</div>
                <v-divider />
                <ul>
                  <li v-for="t in item.trace">
                    <div v-html="formatTrace(t)" />
                  </li>
                </ul>
              </v-col>
              <v-col>
                <div class="heading h3">CALLER</div>
                <v-divider />
                <div v-if="item.caller">
                  <div class="text-accent font-weight-bold">
                    {{ item.caller.constructor.name }}
                  </div>
                  <v-list density="compact">
                    <v-list-item
                      v-for="k in Object.keys(item.caller)"
                      :title="k"
                      :subtitle="JSON.stringify(item.caller[k])" />
                  </v-list>
                </div>
                <div v-else class="text-center text-disabled"><i>no data</i></div>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-actions>
        <v-spacer />
        <v-btn icon :disabled="!history.length" @click="exportLog">
          <v-icon>mdi-file-download</v-icon>
        </v-btn>
      </v-card-actions>
    </div>
  </v-container>
</template>

<script lang="ts">
import logger from '@/user/logger';

export default {
  name: 'Log',
  computed: {
    history() {
      return logger.History.reverse();
    },
    logger() {
      return logger;
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
      let trace = item.trace.join('\n');
      let text = `${item.message} (${item.type})\n------\ntrace:\n${trace}\n------\n${
        item.caller ? 'caller:\n' + JSON.stringify(item.caller, null, 2) : 'no caller'
      }`;
      navigator.clipboard.writeText(text);
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
  },
};
</script>
