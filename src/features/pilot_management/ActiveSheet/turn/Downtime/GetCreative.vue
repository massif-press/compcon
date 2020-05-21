<template>
  <v-card-text>
    <p
      class="text-center flavor-text pt-2"
      v-html="
        'You tweak something or attempt to make something new, either a physical project, or a piece of software. It doesn’t have to be something on the a gear list, but it generally can’t be something as impactful as a piece of mech gear. Once finished, you can use it as <strong>reserves.</strong>'
      "
    />
    <v-divider class="mb-3" />
    <v-card>
      <v-tabs v-model="tabs" color="white" background-color="primary" slider-color="white" grow>
        <v-tab>Start New Project</v-tab>
        <v-tab :disabled="!projects.length">Continue Project</v-tab>
        <v-tab-item>
          <v-card flat tile class="ma-3">
            <v-toolbar dark flat tile dense color="action--downtime">
              <v-toolbar-title class="heading h2">New Project</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="7">
                  <v-text-field v-model="project_name" outlined dense label="Project Name" />
                </v-col>
                <v-col cols="auto" class="ml-auto mt-n4 mr-3">
                  <cc-tooltip
                    simple
                    inline
                    content="This project is complex, resource-intensive, or generally difficult to complete"
                  >
                    <v-switch v-model="complicated" dense inset label="Complicated" />
                  </cc-tooltip>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="mx-6">
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" filled />
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="4">
                  <v-text-field
                    v-model="initialRoll"
                    type="number"
                    label="Initial Roll Result"
                    outlined
                    dense
                    append-outer-icon="mdi-plus-circle-outline"
                    prepend-icon="mdi-minus-circle-outline"
                    hide-details
                    @click:append-outer="initialRoll++"
                    @click:prepend="initialRoll > 1 ? initialRoll-- : ''"
                  />
                </v-col>
              </v-row>
              <v-slide-y-transition>
                <v-row v-show="initialRoll" justify="center" class="text-center flavor-text">
                  <v-col cols="10">
                    <p
                      v-if="initialRoll < 10"
                      class="font-weight-bold px-3"
                      v-html="'You don’t make any progress on this project for now'"
                    />

                    <p v-else-if="initialRoll < 20" class="font-weight-bold px-3">
                      You can make progress on your project, but can’t finish it. You can finish it
                      next time you have downtime without a roll if you get some things before then:
                      <v-combobox
                        v-model="cost"
                        class="mr-5 ml-5"
                        :items="costs"
                        chips
                        multiple
                        label="Add at least two requirements:"
                        :error="cost.length < 2"
                      />
                    </p>
                    <p v-else class="font-weight-bold px-3">
                      {{
                        complicated
                          ? 'You can make progress on your project, but can’t finish it. You can finish it next time you have downtime without a roll if you get some things before then:'
                          : 'Project Complete'
                      }}
                      <v-combobox
                        v-if="complicated"
                        v-model="cost"
                        class="mr-5 ml-5"
                        :items="costs"
                        chips
                        multiple
                        label="Add at least one requirement:"
                        :error="!cost.length"
                      />
                    </p>
                  </v-col>
                </v-row>
              </v-slide-y-transition>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card-text v-if="!improveSelection">
            <div class="mx-3">
              <v-btn
                v-for="(p, i) in projects"
                :key="p.ResourceName + i"
                tile
                block
                dark
                class="my-3"
                color="action--downtime"
                @click="improveSelection = p"
              >
                {{ p.ResourceName }}
              </v-btn>
            </div>
          </v-card-text>
          <v-slide-x-transition>
            <div v-if="improveSelection">
              <v-btn small text @click="improveSelection = null">
                <v-icon left>mdi-chevron-left</v-icon>
                Select another project
              </v-btn>
              <div class="text-center heading h2">
                Working on {{ improveSelection.ResourceName }}
              </div>
              <v-row dense justify="center">
                <v-col cols="8">
                  <v-alert
                    v-if="improveSelection.ResourceCost"
                    color="primary"
                    dense
                    outlined
                    border="left"
                    class="mt-2"
                  >
                    <b class="heading h2">COMPLETE IMMEDIATELY</b>
                    <br />
                    <p class="pt-2 pb-0 mb-0">{{ improveSelection.ResourceCost }}</p>
                    <div class="text-right">
                      <v-btn tile color="success" @click="completeProject()">
                        Complete
                      </v-btn>
                    </div>
                  </v-alert>
                </v-col>
              </v-row>
              <div v-if="improveSelection.ResourceCost" class="text-center heading h2 accent--text">
                OR
              </div>
              <v-row justify="center">
                <v-col cols="3">
                  <v-text-field
                    v-model="improveRoll"
                    type="number"
                    label="Progress Roll Result"
                    outlined
                    dense
                    hide-details
                    append-outer-icon="mdi-plus-circle-outline"
                    prepend-icon="mdi-minus-circle-outline"
                    @click:append-outer="improveRoll++"
                    @click:prepend="improveRoll > 1 ? improveRoll-- : ''"
                  />
                </v-col>
              </v-row>
              <v-slide-y-transition>
                <v-row v-show="improveRoll" justify="center" class="text-center flavor-text">
                  <v-col cols="10">
                    <p
                      v-if="improveRoll < 10"
                      class="font-weight-bold px-3"
                      v-html="'You don’t make any progress on this project for now'"
                    />

                    <p v-else-if="improveRoll < 20" class="font-weight-bold px-3">
                      You can make progress on your project, but can’t finish it. You can finish it
                      next time you have downtime without a roll if you get some things before then:
                      <v-combobox
                        v-model="cost"
                        class="mr-5 ml-5"
                        :items="costs"
                        chips
                        multiple
                        label="Add at least two requirements:"
                        :error="cost.length < 2"
                      />
                    </p>
                    <p v-else class="font-weight-bold px-3">
                      {{
                        complicated
                          ? 'You can make progress on your project, but can’t finish it. You can finish it next time you have downtime without a roll if you get some things before then:'
                          : 'Project Complete'
                      }}
                      <v-combobox
                        v-if="complicated"
                        v-model="cost"
                        class="mr-5 ml-5"
                        :items="costs"
                        chips
                        multiple
                        label="Add at least one requirement:"
                        :error="!cost.length"
                      />
                    </p>
                  </v-col>
                </v-row>
              </v-slide-y-transition>
            </div>
          </v-slide-x-transition>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        v-if="tabs === 0"
        large
        tile
        color="primary"
        :disabled="!initialRoll || !project_name"
        @click="addProject()"
      >
        Add Project
      </v-btn>
      <v-btn
        v-else
        large
        tile
        color="primary"
        :disabled="!improveRoll"
        @click="
          !improveSelection.IsComplicated && improveRoll >= 20
            ? completeProject()
            : improveProject()
        "
      >
        {{
          !improveSelection.IsComplicated && improveRoll >= 20
            ? 'Complete Project'
            : 'Update Project'
        }}
      </v-btn>
    </v-card-actions>
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
import { Project } from '@/class'
export default Vue.extend({
  name: 'get-creative',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tabs: 0,
    project_name: '',
    details: '',
    complicated: false,
    initialRoll: '',
    improveRoll: '',
    improve: '',
    cost: '',
    improveSelection: null,
    costs: [
      ' Quality materials',
      ' Specific knowledge or techniques',
      ' Specialized tools',
      ' A good workspace',
    ],
  }),
  computed: {
    projects() {
      return this.pilot.Reserves.filter(x => x.Type === 'Project' && !x.IsFinished)
    },
  },
  methods: {
    addProject() {
      const p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: 'Project (In Progress)',
        label: this.project_name,
        description: this.details,
        complicated: this.complicated,
        resource_name: this.project_name,
        resource_note: '',
        resource_cost: '',
        used: false,
        can_finish: false,
        finished: false,
        progress: this.initialRoll < 10 || this.improveRoll < 10 ? 1 : 0,
        requirements: [],
      })
      if (this.cost) p.ResourceCost = `Requires: ${this.cost.toString()}`
      this.pilot.Reserves.push(p)
      this.close()
    },
    improveProject() {
      if (this.cost) this.improveSelection.ResourceCost = `Requires: ${this.cost.toString()}`
      if (this.initialRoll < 10) this.improveSelection.Progress = 1
      this.close()
    },
    completeProject() {
      this.improveSelection.Name = this.improveSelection.ResourceLabel
      this.improveSelection.ResourceName = ''
      this.improveSelection.ResourceCost = ''
      this.improveSelection.IsFinished = true
      this.close()
    },
    close() {
      this.tabs = 0
      this.project_name = ''
      this.details = ''
      this.complicated = false
      this.initialRoll = ''
      this.improveRoll = ''
      this.improve = ''
      this.cost = ''
      this.improveSelection = null
      this.$emit('close')
    },
  },
})
</script>
