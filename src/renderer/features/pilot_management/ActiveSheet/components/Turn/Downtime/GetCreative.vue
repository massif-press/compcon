<template>
  <div>
    <v-card-text>
      <v-layout row wrap class="text-xs-center">
        <v-flex xs12 class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            You tweak something or attempt to make something new, either a physical project, or a piece of software. It doesn’t have to be something on the a gear list, but it generally can’t be something as impactful as a piece of mech gear. Once finished, you can use it as
            <strong>reserves.</strong>
          </p>
          <v-divider class="ma-2" />
          <v-card>
            <v-tabs v-model="tabs" dark color="primary" slider-color="yellow" grow>
              <v-tab>Start New Project</v-tab>
              <v-tab :disabled="!projects.length">Continue Project</v-tab>
              <v-tab-item>
                <v-card-text>
                  <v-card class="ma-2">
                    <v-toolbar dark flat dense color="deep-purple">
                      <v-toolbar-title class="minor-title">New Project</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="effect-text pa-2">
                      <v-layout row wrap>
                        <v-flex xs7>
                          <v-text-field v-model="project_name" label="Project Name" />
                        </v-flex>
                        <v-spacer />
                        <v-flex xs3>
                          <v-tooltip top>
                            <v-switch slot="activator" v-model="complicated" label="Complicated" />
                            <span>This project is complex, resource-intensive, or generally difficult to complete</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12>
                          <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs12>
                          <div style="margin-left: 35%; margin-right: 35%">
                            <v-text-field
                              v-model="initialRoll"
                              type="number"
                              label="Initial Roll Result"
                              outline
                              append-outer-icon="add"
                              @click:append-outer="initialRoll++"
                              prepend-icon="remove"
                              @click:prepend="initialRoll > 1 ? initialRoll-- : ''"
                              hide-details
                            ></v-text-field>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-slide-y-transition>
                        <v-layout v-show="initialRoll" row wrap class="text-xs-center">
                          <v-flex xs12 v-if="initialRoll < 10">
                            <p
                              class="pt-2 pb-0 ma-0 effect-text"
                            >You don’t make any progress on this project for now</p>
                          </v-flex>
                          <v-flex xs12 v-else-if="initialRoll < 20">
                            <p
                              class="pt-2 pb-0 ma-0 effect-text"
                            >You can make progress on your project, but can’t finish it. You can finish it next time you have downtime without a roll if you get some things before then:</p>
                            <v-combobox
                              class="mr-5 ml-5"
                              v-model="cost"
                              :items="costs"
                              chips
                              multiple
                              label="Add at least two requirements:"
                              :error="cost.length < 2"
                            ></v-combobox>
                          </v-flex>
                          <v-flex xs12 v-else>
                            <div v-if="!complicated">
                              <p class="pt-2 pb-0 ma-0 minor-title">Project Complete</p>
                            </div>
                            <div v-else>
                              <p
                                class="pt-2 pb-0 ma-0 effect-text"
                              >You can make progress on your project, but can’t finish it. You can finish it next time you have downtime without a roll if you get some things before then:</p>
                              <v-combobox
                                class="mr-5 ml-5"
                                v-model="cost"
                                :items="costs"
                                chips
                                multiple
                                label="Add at least one requirement:"
                                :error="!cost.length"
                              ></v-combobox>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-slide-y-transition>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <div v-if="!improveSelection" class="ml-5 mr-5">
                    <v-btn
                      block
                      large
                      color="primary"
                      v-for="(p, i) in projects"
                      :key="p.ResourceName + i"
                      @click="improveSelection = p"
                    >{{p.ResourceName}}</v-btn>
                  </div>
                  <v-slide-x-transition>
                    <div v-show="improveSelection">
                      <div v-if="improveSelection">
                        <v-layout row wrap>
                          <v-flex xs12 class="text-xs-left">
                            <v-btn
                              small
                              outline
                              @click="improveSelection = null"
                            >Select another project</v-btn>
                          </v-flex>
                          <v-flex
                            xs12
                            class="text-xs-center minor-title"
                          >Working on {{improveSelection.ResourceName}}</v-flex>
                          <v-flex xs12>
                            <v-alert
                              :value="improveSelection.ResourceCost"
                              color="primary"
                              class="text-xs-left"
                              outline
                            >
                              <v-layout row>
                                <v-flex>
                                  <b class="minor-title">COMPLETE IMMEDIATELY</b>
                                  <br />
                                  <p class="pt-2">{{improveSelection.ResourceCost}}</p>
                                  <v-spacer />
                                </v-flex>
                                <v-flex shrink>
                                  <v-btn
                                    class="mt-3"
                                    color="success"
                                    @click="completeProject()"
                                  >Complete</v-btn>
                                </v-flex>
                              </v-layout>
                            </v-alert>
                            <p v-if="improveSelection.ResourceCost" class="fluff-text">OR</p>
                            <div style="margin-left: 35%; margin-right: 35%">
                              <v-text-field
                                v-model="improveRoll"
                                type="number"
                                label="Progress Roll Result"
                                outline
                                append-outer-icon="add"
                                @click:append-outer="improveRoll++"
                                prepend-icon="remove"
                                @click:prepend="improveRoll > 1 ? improveRoll-- : ''"
                              ></v-text-field>
                            </div>
                          </v-flex>
                        </v-layout>
                        <v-slide-y-transition>
                          <v-layout v-show="improveRoll" row wrap class="text-xs-center">
                            <v-flex xs12 v-if="improveRoll < 10 && !improveSelection.Progress">
                              <p
                                class="pt-2 pb-0 ma-0 effect-text"
                              >You don’t make any progress on this project for now</p>
                            </v-flex>
                            <v-flex xs12 v-else-if="improveRoll < 20">
                              <p
                                class="pt-2 pb-0 ma-0 effect-text"
                              >You can make progress on your project, but can’t finish it. You can finish it next time you have downtime without a roll if you get some things before then:</p>
                              <v-combobox
                                class="mr-5 ml-5"
                                v-model="cost"
                                :items="costs"
                                chips
                                multiple
                                label="Add at least two requirements:"
                                :error="cost.length < 2"
                              ></v-combobox>
                            </v-flex>
                            <v-flex xs12 v-else>
                              <div v-if="!improveSelection.complicated">
                                <p class="pt-2 pb-0 ma-0 minor-title">Project Complete</p>
                              </div>
                              <div v-else>
                                <p
                                  class="pt-2 pb-0 ma-0 effect-text"
                                >You can make progress on your project, but can’t finish it. You can finish it next time you have downtime without a roll if you get some things before then:</p>
                                <v-combobox
                                  class="mr-5 ml-5"
                                  v-model="cost"
                                  :items="costs"
                                  chips
                                  multiple
                                  label="Add at least one requirement:"
                                  :error="!cost.length"
                                ></v-combobox>
                              </div>
                            </v-flex>
                          </v-layout>
                        </v-slide-y-transition>
                      </div>
                    </div>
                  </v-slide-x-transition>
                </v-card-text>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn flat @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        v-if="tabs === 0"
        large
        color="primary"
        :disabled="(!initialRoll || !project_name)"
        @click="addProject()"
      >Add Project</v-btn>
      <v-btn
        v-else
        large
        color="primary"
        @click="!improveSelection.IsComplicated && improveRoll >= 20 ? completeProject() : improveProject()"
        :disabled="(!improveRoll)"
      >{{!improveSelection.IsComplicated && improveRoll >= 20 ? 'Complete Project': 'Update Project'}}</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Project } from '@/class'
export default Vue.extend({
  name: 'get-creative',
  props: {
    pilot: Object,
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
      let p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: 'Project (In Progress)',
        label: this.project_name,
        description: this.details,
        complicated: this.complicated,
      })
      p.ResourceName = this.project_name
      if (this.cost) p.ResourceCost = `Requires: ${this.cost.toString()}`
      p.IsFinished = false
      p.Progress = this.initialRoll < 10 || this.improveRoll < 10 ? 1 : 0
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
