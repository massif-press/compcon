<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="'Start, run, or improve an organization, business, or other venture.'"
      />
      <v-divider class="mb-2" />
      <v-card>
        <v-tabs v-model="tabs" color="white" background-color="primary" slider-color="white" grow>
          <v-tab>Establish Organization</v-tab>
          <v-tab :disabled="!organizations.length">Improve Organization</v-tab>
          <v-tab-item>
            <v-card flat tile class="ma-3">
              <v-toolbar dark flat tile dense color="action--downtime">
                <v-toolbar-title class="heading h2">New Organization</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="4">
                    <v-select
                      v-model="type"
                      label="Organization Type"
                      :items="orgTypes"
                      outlined
                      dense
                      hide-details
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="name"
                      outlined
                      dense
                      hide-details
                      label="Organization Name"
                    />
                  </v-col>
                </v-row>
                <v-row dense justify="center">
                  <v-col cols="10">
                    <v-textarea
                      v-model="details"
                      auto-grow
                      rows="1"
                      label="Purpose, goal, and organization details"
                    />
                  </v-col>
                </v-row>
                <div class="heading h2 text-center mb-2">Start with:</div>
                <v-row dense justify="space-around">
                  <v-col cols="5">
                    <cc-tooltip
                      simple
                      inline
                      content="How directly effective your organization is at what it does (a military organization with high efficiency would be good at combat, for example). <br /> Efficiency can be used to perform activities related to your organization’s purpose (science, military, etc). You can use these advantages as <strong>reserves.</strong>"
                    >
                      <v-btn
                        v-if="!start"
                        large
                        block
                        tile
                        color="primary"
                        @click="start = 'efficiency'"
                      >
                        Efficiency
                      </v-btn>
                      <div v-else class="text-center flavor-text">
                        <span class="heading h2">+ {{ start === 'efficiency' ? '2' : '0' }}</span>
                        <br />
                        <span>Organization Efficiency</span>
                      </div>
                    </cc-tooltip>
                  </v-col>

                  <v-col cols="5">
                    <cc-tooltip
                      simple
                      inline
                      content="Influence is your organization’s size, reach, wealth, and reputation.<br>Influence be used to acquire assets, create opportunities, or sway public opinion."
                    >
                      <v-btn
                        v-if="!start"
                        large
                        block
                        tile
                        color="primary"
                        @click="start = 'influence'"
                      >
                        Influence
                      </v-btn>
                      <div v-else class="text-center flavor-text">
                        <span class="heading h2">+ {{ start === 'influence' ? '2' : '0' }}</span>
                        <br />
                        <span>Organization Influence</span>
                      </div>
                    </cc-tooltip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card-text>
              <div v-if="!selected" class="mx-3">
                <v-btn
                  v-for="o in organizations"
                  :key="o.Name"
                  tile
                  block
                  dark
                  class="my-3"
                  color="action--downtime"
                  @click="selected = o"
                >
                  {{ o.Name }}
                </v-btn>
              </div>
              <v-slide-x-transition>
                <div v-if="selected">
                  <v-btn small text @click="selected = null">
                    <v-icon left>mdi-chevron-left</v-icon>
                    Select another organization
                  </v-btn>

                  <v-card tile flat>
                    <v-toolbar dark flat dense color="action--downtime">
                      <v-toolbar-title class="heading h2">
                        {{ selected.Name }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="mx-3">
                      <v-textarea
                        v-model="selected.Description"
                        auto-grow
                        rows="1"
                        label="Purpose, goal, and organization details"
                      />
                      <v-row justify="center">
                        <v-col cols="5">
                          <v-text-field
                            v-model="improveRoll"
                            type="number"
                            label="Organization Management Roll Result"
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
                        <v-row v-if="improveRoll" dense class="text-center flavor-text">
                          <v-col v-if="improveRoll < 10">
                            <v-row dense justify="center">
                              <v-col cols="auto" class="pr-2">This organization</v-col>
                              <v-col cols="auto" class="mt-n5">
                                <v-radio-group
                                  v-model="badChoice"
                                  row
                                  dense
                                  style="display: inline-block"
                                >
                                  <v-radio label="Folds Immediately" value="fold" color="error" />
                                  <v-radio
                                    :label="`Loses Efficiency (${selected.Efficiency} available)`"
                                    :disabled="selected.Efficiency === 0"
                                    value="efficiency"
                                    color="warning"
                                  />
                                  <v-radio
                                    :label="`Loses Influence (${selected.Influence} available)`"
                                    :disabled="selected.Influence === 0"
                                    value="influence"
                                    color="warning"
                                  />
                                </v-radio-group>
                              </v-col>
                            </v-row>
                            <v-slide-x-reverse-transition>
                              <div v-show="badChoice !== '' && badChoice !== 'fold'">
                                <br />
                                <span>
                                  Additionally, the organization takes one of the following actions:
                                </span>
                                <v-btn-toggle v-model="action" mandatory>
                                  <v-btn text large value="Pay Debts">Pay Debts</v-btn>
                                  <v-btn text large value="Prove Worthiness">
                                    Prove Worthiness
                                  </v-btn>
                                  <v-btn text large value="Get Bailed Out">
                                    Get Bailed Out
                                  </v-btn>
                                  <v-btn text large value="Make an Aggressive Move">
                                    Make an Aggressive Move
                                  </v-btn>
                                </v-btn-toggle>
                              </div>
                            </v-slide-x-reverse-transition>
                          </v-col>
                          <v-col v-else-if="improveRoll <= 20" cols="12">
                            <v-row
                              v-if="
                                parseInt(selected.Influence) === 6 &&
                                  parseInt(selected.Efficiency) === 6
                              "
                              row
                              wrap
                            >
                              <v-col class="text-center">
                                <span class="heading h3 subtle--text">
                                  Organization is operating at maximum capacity
                                </span>
                              </v-col>
                            </v-row>
                            <v-row v-else>
                              <v-col cols="12" class="text-center">
                                <span class="heading h3">Improve:</span>
                              </v-col>
                              <v-col cols="5">
                                <v-tooltip top>
                                  <div slot="activator">
                                    <v-btn
                                      large
                                      block
                                      color="primary"
                                      :disabled="
                                        selected.Efficiency === 6 || improvement === 'efficiency'
                                      "
                                      @click="improvement = 'efficiency'"
                                    >
                                      Efficiency
                                    </v-btn>
                                    <div>
                                      <span class="heading h3">
                                        +
                                        {{
                                          selected.Efficiency +
                                            (improvement === 'efficiency' ? 2 : 0)
                                        }}
                                        Efficiency
                                      </span>
                                      <br />
                                      <span>Organization Efficiency</span>
                                    </div>
                                  </div>
                                  <span>
                                    How directly effective your organization is at what it does (a
                                    military organization with high efficiency would be good at
                                    combat, for example).
                                    <br />
                                    Efficiency can be used to perform activities related to your
                                    organization’s purpose (science, military, etc). You can use
                                    these advantages as
                                    <strong>reserves.</strong>
                                  </span>
                                </v-tooltip>
                              </v-col>
                              <v-spacer />
                              <v-col cols="5">
                                <v-tooltip top>
                                  <div slot="activator">
                                    <v-btn
                                      large
                                      block
                                      color="primary"
                                      :disabled="
                                        selected.Influence === 6 || improvement === 'influence'
                                      "
                                      @click="improvement = 'influence'"
                                    >
                                      Influence
                                    </v-btn>
                                    <div>
                                      <span class="heading h3">
                                        +
                                        {{
                                          selected.Influence + (improvement === 'influence' ? 2 : 0)
                                        }}
                                        Influence
                                      </span>
                                      <br />
                                      <span>Organization Influence</span>
                                    </div>
                                  </div>
                                  <span>
                                    Influence is your organization’s size, reach, wealth, and
                                    reputation. Influence be used to acquire assets, create
                                    opportunities, or sway public opinion.
                                  </span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-else cols="12">
                            <span
                              v-if="
                                parseInt(selected.Influence) < 6 &&
                                  parseInt(selected.Efficiency) < 6
                              "
                              class="heading h3 accent--text"
                            >
                              Organization Influence and Efficiency increased by +2
                            </span>
                            <span
                              v-else-if="parseInt(selected.Influence) < 6"
                              class="heading h3 accent--text"
                            >
                              Organization Influence increased by +2
                            </span>
                            <span
                              v-else-if="parseInt(selected.Efficiency) < 6"
                              class="heading h3 accent--text"
                            >
                              Organization Efficiency increased by +2
                            </span>
                            <span v-else class="heading h3 subtle--text">
                              Organization is operating at maximum capacity
                            </span>
                          </v-col>
                        </v-row>
                      </v-slide-y-transition>
                    </v-card-text>
                  </v-card>
                </div>
              </v-slide-x-transition>
            </v-card-text>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        tile
        :color="badChoice === 'fold' ? 'error' : 'primary'"
        :disabled="confirmDisabled"
        @click="tabs === 0 ? addOrg() : improveOrg()"
      >
        {{ confirmName() }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrgType, Organization } from '@/class'
export default Vue.extend({
  name: 'get-organized',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tabs: 0,
    type: '',
    name: '',
    details: '',
    start: '',
    selected: null,
    improveRoll: '',
    badChoice: '',
    action: '',
    improvement: '',
  }),
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map(k => OrgType[k])
        .sort() as OrgType[]
    },
    organizations() {
      return this.pilot.Organizations
    },
    confirmDisabled() {
      if (this.tabs === 0) return !this.name || !this.type || !this.start
      if (this.tabs === 1) {
        if (parseInt(this.improveRoll) < 10) {
          return !(this.badChoice === 'fold' || (this.badChoice && this.action))
        } else if (parseInt(this.improveRoll) < 20) {
          if (this.selected.Efficiency === 6 && this.selected.Influence === 6) return false
          else return
          !this.improvement
        } else {
          return false
        }
      }
      return false
    },
  },
  methods: {
    confirmName() {
      if (this.tabs === 0) return 'Establish Organization'
      if (this.tabs === 1) {
        if (this.badChoice === 'fold') return 'Shutter Organization'
        else return 'Update Organization'
      }
    },
    addOrg() {
      this.pilot.Organizations.push(
        new Organization({
          name: this.name,
          purpose: this.purpose,
          efficiency: this.start === 'efficiency' ? 2 : 0,
          influence: this.start === 'influence' ? 2 : 0,
          description: this.details,
          actions: '',
        })
      )
      this.close()
    },
    improveOrg() {
      if (parseInt(this.improveRoll) < 10) {
        if (this.badChoice === 'fold') {
          this.pilot.Organizations.splice(
            this.pilot.Organizations.findIndex(x => x.Name === this.selected.Name),
            1
          )
        } else if (this.badChoice === 'efficiency') {
          this.selected.Efficiency -= 2
          this.selected.Actions = this.action
        } else if (this.badChoice === 'influence') {
          this.selected.Influence -= 2
          this.selected.Actions = this.action
        }
      } else if (parseInt(this.improveRoll) < 20) {
        if (this.improvement === 'efficiency') {
          this.selected.Efficiency += 2
        } else if (this.improvement === 'influence') {
          this.selected.Influence += 2
        }
      } else {
        this.selected.Efficiency += 2
        this.selected.Influence += 2
      }

      this.close()
    },
    close() {
      this.tabs = 0
      this.type = ''
      this.name = ''
      this.details = ''
      this.start = ''
      this.selected = null
      this.improveRoll = ''
      this.badChoice = ''
      this.action = ''
      this.improvement = ''
      this.$emit('close')
    },
  },
})
</script>
