<template>
  <v-container fluid style="background-color: white">
    <v-tabs dark color="primary" grow slider-color="yellow">
      <v-tab>
        <span class="minor-title">Narrative Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Tactical Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Mech Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Custom Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Project</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Organization</span>
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs3 v-for="r in reserves['Narrative']" :key="r.ID">
                <reserve-item :reserve="r" color="teal darken-3" @click="add(r)" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs3 v-for="r in reserves['Tactical']" :key="r.ID">
                <reserve-item :reserve="r" color="lime darken-4" @click="add(r)" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs3 v-for="r in reserves['Mech']" :key="r.ID">
                <reserve-item :reserve="r" color="deep-orange darken-3" @click="add(r)" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row justify-center>
              <v-flex xs6>
                <v-card class="ma-2">
                  <v-toolbar dark flat dense color="deep-purple">
                    <v-toolbar-title class="minor-title">New Custom Reserve</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text class="effect-text pa-2 ma-0">
                    <v-select
                      v-model="custom_type"
                      label="Reserve Type"
                      :items="['Narrative', 'Mech', 'Tactical']"
                      outline
                      hide-details
                    />
                    <v-text-field v-model="custom_name" label="Resource Name" />
                    <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
                    <v-btn
                      block
                      outline
                      style="bottom: 10px; width:95%"
                      color="primary"
                      @click="addCustom"
                      :disabled="!custom_type || !custom_name"
                    >
                      <v-icon left>add</v-icon>Add Reserve
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row justify-center>
              <v-flex xs8>
                <v-card class="ma-2">
                  <v-toolbar dark flat dense color="deep-purple">
                    <v-toolbar-title class="minor-title">New Downtime Project</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text class="effect-text pa-2 ma-0">
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field v-model="projectName" label="Project Name" />
                      </v-flex>
                      <v-flex xs2 class="ml-4">
                        <v-tooltip top>
                          <v-switch
                            slot="activator"
                            v-model="projectComplicated"
                            label="Complicated"
                          />
                          <span>This project is complex, resource-intensive, or generally difficult to complete</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs2>
                        <v-tooltip top>
                          <v-switch slot="activator" v-model="projectFinished" label="Finished" />
                          <span>
                            This project is complete and available to use as a
                            <strong>reserve</strong>
                          </span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12>
                        <v-textarea
                          v-model="projectDetails"
                          auto-grow
                          rows="1"
                          label="Details"
                          box
                        />
                      </v-flex>
                      <v-flex xs12>
                        <v-combobox
                          class="mr-5 ml-5"
                          v-model="projectCost"
                          :items="projectCosts"
                          chips
                          multiple
                          :disabled="projectFinished"
                          label="Add requirements (optional)"
                        ></v-combobox>
                      </v-flex>
                    </v-layout>
                    <v-btn
                      block
                      outline
                      style="bottom: 10px; width:95%"
                      color="deep-purple"
                      @click="addProject"
                      :disabled="!projectName"
                    >
                      <v-icon left>add</v-icon>Add Project
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-card class="ma-2">
              <v-toolbar dark flat dense color="deep-purple">
                <v-toolbar-title class="minor-title">New Organization</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="effect-text pa-2 ma-0">
                <v-select
                  v-model="orgType"
                  label="Organization Type"
                  :items="orgTypes"
                  outline
                  hide-details
                />
                <v-text-field v-model="orgName" label="Organization Name" />
                <v-textarea
                  v-model="orgDetails"
                  auto-grow
                  rows="1"
                  label="Purpose, goal, and orginaztion details"
                  box
                />
                <v-layout row wrap>
                  <v-flex xs12 class="text-xs-center">
                    <span class="minor-title">Start with:</span>
                  </v-flex>
                  <v-flex xs5 class="text-xs-center">
                    <v-tooltip top>
                      <div slot="activator">
                        <v-btn
                          v-if="!orgStart"
                          large
                          block
                          color="primary"
                          @click="orgStart = 'efficiency'"
                        >Efficiency</v-btn>
                        <div v-else>
                          <span class="major-title">+ {{orgStart === 'efficiency' ? '2' : '0'}}</span>
                          <br />
                          <span>Organization Efficiency</span>
                        </div>
                      </div>
                      <span>
                        How directly effective your organization is at what it does (a military organization with high efficiency would be good at combat, for example).
                        <br />Efficiency can be used to perform activities related to your organization’s purpose (science, military, etc). You can use these advantages as
                        <strong>reserves.</strong>
                      </span>
                    </v-tooltip>
                  </v-flex>
                  <v-spacer />
                  <v-flex xs5 class="text-xs-center">
                    <v-tooltip top>
                      <div slot="activator">
                        <v-btn
                          v-if="!orgStart"
                          large
                          block
                          color="primary"
                          @click="orgStart = 'influence'"
                        >Influence</v-btn>
                        <div v-else>
                          <span class="major-title">+ {{orgStart === 'influence' ? '2' : '0'}}</span>
                          <br />
                          <span>Organization Influence</span>
                        </div>
                      </div>
                      <span>Influence is your organization’s size, reach, wealth, and reputation. Influence be used to acquire assets, create opportunities, or sway public opinion.</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <br />
                <br />
                <v-btn
                  block
                  outline
                  style="bottom: 10px; width:95%"
                  color="deep-purple"
                  @click="addOrg"
                  :disabled="!orgName || !orgType || !orgStart"
                >
                  <v-icon left>add</v-icon>Add Organization
                </v-btn>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import ReserveItem from './ReserveItem.vue'
import { Reserve, Project, Organization, OrgType } from '@/class'

export default Vue.extend({
  name: 'downtime-selector',
  components: { ReserveItem },
  data: () => ({
    custom_type: 'Narrative',
    custom_name: '',
    details: '',
    projectName: '',
    projectDetails: '',
    projectComplicated: false,
    projectFinished: false,
    projectCost: [],
    projectCosts: [
      'Quality materials',
      'Specific knowledge or techniques',
      'Specialized tools',
      'A good workspace',
    ],
    orgName: '',
    orgType: '',
    orgStart: '',
    orgDetails: '',
  }),
  props: {
    pilot: Object,
  },
  computed: {
    reserves() {
      return _.groupBy(this.$store.getters.getItemCollection('Reserves'), 'Type')
    },
    orgTypes() {
      return Object.keys(OrgType)
        .map(k => OrgType[k as any])
        .sort() as OrgType[]
    },
  },
  methods: {
    add(reserve: Reserve) {
      this.pilot.Reserves.push(reserve)
      this.$emit('notify', `New ${reserve.Name} Reserve added`)
      this.$emit('close')
    },
    addCustom() {
      let nr = new Reserve({
        id: 'reserve_custom',
        type: this.custom_type,
        name: this.custom_name,
        label: this.custom_name,
        description: this.details,
      })
      this.pilot.Reserves.push(nr)
      this.$emit('notify', `New Custom Reserve added`)
      this.$emit('close')
    },
    addProject() {
      let p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: this.projectFinished ? this.projectName : 'Project (In Progress)',
        label: this.projectName,
        description: this.projectDetails,
        complicated: this.projectComplicated,
      })
      p.ResourceName = this.projectFinished ? '' : this.project_name
      if (this.projectCost && !this.projectFinished)
        p.ResourceCost = `Requires: ${this.projectCost.join(', ')}`
      p.IsFinished = this.projectFinished
      this.pilot.Reserves.push(p)
      this.$emit('notify', `New Project added`)
      this.$emit('close')
    },
    addOrg() {
      this.pilot.Organizations.push(
        new Organization(
          this.orgName,
          this.orgType,
          this.orgStart === 'efficiency' ? 2 : 0,
          this.orgStart === 'influence' ? 2 : 0,
          this.orgDetails,
          ''
        )
      )
      this.$emit('notify', `New Project added`)
      this.$emit('close')
    },
  },
})
</script>
