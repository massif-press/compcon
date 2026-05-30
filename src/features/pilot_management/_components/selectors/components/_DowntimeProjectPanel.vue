<template>
  <v-row justify="center"
    align="center">
    <v-col>
      <cc-titled-panel title="New Project"
        icon="mdi-atom-variant"
        color="reserve">
        <v-row density="compact">
          <v-col cols="12"
            md="">
            <v-text-field v-model="projectName"
              color="accent"
              label="Project Name"
              variant="outlined"
              hide-details />
          </v-col>
          <v-col cols="12"
            md="auto">
            <v-row class="stat-text text-text">
              <v-col cols="auto"
                class="text-center">
                <cc-switch v-model="complicated"
                  density="compact"
                  inset
                  hide-details
                  color="secondary"
                  tooltip="This project is complex, resource-intensive, or generally difficult to complete"
                  top-label="Complicated"
                  class="mr-3" />
              </v-col>
              <v-col cols="auto"
                class="text-center">
                <cc-switch v-model="finished"
                  density="compact"
                  inset
                  hide-details
                  top-label="Finished"
                  tooltip="This project is complete and available to use as a reserve"
                  color="secondary" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-textarea v-model="details"
          auto-grow
          rows="2"
          label="Details"
          filled
          hide-details
          color="accent"
          class="my-3" />
        <v-combobox v-model="costs"
          label="Requirements"
          :items="projectCosts"
          chips
          multiple
          variant="outlined"
          color="accent"
          density="compact"
          class="mr-5 ml-5 mt-5"
          :disabled="finished"></v-combobox>
        <v-btn block
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

<script setup lang="ts">
import { ref } from 'vue'
import Project from '@/classes/pilot/components/reserves/Project';

defineOptions({ name: 'CustomReservePanel' })

const emit = defineEmits<{
  'add': []
}>()

const projectName = ref('')
const details = ref('')
const complicated = ref(false)
const finished = ref(false)
const costs = ref([])
const projectCosts = ref([
      'Quality materials',
      'Specific knowledge or techniques',
      'Specialized tools',
      'A good workspace',
    ])

function add() {
      const p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: `${projectName.value} ${finished.value ? '' : ' (In Progress)'}`,
        label: 'Project',
        description: '',
        complicated: complicated.value,
        can_finish: false,
        finished: false,
        progress: 0,
        requirements: [],
        resource_name: projectName.value,
        resource_note: details.value,
        resource_cost: '',
        used: false,
        consumable: false,
      });
      if (costs.value && !finished.value) p.ResourceCost = `Requires: ${costs.value.join(', ')}`;
      p.IsFinished = finished.value;
      clear();
      emit('add', p);
    }
function clear() {
      projectName.value = '';
      details.value = '';
      complicated.value = false;
      finished.value = false;
      costs.value = [];
    }
</script>
