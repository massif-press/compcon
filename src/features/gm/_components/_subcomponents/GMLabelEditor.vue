<template>
  <fieldset class="rounded-s" style="position: relative">
    <legend class="text-caption text-left ml-2 px-2">GM LABELS</legend>
    <v-dialog v-model="dialog" width="75vw">
      <template #activator="{ props }">
        <v-btn
          size="x-small"
          color="primary"
          style="position: absolute; top: -20px; right: 8px"
          v-bind="props"
          ><v-icon start icon="mdi-pencil" />Edit Labels
        </v-btn>
      </template>
      <v-card>
        <v-toolbar density="compact" class="heading h3"
          ><v-toolbar-title
            >Labels<cc-slashes class="px-2" /><span class="text-accent">{{
              item.Name
            }}</span></v-toolbar-title
          >
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <v-col>
            <v-card-text>
              <v-row dense class="mb-n4 text-caption">
                <v-col cols="9"> Label </v-col>
                <v-col cols="3"> Value (optional) </v-col>
              </v-row>
              <v-row v-for="label in item.NarrativeController.Labels" dense align="center">
                <v-col cols="9">
                  <v-combobox
                    v-model="label.title"
                    :items="availableLabels.map((x) => x.title)"
                    density="compact"
                    item-value="title"
                    hide-details
                    placeholder="Label"
                    class="mt-2" />
                </v-col>
                <v-col cols="2">
                  <v-combobox
                    v-model="label.value"
                    :items="getLabelValues(label)"
                    density="compact"
                    item-value="value"
                    placeholder="Value"
                    hide-details
                    class="mt-2" />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    class="mb-n1 fade-select"
                    @click="item.NarrativeController.Labels.splice(index, 1)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-col>
              </v-row>
              <v-btn variant="tonal" size="small" color="accent" class="mt-4" @click="addLabel()"
                ><v-icon icon="mdi-plus" start />Add Label</v-btn
              >
            </v-card-text>
          </v-col>
          <v-col cols="auto" align-self="center">
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-btn
                  size="x-small"
                  variant="flat"
                  icon
                  class="mr-4"
                  v-bind="props"
                  @click="labelExpand = !labelExpand">
                  <v-icon
                    size="20"
                    :icon="labelExpand ? 'mdi-chevron-right' : 'mdi-chevron-left'" />
                </v-btn>
              </template>
              <span>{{ labelExpand ? 'Hide' : 'Show' }} Label Palette</span>
            </v-tooltip>
          </v-col>
          <v-col v-if="labelExpand" cols="3">
            <v-card color="panel" class="rounded-0 pa-1" height="100%" style="position: relative">
              <div class="text-caption text-text">LABEL PALETTE</div>
              <v-divider class="text-text" />
              <div style="position: absolute; top: 24px; bottom: 0">
                <v-chip-group v-if="availableLabels.length" class="pa-1" style="height: 100%">
                  <v-chip
                    v-for="label in availableLabels"
                    size="small"
                    color="primary"
                    @click="addPaletteChip(label.title)"
                    >{{ label.title }}</v-chip
                  >
                </v-chip-group>
                <div v-else class="text-caption text-center pa-2"><i>No Labels Available</i></div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-chip-group class="pa-1 mt-n1">
      <cc-split-chip v-for="label in item.NarrativeController.Labels" :label="label" />
    </v-chip-group>
  </fieldset>
</template>

<script>
import { NarrativeStore } from '../../store/narrative_store';
import { NpcStore } from '../../store/npc_store';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    labelExpand: false,
  }),
  computed: {
    availableLabels() {
      return this.allLabels.filter((label) => {
        return !this.item.NarrativeController.Labels.some((item) => item.title === label.title);
      });
    },
    allLabels() {
      return [...NarrativeStore().getAllLabels, ...NpcStore().getAllLabels].filter(
        (x) => x.title.length > 0
      );
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        console.log(this.item.NarrativeController.Labels);
        this.item.NarrativeController.Labels = this.item.NarrativeController.Labels.filter(
          (label) => label.title.length > 0
        );
      }
    },
  },
  methods: {
    updateMessage() {
      this.message = 'Updated Message!';
    },
    getLabelValues(label) {
      const arr = this.allLabels.filter((item) => item !== label.title);
      if (!arr || !arr.length) return [];

      return this.allLabels
        .filter((item) => item.title === label.title)
        .flatMap((item) => item.value)
        .filter((x) => x);
    },
    addPaletteChip(chip) {
      this.item.NarrativeController.Labels.push({ title: chip, value: '' });
    },
    addLabel() {
      this.item.NarrativeController.Labels.push({ title: '', value: '' });
    },
  },
};
</script>
