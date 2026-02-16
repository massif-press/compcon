<template>
  <cc-dialog icon="mdi-clipboard-text"
    :title="`${actor.Name} Combat Log`"
    :close-on-click="false">
    <template #activator="{ open }">
      <v-btn size="x-small"
        flat
        tile
        @click="open">
        <v-icon icon="mdi-clipboard-text"
          start />
        Log
      </v-btn>
    </template>
    <template #default>
      <cc-panel v-for="(log, index) in summary"
        color="background"
        class="mb-2"
        style="position: relative;"
        :title="log.title"
        :key="index">
        <div style="font-family: 'Consolas'; font-size: 14px; white-space: pre-wrap;">
          {{ log.text }}
        </div>
        <v-btn icon="mdi-content-copy"
          size="x-small"
          flat
          tile
          class="fade-select"
          style="position: absolute; bottom: 0; right: 0;"
          @click.stop="copyContent(log)" />
      </cc-panel>

      <div v-if="summary.length === 0"
        class="text-center text-disabled text-cc-overline pa-4">
        No combat log entries.
      </div>
      <div v-else>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <cc-button size="small"
              block
              color="primary"
              prepend-icon="mdi-export"
              tooltip="Exports a plain text version of the combat log."
              @click.stop="exportLog('text')">
              Export Text Log
            </cc-button>
          </v-col>
          <v-col>
            <cc-button size="small"
              block
              color="info"
              prepend-icon="mdi-export"
              tooltip="Exports a structured JSON version of the combat log for use in other
                    applications."
              @click.stop="exportLog('json')">
              Export JSON Log
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </template>
  </cc-dialog>

</template>

<script lang="ts">
import { ActionSummary } from '@/classes/components/feature/active_effects/EffectActionSummary';


export default {
  name: 'ActorLogs',
  props: {
    actor: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  computed: {
    summary() {
      let out = [] as { title: string; text: string }[];
      this.actor.CombatController.CombatLog.History.forEach((log, index) => {
        let stringSummary = log.action ? new ActionSummary(log.action).Summarize(this.actor.ID) : log.event || 'No summary available.';
        out.push({
          title: `${new Date(log.timestamp).toLocaleString()} — Round ${log.round}, Action ${index + 1}`,
          text: stringSummary,
        });
      });
      return out;
    }
  },
  methods: {
    copyContent(entry) {
      if (!entry) return;
      navigator.clipboard.writeText(`${entry.title}\n${entry.text}\n`);
    },
    exportLog(type: 'text' | 'json' = 'text') {
      let out;
      if (type === 'text') out = this.summary.map(entry => `${entry.title}\n${entry.text}\n`).join('\n');
      else out = JSON.stringify({
        actor: this.actor.Name,
        actor_id: this.actor.ID,
        log: this.actor.CombatController.CombatLog.History.map(log => ({
          timestamp: log.timestamp,
          round: log.round,
          summary: log.event,
          action: log.action || '',
          event: log.event || '',
        })),
      }, null, 2);

      const blob = new Blob([out], { type: type === 'text' ? 'text/plain' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.actor.Name} ${this.encounter.Name} round ${this.encounter.Round} combat log.${type === 'text' ? 'txt' : 'json'}`;
      a.click();
      URL.revokeObjectURL(url);
    },

  },
};
</script>
