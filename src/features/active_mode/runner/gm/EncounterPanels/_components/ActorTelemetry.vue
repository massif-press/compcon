<template>
  <cc-dialog icon="mdi-clipboard-text"
    :title="`${actor.Name} Combat Telemetry`"
    :close-on-click="false">
    <template #activator="{ open }">
      <v-btn size="x-small"
        flat
        tile
        @click="open">
        <v-icon icon="mdi-chart-donut-variant"
          start />
        Telemetry
      </v-btn>
    </template>
    <template #default>
      <v-alert density="compact"
        class="text-caption mt-2 mb-4"
        flat
        tile
        color="panel"
        border=start
        border-color="red">This feature is still in development. Additional telemetry data is
        forthcoming. <b class="text-accent">Telemetry data is collected at the end of every
          round</b>
      </v-alert>
      <v-row dense
        class="mb-2">
        <v-col>
          <cc-switch v-model="enableJustify"
            label="Justify" />
        </v-col>
        <v-col cols="auto">
          <v-slide-x-reverse-transition>
            <div v-if="enableJustify"
              style="width: 300px;">
              <cc-number-field v-model.number="lineWidth"
                label="Line Width"
                color="primary"
                density="compact"
                size="small"
                type="number"
                variant="outlined"
                max="99999"
                dense
                hide-details />
            </div>
          </v-slide-x-reverse-transition>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn flat
            block
            :color="tab === 'encounter' ? 'primary' : 'panel'"
            tile
            size="small"
            @click="tab = 'encounter'">encounter</v-btn>
        </v-col>
        <v-col>
          <v-btn flat
            block
            disabled
            :color="tab === 'lifetime' ? 'primary' : 'panel'"
            tile
            size="small"
            @click="tab = 'lifetime'">lifetime</v-btn>
        </v-col>
      </v-row>

      <cc-panel color="background"
        class="my-2"
        style="position: relative;">
        <div style="font-family: 'Consolas'; font-size: 14px; white-space: pre-wrap;">
          {{ summary }}
        </div>
        <v-btn icon="mdi-content-copy"
          size="x-small"
          flat
          tile
          class="fade-select"
          style="position: absolute; bottom: 0; right: 0;"
          @click.stop="copyContent('encounter')" />
      </cc-panel>

      <div>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <cc-button size="small"
              block
              color="primary"
              prepend-icon="mdi-export"
              :tooltip="`Exports a plain text version of the ${tab} combat telemetry.`"
              @click.stop="exportLog('text')">
              Export as Text
            </cc-button>
          </v-col>
          <v-col>
            <cc-button size="small"
              block
              color="info"
              prepend-icon="mdi-export"
              :tooltip="`Exports a structured JSON version of the ${tab} combat telemetry for use in other
                    applications.`"
              @click.stop="exportLog('json')">
              Export as JSON
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </template>
  </cc-dialog>

</template>

<script lang="ts">
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
  data: () => ({
    tab: 'encounter',
    enableJustify: true,
    lineWidth: 60,
  }),
  computed: {
    summary() {
      const t = this.actor.CombatController.CombatLog.Telemetry;
      let out = `${this.actor.CombatController.CombatName} - Round ${this.encounter.Round - 1}\n\n`;
      out += `Rounds: ${t.rounds} (${t.rounds_mounted} mounted, ${t.rounds_dismounted} unmounted)\n`;
      out += `Movement: ${t.movement} spaces (${t.pilot_movement} unmounted)\n`;
      if (this.enableJustify) {
        out += `\n${this.justify(['Damage', 'Dealt', 'Taken'])}\n`
        for (const e in t.damage) {
          out += `${this.justify([e.toUpperCase(), t.damage[e].gained.toString(), t.damage[e].lost.toString()])}\n`
        };
        out += `\n${this.justify(['Stat', 'Gain', 'Loss'])}\n`
        for (const e in t.stats) {
          out += `${this.justify([e.toUpperCase(), t.stats[e].gained.toString(), t.stats[e].lost.toString()])}\n`
        };
      } else {
        out += `\n`
        for (const e in t.damage) {
          out += `${e.toUpperCase()}: +${t.damage[e].gained} / -${t.damage[e].lost}\n`
        };
        out += `\n`
        for (const e in t.stats) {
          out += `${e.toUpperCase()}: +${t.stats[e].gained} / -${t.stats[e].lost}\n`
        };
      }

      return out
    }
  },
  methods: {
    copyContent(entry) {
      if (!entry) return;
      navigator.clipboard.writeText(this.summary);
    },
    justify(arr) {
      if (!this.enableJustify) return arr.filter(x => x.length).join('   ');
      if (!arr.length) return "";

      const cols = arr.length;

      const step = this.lineWidth / cols;
      const starts = [] as number[];

      for (let i = 0; i < cols; i++) {
        starts.push(Math.floor(i * step));
      }

      let line = Array(this.lineWidth).fill(" ");

      for (let i = 0; i < cols; i++) {
        const start = starts[i];
        const text = arr[i];

        for (let j = 0; j < text.length && start + j < this.lineWidth; j++) {
          line[start + j] = text[j];
        }
      }

      return line.join("");
    },
    exportLog(type: 'text' | 'json' = 'text') {
      let out;
      if (type === 'text') out = this.summary;
      else out = JSON.stringify({
        actor: this.actor.Name,
        actor_id: this.actor.ID,
        data: this.actor.CombatController.CombatLog.Telemetry,
      }, null, 2);

      const blob = new Blob([out], { type: type === 'text' ? 'text/plain' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.actor.Name} ${this.encounter.Name} round ${this.encounter.Round} telemetry.${type === 'text' ? 'txt' : 'json'}`;
      a.click();
      URL.revokeObjectURL(url);
    },

  },
};
</script>
