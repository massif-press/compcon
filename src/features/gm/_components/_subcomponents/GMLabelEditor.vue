<template>
  <fieldset class="pb-2 px-2"
    style="position: relative">
    <legend class="text-caption text-left ml-2 px-2">GM LABELS</legend>
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
            Labels
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
                <v-col cols="9">Label</v-col>
                <v-col cols="3">Value (optional)</v-col>
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
                    placeholder="Label"
                    class="mt-2" />
                </v-col>
                <v-col cols="2">
                  <v-combobox v-model="label.value"
                    :items="getLabelValues(label)"
                    density="compact"
                    :error="labelExists(label)"
                    item-value="value"
                    placeholder="Value"
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
                Add Label
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
              <div>{{ labelExpand ? 'Hide' : 'Show' }} Label Palette</div>
            </v-tooltip>
          </v-col>
          <v-col v-if="labelExpand"
            cols="3">
            <v-card color="panel"
              class="rounded-0 pa-1"
              height="100%"
              style="position: relative">
              <div class="d-flex align-center">
                <div class="text-caption text-text flex-grow-1">LABEL PALETTE</div>
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
                  <div>Sort Alphabetically</div>
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
                  <div>Sort by Usage</div>
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
                  <i>No Labels Available</i>
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
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="item.NarrativeController.Labels.length === 0"
      class="text-caption text-center pa-1">
      <i style="opacity: 0.6">No Labels</i>
    </div>

    <cc-split-chip v-for="(label, li) in item.NarrativeController.Labels"
      :key="`chip-${li}`"
      :label="label"
      class="mx-1" />
  </fieldset>
</template>

<script lang="ts">
import { uniqBy } from 'lodash';
import { NarrativeStore } from '../../store/narrative_store'
import { NpcStore } from '../../store/npc_store'

export default {
  name: 'GmLabelEditor',
  props: {
    item: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
    labelExpand: false,
    alphaSortDir: 0,
    freqSortDir: 0,
  }),
  computed: {
    availableLabels() {
      return this.allLabels.filter(label => {
        return !this.item.NarrativeController.Labels.some(item => item.title === label.title)
      })
    },
    allLabels() {
      return uniqBy([...NarrativeStore().getAllLabels, ...NpcStore().getAllLabels].filter(
        x => x.title && x.title.length > 0
      ), 'title');
    },
    labelFrequency() {
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
    },
    sortedAvailableLabels() {
      const labels = [...this.availableLabels]
      if (this.alphaSortDir === 1) labels.sort((a, b) => a.title.localeCompare(b.title))
      else if (this.alphaSortDir === 2) labels.sort((a, b) => b.title.localeCompare(a.title))
      else if (this.freqSortDir === 1) labels.sort((a, b) => (this.labelFrequency[b.title] || 0) - (this.labelFrequency[a.title] || 0))
      else if (this.freqSortDir === 2) labels.sort((a, b) => (this.labelFrequency[a.title] || 0) - (this.labelFrequency[b.title] || 0))
      return labels
    },
    alphaSortIcon() {
      if (this.alphaSortDir === 1) return 'mdi-sort-alphabetical-ascending'
      if (this.alphaSortDir === 2) return 'mdi-sort-alphabetical-descending'
      return 'mdi-sort-alphabetical-variant'
    },
    freqSortIcon() {
      if (this.freqSortDir === 1) return 'mdi-sort-numeric-descending'
      if (this.freqSortDir === 2) return 'mdi-sort-numeric-ascending'
      return 'mdi-chart-bar'
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.item.NarrativeController.Labels = this.item.NarrativeController.Labels.filter(
          label => label.title.length > 0
        )
      }
    },
  },
  methods: {
    updateMessage() {
      this.message = 'Updated Message!'
    },
    getLabelValues(label) {
      const arr = this.allLabels.filter(item => item !== label.title)
      if (!arr || !arr.length) return []

      return this.allLabels
        .filter(item => item.title === label.title)
        .flatMap(item => item.value)
        .filter(x => x)
    },
    addPaletteChip(chip) {
      this.item.NarrativeController.Labels.push({ title: chip, value: '' })
    },
    addLabel() {
      this.item.NarrativeController.Labels.push({ title: '', value: '' })
    },
    cycleAlphaSort() {
      this.alphaSortDir = (this.alphaSortDir + 1) % 3
      if (this.alphaSortDir !== 0) this.freqSortDir = 0
    },
    cycleFreqSort() {
      this.freqSortDir = (this.freqSortDir + 1) % 3
      if (this.freqSortDir !== 0) this.alphaSortDir = 0
    },
    labelExists(label) {
      return this.item.NarrativeController.Labels.filter(x => x.title === label.title && x.value === label.value).length > 1
    },
  },
}
</script>
