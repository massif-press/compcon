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
      <statblock-justify-options v-model:enable-justify="enableJustify"
        v-model:line-width="lineWidth" />
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

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { CombatLog } from '@/classes/components/combat/CombatLog';
import StatblockJustifyOptions from './_StatblockJustifyOptions.vue';

const _display = useDisplay()

defineOptions({ name: 'ActorLogs' })

const props = defineProps<{
  actor: object
  encounter: object
}>()

const tab = ref('encounter')
const enableJustify = ref(true)
const lineWidth = ref(60)

const summary = computed(() => {
      void props.actor.CombatController.CombatLogVersion
      const t = props.actor.CombatController.CombatLog.Telemetry;
      let out = `${props.actor.CombatController.CombatName} - Round ${props.encounter.Round - 1}

`;
      out += CombatLog.FormatTelemetry(t, enableJustify.value, lineWidth.value);

      return out
    })

function copyContent(entry) {
      if (!entry) return;
      navigator.clipboard.writeText(summary.value);
    }
function exportLog(type: 'text' | 'json' = 'text') {
      let out;
      if (type === 'text') out = summary.value;
      else out = JSON.stringify({
        actor: props.actor.Name,
        actor_id: props.actor.ID,
        data: props.actor.CombatController.CombatLog.Telemetry,
      }, null, 2);

      const blob = new Blob([out], { type: type === 'text' ? 'text/plain' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${props.actor.Name} ${props.encounter.Name} round ${props.encounter.Round} telemetry.${type === 'text' ? 'txt' : 'json'}`;
      a.click();
      URL.revokeObjectURL(url);
    }

onMounted(() => {
if (_display.smAndDown.value) {
      enableJustify.value = false;
    }
})
</script>
