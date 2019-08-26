<template>
  <div>
    <v-card-text>
      <v-layout wrap class="text-center">
        <v-flex xs12 class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            Start, run, or improve an organization, business, or other venture.
          </p>
          <v-divider class="ma-2" />
          <v-card>
            <v-tabs v-model="tabs" dark color="primary" slider-color="yellow" grow>
              <v-tab>Establish Organization</v-tab>
              <v-tab :disabled="!organizations.length">Improve Organization</v-tab>
              <v-tab-item>
                <v-card-text>
                  <v-card class="ma-2">
                    <v-toolbar dark flat dense color="deep-purple">
                      <v-toolbar-title class="minor-title">New Organization</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="effect-text pa-2 ma-0">
                      <v-select
                        v-model="type"
                        label="Organization Type"
                        :items="orgTypes"
                        outline
                        hide-details
                      />
                      <v-text-field v-model="name" label="Organization Name" />
                      <v-textarea
                        v-model="details"
                        auto-grow
                        rows="1"
                        label="Purpose, goal, and orginaztion details"
                        box
                      />
                      <v-layout wrap>
                        <v-flex xs12 class="text-center">
                          <span class="minor-title">Start with:</span>
                        </v-flex>
                        <v-flex xs5>
                          <v-tooltip top>
                            <div slot="activator">
                              <v-btn
                                v-if="!start"
                                large
                                block
                                color="primary"
                                @click="start = 'efficiency'"
                              >
                                Efficiency
                              </v-btn>
                              <div v-else>
                                <span class="major-title">
                                  + {{ start === 'efficiency' ? '2' : '0' }}
                                </span>
                                <br />
                                <span>Organization Efficiency</span>
                              </div>
                            </div>
                            <span>
                              How directly effective your organization is at what it does (a
                              military organization with high efficiency would be good at combat,
                              for example).
                              <br />
                              Efficiency can be used to perform activities related to your
                              organization’s purpose (science, military, etc). You can use these
                              advantages as
                              <strong>reserves.</strong>
                            </span>
                          </v-tooltip>
                        </v-flex>
                        <v-spacer />
                        <v-flex xs5>
                          <v-tooltip top>
                            <div slot="activator">
                              <v-btn
                                v-if="!start"
                                large
                                block
                                color="primary"
                                @click="start = 'influence'"
                              >
                                Influence
                              </v-btn>
                              <div v-else>
                                <span class="major-title">
                                  + {{ start === 'influence' ? '2' : '0' }}
                                </span>
                                <br />
                                <span>Organization Influence</span>
                              </div>
                            </div>
                            <span>
                              Influence is your organization’s size, reach, wealth, and reputation.
                              Influence be used to acquire assets, create opportunities, or sway
                              public opinion.
                            </span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <div v-if="!selected" class="ml-5 mr-5">
                    <v-btn
                      block
                      large
                      color="primary"
                      v-for="o in organizations"
                      :key="o.Name"
                      @click="selected = o"
                    >
                      {{ o.Name }}
                    </v-btn>
                  </div>
                  <v-slide-x-transition>
                    <div v-show="selected">
                      <div v-if="selected">
                        <v-layout wrap>
                          <v-flex xs12 class="text-xs-left">
                            <v-btn small outline @click="selected = null">
                              Select another organization
                            </v-btn>
                          </v-flex>
                          <v-flex xs12>
                            <v-card class="ma-2">
                              <v-toolbar dark flat dense color="deep-purple">
                                <v-toolbar-title class="minor-title">
                                  {{ selected.Name }} ({{ selected.Purpose }})
                                </v-toolbar-title>
                              </v-toolbar>
                              <v-card-text class="effect-text pa-2 ma-0">
                                <v-textarea
                                  v-model="selected.Description"
                                  auto-grow
                                  rows="1"
                                  label="Purpose, goal, and orginaztion details"
                                  box
                                />
                                <div style="margin-left: 30%; margin-right: 30%">
                                  <v-text-field
                                    v-model="improveRoll"
                                    type="number"
                                    label="Organization Management Roll Result"
                                    outline
                                    append-outer-icon="add"
                                    @click:append-outer="improveRoll++"
                                    prepend-icon="remove"
                                    @click:prepend="improveRoll > 1 ? improveRoll-- : ''"
                                  ></v-text-field>
                                </div>
                                <v-slide-y-transition>
                                  <v-layout v-show="improveRoll" wrap class="text-center">
                                    <v-flex xs12 v-if="improveRoll < 10">
                                      <span>
                                        <i>This organization</i>
                                        &emsp;
                                        <v-radio-group
                                          row
                                          v-model="badChoice"
                                          style="display: inline-block"
                                        >
                                          <v-radio
                                            label="Folds Immediately"
                                            value="fold"
                                            color="red darken-2"
                                          ></v-radio>
                                          <v-radio
                                            :label="
                                              `Loses Efficiency (${selected.Efficiency} available)`
                                            "
                                            :disabled="selected.Efficiency === 0"
                                            value="efficiency"
                                          ></v-radio>
                                          <v-radio
                                            :label="
                                              `Loses Influence (${selected.Influence} available)`
                                            "
                                            :disabled="selected.Influence === 0"
                                            value="influence"
                                          ></v-radio>
                                        </v-radio-group>
                                      </span>
                                      <v-slide-x-reverse-transition>
                                        <div v-show="badChoice !== '' && badChoice !== 'fold'">
                                          <br />
                                          <span>
                                            Additionally, the organization takes one of the
                                            following actions:
                                          </span>
                                          <v-btn-toggle v-model="action" mandatory>
                                            <v-btn flat large value="Pay Debts">Pay Debts</v-btn>
                                            <v-btn flat large value="Prove Worthiness">
                                              Prove Worthiness
                                            </v-btn>
                                            <v-btn flat large value="Get Bailed Out">
                                              Get Bailed Out
                                            </v-btn>
                                            <v-btn flat large value="Make an Aggressive Move">
                                              Make an Aggressive Move
                                            </v-btn>
                                          </v-btn-toggle>
                                        </div>
                                      </v-slide-x-reverse-transition>
                                    </v-flex>
                                    <v-flex xs12 v-else-if="improveRoll < 20">
                                      <v-layout
                                        v-if="
                                          parseInt(selected.influence) === 6 &&
                                            parseInt(selected.efficiency) === 6
                                        "
                                        row
                                        wrap
                                      >
                                        <v-flex class="text-center">
                                          <span class="minor-title grey--text">
                                            Organization is operating at maximum capacity
                                          </span>
                                        </v-flex>
                                      </v-layout>
                                      <v-layout v-elsewrap>
                                        <v-flex xs12 class="text-center">
                                          <span class="minor-title">Improve:</span>
                                        </v-flex>
                                        <v-flex xs5>
                                          <v-tooltip top>
                                            <div slot="activator">
                                              <v-btn
                                                large
                                                block
                                                color="primary"
                                                :disabled="
                                                  selected.efficiency === 6 ||
                                                    improvement === 'efficiency'
                                                "
                                                @click="improvement = 'efficiency'"
                                              >
                                                Efficiency
                                              </v-btn>
                                              <div>
                                                <span class="minor-title">
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
                                              How directly effective your organization is at what it
                                              does (a military organization with high efficiency
                                              would be good at combat, for example).
                                              <br />
                                              Efficiency can be used to perform activities related
                                              to your organization’s purpose (science, military,
                                              etc). You can use these advantages as
                                              <strong>reserves.</strong>
                                            </span>
                                          </v-tooltip>
                                        </v-flex>
                                        <v-spacer />
                                        <v-flex xs5>
                                          <v-tooltip top>
                                            <div slot="activator">
                                              <v-btn
                                                large
                                                block
                                                color="primary"
                                                :disabled="
                                                  selected.influence === 6 ||
                                                    improvement === 'influence'
                                                "
                                                @click="improvement = 'influence'"
                                              >
                                                Influence
                                              </v-btn>
                                              <div>
                                                <span class="minor-title">
                                                  +
                                                  {{
                                                    selected.Influence +
                                                      (improvement === 'influence' ? 2 : 0)
                                                  }}
                                                  Influence
                                                </span>
                                                <br />
                                                <span>Organization Influence</span>
                                              </div>
                                            </div>
                                            <span>
                                              Influence is your organization’s size, reach, wealth,
                                              and reputation. Influence be used to acquire assets,
                                              create opportunities, or sway public opinion.
                                            </span>
                                          </v-tooltip>
                                        </v-flex>
                                      </v-layout>
                                    </v-flex>
                                    <v-flex xs12 v-else>
                                      <span
                                        v-if="
                                          parseInt(selected.influence) < 6 &&
                                            parseInt(selected.efficiency) < 6
                                        "
                                        class="minor-title primary--text"
                                      >
                                        Organization Influence and Efficiency increased by +2
                                      </span>
                                      <span
                                        v-else-if="parseInt(selected.influence) < 6"
                                        class="minor-title primary--text"
                                      >
                                        Organization Influence increased by +2
                                      </span>
                                      <span
                                        v-else-if="parseInt(selected.efficiency) < 6"
                                        class="minor-title primary--text"
                                      >
                                        Organization Efficiency increased by +2
                                      </span>
                                      <span v-else class="minor-title grey--text">
                                        Organization is operating at maximum capacity
                                      </span>
                                    </v-flex>
                                  </v-layout>
                                </v-slide-y-transition>
                              </v-card-text>
                            </v-card>
                          </v-flex>
                        </v-layout>
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
        large
        :color="this.badChoice === 'fold' ? 'error' : 'primary'"
        @click="tabs === 0 ? addOrg() : improveOrg()"
        :disabled="confirmDisabled"
      >
        {{ confirmName() }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve, CustomSkill, OrgType, Organization } from '@/class'
export default Vue.extend({
  name: 'get-organized',
  props: {
    pilot: Object,
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
        .map(k => OrgType[k as any])
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
        new Organization(
          this.name,
          this.type,
          this.start === 'efficiency' ? 2 : 0,
          this.start === 'influence' ? 2 : 0,
          this.details,
          (this.actions = '')
        )
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
