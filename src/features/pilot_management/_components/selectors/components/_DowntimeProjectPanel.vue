<template>
  <v-row justify="center">
    <v-col>
      <cc-titled-panel title="New Project" icon="mdi-atom-variant" color="reserve">
        <v-row density="compact">
          <v-col cols="12" md="">
            <v-text-field
              v-model="projectName"
              color="accent"
              label="Project Name"
              variant="outlined"
              hide-details />
          </v-col>
          <v-col cols="12" md="auto">
            <v-row no-gutters align="start">
              <v-col cols="auto" class="text-center">
                <v-switch
                  v-model="complicated"
                  density="compact"
                  inset
                  hide-details
                  color="secondary"
                  class="mr-3">
                  <template #label class="stat-text text-text">
                    Complicated
                    <cc-tooltip
                      simple
                      inline
                      content="This project is complex, resource-intensive, or generally difficult to complete">
                      <v-icon size="small" end>mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="auto" class="text-center">
                <v-switch v-model="finished" density="compact" inset hide-details color="secondary">
                  <template #label class="stat-text text-text">
                    Finished
                    <cc-tooltip
                      simple
                      inline
                      content="This project is complete and available to use as a <strong>reserve</strong>">
                      <v-icon size="small" end>mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </template>
                </v-switch>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-textarea
          v-model="details"
          auto-grow
          rows="2"
          label="Details"
          filled
          hide-details
          color="accent"
          class="my-3" />
        <v-combobox
          v-model="costs"
          label="Requirements"
          :items="projectCosts"
          chips
          multiple
          variant="outlined"
          color="accent"
          density="compact"
          class="mr-5 ml-5 mt-5"
          :disabled="finished"></v-combobox>
        <v-btn
          block
          tile
          large
          class="mb-2 mt-n2"
          color="primary"
          :disabled="!projectName"
          @click="add()">
          <v-icon start>mdi-plus</v-icon>
          Add Project
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Project } from '@/class';

export default {
  name: 'custom-reserve-panel',
  data: () => ({
    projectName: '',
    details: '',
    complicated: false,
    finished: false,
    costs: [],
    projectCosts: [
      'Quality materials',
      'Specific knowledge or techniques',
      'Specialized tools',
      'A good workspace',
    ],
  }),
  methods: {
    add() {
      const p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: `${this.projectName} ${this.finished ? '' : ' (In Progress)'}`,
        label: 'Project',
        description: '',
        complicated: this.complicated,
        can_finish: false,
        finished: false,
        progress: 0,
        requirements: [],
        resource_name: this.projectName,
        resource_note: this.details,
        resource_cost: '',
        used: false,
        consumable: false,
      });
      if (this.costs && !this.finished) p.ResourceCost = `Requires: ${this.costs.join(', ')}`;
      p.IsFinished = this.finished;
      this.clear();
      this.$emit('add', p);
    },
    clear() {
      this.projectName = '';
      this.details = '';
      this.complicated = false;
      this.finished = false;
      this.costs = [];
    },
  },
};
</script>
