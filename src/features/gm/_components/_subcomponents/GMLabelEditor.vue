<template>
  <div>
  <fieldset class="pb-2 px-2"
    style="position: relative">
    <legend class="text-caption text-left ml-2 px-2">{{ $t('gm.labels.heading') }}</legend>
    <v-dialog v-model="dialog"
      width="75vw">
      <template #activator="{ props }">
        <v-btn v-show="!readonly"
          size="x-small"
          color="primary"
          style="position: absolute; top: -20px; right: 8px"
          v-bind="props">
          <v-icon icon="mdi-pencil" />
        </v-btn>
      </template>
      <v-card style="min-height: 40vh">
        <v-toolbar density="compact"
          class="heading h3">
          <v-toolbar-title>
            {{ $t('gm.labels.labels') }}
            <cc-slashes class="px-2" />
            <span class="text-accent">{{ item.Name }}</span>
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon
            @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <v-col>
            <v-card-text>
              <v-row dense
                class="mb-n4 text-caption">
                <v-col cols="9">{{ $t('gm.labels.label') }}</v-col>
                <v-col cols="3">{{ $t('gm.labels.valueOptional') }}</v-col>
              </v-row>
              <v-row v-for="(label, index) in item.NarrativeController.Labels"
                :key="`label-${index}`"
                dense
                align="center">
                <v-col cols="9">
                  <v-combobox v-model="label.title"
                    :items="availableLabels.map(x => x.title)"
                    :error="labelExists(label)"
                    :error-messages="labelExists(label) ? ['Label with this name and value already exists'] : []"
                    density="compact"
                    item-value="title"
                    :hide-details="!labelExists(label)"
                    :placeholder="$t('gm.labels.label')"
                    class="mt-2" />
                </v-col>
                <v-col cols="2">
                  <v-combobox v-model="label.value"
                    :items="getLabelValues(label)"
                    density="compact"
                    :error="labelExists(label)"
                    item-value="value"
                    :placeholder="$t('gm.fields.value')"
                    :hide-details="!labelExists(label)"
                    class="mt-2" />
                </v-col>
                <v-col cols="auto">
                  <v-btn icon
                    variant="text"
                    size="small"
                    color="error"
                    class="mb-n1 fade-select"
                    @click="item.NarrativeController.Labels.splice(index, 1)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-btn variant="tonal"
                size="small"
                color="accent"
                class="mt-4"
                @click="addLabel()">
                <v-icon icon="mdi-plus"
                  start />
                {{ $t('gm.labels.addLabel') }}
              </v-btn>
            </v-card-text>
          </v-col>
          <v-col cols="auto"
            align-self="center"
            class="mr-4">
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <cc-button variant="outlined"
                  :icon="labelExpand ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                  v-bind="props"
                  @click="labelExpand = !labelExpand" />
              </template>
              <div>{{ labelExpand ? $t('common.hide') : $t('common.show') }} {{ $t('gm.labels.labelPalette') }}</div>
            </v-tooltip>
          </v-col>
          <v-col v-if="labelExpand"
            cols="3">
            <v-card color="panel"
              class="rounded-0 pa-1"
              height="100%"
              style="position: relative">
              <div class="d-flex align-center">
                <div class="text-caption text-text flex-grow-1">{{ $t('gm.labels.labelPalette') }}</div>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-btn icon
                      variant="text"
                      size="x-small"
                      v-bind="props"
                      @click="cycleAlphaSort">
                      <v-icon :color="alphaSortDir ? 'accent' : ''">{{ alphaSortIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <div>{{ $t('gm.labels.sortAlphabetically') }}</div>
                </v-tooltip>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-btn icon
                      variant="text"
                      size="x-small"
                      v-bind="props"
                      @click="cycleFreqSort">
                      <v-icon :color="freqSortDir ? 'accent' : ''">{{ freqSortIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <div>{{ $t('gm.labels.sortByUsage') }}</div>
                </v-tooltip>
              </div>
              <v-divider class="text-text" />
              <div style="position: absolute; top: 32px; bottom: 0">
                <v-chip-group v-if="availableLabels.length"
                  column
                  class="pa-1">
                  <v-chip v-for="label in sortedAvailableLabels"
                    :key="label.title"
                    size="small"
                    color="accent"
                    @click="addPaletteChip(label.title)">
                    {{ label.title }}
                  </v-chip>
                </v-chip-group>
                <div v-else
                  class="text-caption text-center pa-2">
                  <i>{{ $t('gm.labels.noLabelsAvailable') }}</i>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text
            @click="dialog = false">
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="item.NarrativeController.Labels.length === 0"
      class="text-caption text-center pa-1">
      <i style="opacity: 0.6">{{ $t('gm.labels.noLabels') }}</i>
    </div>

    <cc-split-chip v-for="(label, li) in item.NarrativeController.Labels"
      :key="`chip-${li}`"
      :label="label"
      class="mx-1" />
  </fieldset>
  </div>
</template>

<script setup lang="ts">
import type { GMItem } from '../../gmItem'
import { computed, ref, watch } from 'vue'
import { uniqBy } from 'lodash'
import { NarrativeStore } from '../../store/narrative_store'
import { NpcStore } from '../../store/npc_store'

defineOptions({ name: 'GmLabelEditor' })

const props = defineProps<{
  item: GMItem
  readonly?: boolean
}>()

const dialog = ref(false)
const labelExpand = ref(false)
const alphaSortDir = ref(0)
const freqSortDir = ref(0)
const message = ref('')

const allLabels = computed(() =>
  uniqBy([...NarrativeStore().getAllLabels, ...NpcStore().getAllLabels].filter(
    (x: any) => x.title && x.title.length > 0
  ), 'title')
)

const labelFrequency = computed((): Record<string, number> => {
  const counts: Record<string, number> = {}
  NpcStore().Npcs.forEach((npc: any) => {
    const seen = new Set<string>()
    npc.NarrativeController.Labels.forEach((label: any) => {
      if (label.title && !seen.has(label.title)) {
        seen.add(label.title)
        counts[label.title] = (counts[label.title] || 0) + 1
      }
    })
  })
  return counts
})

const availableLabels = computed(() =>
  allLabels.value.filter((label: any) =>
    !(props.item as any).NarrativeController.Labels.some((item: any) => item.title === label.title)
  )
)

const sortedAvailableLabels = computed(() => {
  const labels = [...availableLabels.value] as any[]
  if (alphaSortDir.value === 1) labels.sort((a, b) => a.title.localeCompare(b.title))
  else if (alphaSortDir.value === 2) labels.sort((a, b) => b.title.localeCompare(a.title))
  else if (freqSortDir.value === 1) labels.sort((a, b) => (labelFrequency.value[b.title] || 0) - (labelFrequency.value[a.title] || 0))
  else if (freqSortDir.value === 2) labels.sort((a, b) => (labelFrequency.value[a.title] || 0) - (labelFrequency.value[b.title] || 0))
  return labels
})

const alphaSortIcon = computed(() => {
  if (alphaSortDir.value === 1) return 'mdi-sort-alphabetical-ascending'
  if (alphaSortDir.value === 2) return 'mdi-sort-alphabetical-descending'
  return 'mdi-sort-alphabetical-variant'
})

const freqSortIcon = computed(() => {
  if (freqSortDir.value === 1) return 'mdi-sort-numeric-descending'
  if (freqSortDir.value === 2) return 'mdi-sort-numeric-ascending'
  return 'mdi-chart-bar'
})

watch(dialog, (val) => {
  if (!val) {
    ; (props.item as any).NarrativeController.Labels = (props.item as any).NarrativeController.Labels.filter(
      (label: any) => label.title.length > 0
    )
  }
})

function updateMessage() {
  message.value = 'Updated Message!'
}

function getLabelValues(label: any) {
  const arr = allLabels.value.filter((item: any) => item !== label.title)
  if (!arr || !arr.length) return []
  return allLabels.value
    .filter((item: any) => item.title === label.title)
    .flatMap((item: any) => item.value)
    .filter((x: any) => x)
}

function addPaletteChip(chip: string) {
  ; (props.item as any).NarrativeController.Labels.push({ title: chip, value: '' })
}

function addLabel() {
  ; (props.item as any).NarrativeController.Labels.push({ title: '', value: '' })
}

function cycleAlphaSort() {
  alphaSortDir.value = (alphaSortDir.value + 1) % 3
  if (alphaSortDir.value !== 0) freqSortDir.value = 0
}

function cycleFreqSort() {
  freqSortDir.value = (freqSortDir.value + 1) % 3
  if (freqSortDir.value !== 0) alphaSortDir.value = 0
}

function labelExists(label: any) {
  return (props.item as any).NarrativeController.Labels.filter(
    (x: any) => x.title === label.title && x.value === label.value
  ).length > 1
}
</script>
