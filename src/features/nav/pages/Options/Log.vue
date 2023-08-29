<template>
  <v-container>
    <div style="max-height: 550px; overflow-y: scroll">
      <v-expansion-panels>
        <v-expansion-panel v-for="item in history">
          <v-expansion-panel-title>
            <v-chip size="small" label class="mr-4" :color="item.color">{{ item.type }}</v-chip>
            {{ item.message }} - {{ timestamp(item.timestamp) }}
            <v-spacer />
            <v-btn size="small" icon variant="plain" @click="sendToClipboard(item)">
              <v-icon icon="mdi-content-copy" />
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col>
                <div class="heading h3">TRACE</div>
                <v-divider />
                <ol>
                  <li v-for="t in item.trace">
                    <div v-html="formatTrace(t)" />
                  </li>
                </ol>
              </v-col>
              <v-col>
                <div class="heading h3">CALLER</div>
                <v-divider />
                <div v-if="item.caller">
                  <div class="text-primary font-weight-bold">
                    {{ item.caller.constructor.name }}
                  </div>
                  <v-list density="compact">
                    <v-list-item
                      v-for="k in Object.keys(item.caller)"
                      :title="k"
                      :subtitle="JSON.stringify(item.caller[k])"
                    />
                  </v-list>
                </div>
                <div v-else>no data</div>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
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
  },
  methods: {
    timestamp(t: number) {
      return new Date(t).toLocaleTimeString();
    },
    formatTrace(t: string) {
      if (!t) return 'no data';
      return (
        t.replace('(', '').replace('/', '<div style="font-size:13px; margin-top: -4px">/') +
        '</div>'
      );
    },
    sendToClipboard(item: any) {
      let trace = item.trace.join('\n');
      let text = `${item.message} (${item.type})\n${trace}\n${item.caller || 'no caller'}`;
      navigator.clipboard.writeText(text);
    },
  },
};
</script>
