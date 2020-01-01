<template>
  <v-row justify="center">
    <v-col cols="7">
      <cc-titled-panel title="New Organization" icon="cci-barrage" color="reserve--project">
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="projectName" label="Project Name" outlined hide-details />
          </v-col>
          <v-col cols="3" class="text-center">
            <v-switch v-model="complicated" dense inset hide-details color="secondary">
              <span slot="label" class="stat-text text--text">
                Complicated
                <cc-tooltip
                  simple
                  inline
                  content="This project is complex, resource-intensive, or generally difficult to complete"
                >
                  <v-icon small>mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </span>
            </v-switch>
          </v-col>
          <v-col cols="3" class="text-center">
            <v-switch v-model="finished" dense inset hide-details color="secondary">
              <span slot="label" class="stat-text text--text">
                Finished
                <cc-tooltip
                  simple
                  inline
                  content="This project is complete and available to use as a <strong>reserve</strong>"
                >
                  <v-icon small>mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </span>
            </v-switch>
          </v-col>
        </v-row>
        <v-textarea
          v-model="details"
          auto-grow
          rows="2"
          label="Details"
          filled
          hide-details
          class="my-3"
        />
        <v-combobox
          v-model="costs"
          label="Requirements"
          :items="projectCosts"
          chips
          multiple
          outlined
          dense
          class="mr-5 ml-5 mt-5"
          :disabled="finished"
        ></v-combobox>
        <v-btn
          block
          tile
          large
          class="mb-2 mt-n2"
          color="primary"
          :disabled="!projectName"
          @click="add()"
        >
          <v-icon left>cci-accuracy</v-icon>Add Project
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Project } from '@/class'

export default Vue.extend({
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
      let p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: this.projectFinished ? this.projectName : 'Project (In Progress)',
        label: this.projectName,
        description: this.projectDetails,
        complicated: this.projectComplicated,
        can_finish: false,
        finished: false,
        progress: 0,
        requirements: [],
        resource_name: '',
        resource_note: '',
        resource_cost: '',
        used: false,
      })
      p.ResourceName = this.projectFinished ? '' : this.project_name
      if (this.projectCost && !this.projectFinished)
        p.ResourceCost = `Requires: ${this.projectCost.join(', ')}`
      p.IsFinished = this.projectFinished
      this.clear()
      this.$emit('add', p)
    },
    clear() {
      this.projectName = ''
      this.details = ''
      this.complicated = false
      this.finished = false
      this.costs = []
    },
  },
})
</script>