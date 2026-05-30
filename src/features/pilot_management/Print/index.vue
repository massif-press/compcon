<template>
  <div class="printable">
    <v-card tile
      flat
      class="print-card"
      :style="{ marginLeft: 'auto', marginRight: 'auto', width: previewWidth }">
      <div>
        <component :is="options.layout.title"
          :options="options"
          :selected-mech="<Mech>selectedMech"
          :selected-pilot="<Pilot>selectedPilot"
          :has-bonds="hasBondData" />
        <div v-if="selectedPilot && options && options.extras">
          <template v-if="has('combat quick reference')">
            <page-break />
            <combat-ref />
          </template>
          <template v-if="has('action reference')">
            <page-break />
            <action-ref />
          </template>
          <template v-if="has('downtime quick reference')">
            <page-break />
            <downtime-ref />
          </template>
          <template v-if="has('relevant trigger reference')">
            <page-break />
            <trigger-info-print :pilot="<Pilot>selectedPilot" />
          </template>
          <template v-if="has('relevant tag reference')">
            <page-break />
            <tag-info-print :pilot="<Pilot>selectedPilot"
              :mech="<Mech>selectedMech" />
          </template>
        </div>
      </div>

      <v-bottom-navigation fixed
        grow
        horizontal
        color="primary"
        class="no-print pa-2">
        <v-btn stacked
          @click="$router.go(-1)">
          <span>Close Preview</span>
          <v-icon icon="mdi-close" />
        </v-btn>
        <v-select v-model="selectedPilot"
          :items="allPilots"
          :item-title="(x: Pilot) => `${x.Name} // ${x.Callsign}`"
          return-object
          density="compact"
          hide-details
          variant="outlined"
          label="Pilot"
          class="mx-3"
          clearable
          style="width: 10vw" />
        <v-select v-model="selectedMech"
          :items="pilotMechs"
          :item-title="(x: Mech) => `${x.Name} // ${x.Frame.Name}`"
          return-object
          density="compact"
          hide-details
          variant="outlined"
          label="Mech"
          class="mx-3"
          clearable
          style="width: 10vw" />
        <v-spacer />

        <cc-modal title="Print Options">
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>Options</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <options-dialog :has-bonds="hasBondData"
            :options="options" />
        </cc-modal>
        <v-btn @click="print()">
          <span>Print</span>
          <v-icon icon="mdi-printer" />
        </v-btn>
      </v-bottom-navigation>
    </v-card>
    <div class="no-print"
      style="min-height: 70px !important" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Expanded from './layouts/expanded/index.vue';
import Standard from './layouts/standard/index.vue';
import Terse from './layouts/terse/index.vue';
import Minimal from './layouts/minimal/index.vue';
import Cards from './layouts/cards/index.vue';
import TagInfoPrint from './extras/TagInfoPrint.vue';
import TriggerInfoPrint from './extras/TriggerInfoPrint.vue';
import CombatRef from '@/ui/components/print/CombatRef.vue';
import ActionRef from './extras/ActionRef.vue';
import DowntimeRef from './extras/DowntimeRef.vue';
import OptionsDialog from './OptionsDialog.vue';
import { PilotStore, CompendiumStore } from '@/stores';
import { Pilot } from '@/classes/pilot/Pilot'
import { Mech } from '@/classes/mech/Mech'
import PageBreak from './components/PageBreak.vue';
const router = useRouter()

defineOptions({ name: 'CombinedPrint' })

const props = withDefaults(defineProps<{
  presetPilot: string
  presetMech?: string
}>(), {
  presetMech: ''
})

const selectedPilot = ref(null as Pilot | null)
const selectedMech = ref(null as Mech | null)
const blank = ref(false)
const options = ref({
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      content: { title: 'Pilot', icon: 'cc:pilot' },
      bonds: { title: 'Include', icon: 'mdi-link' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      pilotInclude: [],
      mechInclude: [],
      extras: [],
      card: [],
    } as any)

const allPilots = computed(() => {
      return PilotStore().Pilots.filter((x) => !x.SaveController.IsDeleted);
    })
const pilotMechs = computed(() => {
      return selectedPilot.value ? selectedPilot.value.Mechs : [];
    })
const hasBondData = computed(() => {
      return CompendiumStore().Bonds.length > 0;
    })
const previewWidth = computed(() => {
      const portrait = options.value.orientation.title === 'Portrait'
      const letter = options.value.paper.title === 'Letter'
      if (portrait) return letter ? '216mm' : '210mm'
      return letter ? '279mm' : '297mm'
    })
const optionsFields = computed(() => {
      const titles = [] as string[];

      function traverse(value) {
        if (Array.isArray(value)) {
          value.forEach(traverse);
        } else if (value && typeof value === 'object') {
          if ('title' in value) {
            titles.push(value.title.toLowerCase());
          }
          Object.values(value).forEach(traverse);
        }
      }

      traverse(options.value);
      return titles;
    })

function print() {
      const orientation = options.value.orientation.title.toLowerCase()
      const paper = options.value.paper.title === 'A4' ? 'A4' : 'letter'
      const existing = document.getElementById('__cc-print-page')
      if (existing) existing.remove()
      const style = document.createElement('style')
      style.id = '__cc-print-page'
      style.textContent = `@page { size: ${paper} ${orientation}; margin: 0; }`
      document.head.appendChild(style)
      window.print()
    }
function has(str: string) {
      return optionsFields.value.includes(str);
    }

onMounted(() => {
if (!props.presetPilot) return;
    selectedPilot.value = PilotStore().Pilots.find((p) => p.ID === props.presetPilot) as Pilot;
    if (props.presetMech)
      selectedMech.value = selectedPilot.value?.Mechs.find((m) => m.ID === props.presetMech) || null;
})
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style>
@media print {

  html,
  body {
    background-color: white !important;
  }

  * {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  p,
  .flavor-text,
  .caption,
  .text-caption {
    widows: 2;
    orphans: 2;
  }

  .print-section,
  .no-print-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .print-section-header {
    break-after: avoid;
    page-break-after: avoid;
  }

  fieldset {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  fieldset>legend {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* Keep section overline labels attached to the content that follows */
  .text-overline {
    break-after: avoid;
    page-break-after: avoid;
  }

  .heading,
  legend {
    overflow-wrap: break-word;
    word-break: break-word;
  }
}
</style>

<style scoped>
.print-card {
  padding: 8px;
  background-color: white;
  color: black;
  margin-top: 16px;
}

@page {
  margin: 0;
}

@media print {
  .print-card {
    margin: 0;
    padding: 0;
    width: 100% !important;
    overflow: visible;
  }

  .printable {
    width: 100% !important;
    max-width: 100% !important;
    background-color: white;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible;
  }
}
</style>
