<template>
<v-container id="np-container" fluid>
  <v-layout>
    <v-flex>
      <v-stepper id="np-stepper" v-model="np_step">
        <v-stepper-header>
          <v-stepper-step editable :complete="newPilot.callsign !== ''" step="1">Identification<small v-if="newPilot.callsign">{{newPilot.callsign}}</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="newPilot.background !== ''" step="2">Background<small v-if="newPilot.background">{{item('Backgrounds', newPilot.background).name}}</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="newPilot.skills.length === 4" step="3">Skills<small v-if="newPilot.skills.length">{{newPilot.skills.length}}/{{4}} Skills Selected</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="newPilot.talents.length === 3" step="4">Talents<small v-if="newPilot.talents.length">{{newPilot.talents.length}}/{{3}}  Talents Selected</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="hasMechSkills === true" step="5">Mech Skills<small v-if="hasMechSkills === true">Mech Skills Selected</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="6">Confirm</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container>
            <v-layout justify-space-between align-center row fill-height>
              <v-flex xs7>
                <v-text-field v-model="newPilot.callsign" clearable>
                  <v-tooltip top slot="prepend-inner">
                    <v-btn slot="activator" icon flat @click="randomCallsign"><v-icon>shuffle</v-icon></v-btn>
                    <span>Generate Random Callsign</span>
                  </v-tooltip>
                  <span slot="label">Callsign <b v-if="!newPilot.callsign" class="red--text">*</b></span>
                  <span slot="append-outer">
                      <v-icon v-if="newPilot.callsign" color="green">check_circle</v-icon>
                    </span>
                  </v-text-field>
                <v-text-field v-model="newPilot.name" clearable>
                  <v-tooltip top slot="prepend-inner">
                    <v-btn slot="activator" icon flat @click="randomName"><v-icon>shuffle</v-icon></v-btn>
                    <span>Generate Random Name</span>
                  </v-tooltip>
                  <span slot="label">Name <b v-if="!newPilot.name" class="red--text">*</b></span>
                  <span slot="append-outer">
                    <v-icon v-if="newPilot.name" color="green">check_circle</v-icon>
                  </span>
                </v-text-field>
                <v-textarea label="History" v-model="newPilot.history" hint="This is not required and can be edited later" auto-grow rows="5" />
                <v-textarea label="Appearance" v-model="newPilot.text_appearance" hint="This is not required and can be edited later" auto-grow rows="5" />
              </v-flex>
              <v-spacer />
              <v-flex xs4>
                <v-layout justify-center align-center column>
                <v-flex>
                  <v-img class="center" contain aspect-ratio="0.8" width="350" :src="newPilot.portrait ? `file://${userDataPath}/img/portrait/${newPilot.portrait}` : '' " style="background-color: lightgrey" >
                  <v-fade-transition>
                    <div v-if="!newPilot.portrait" class="d-flex grey lighten-2" style="height: 100%; align-items:center" >
                      <span class="text-xs-center display-1 grey--text">No Pilot Portrait</span>
                    </div>
                  </v-fade-transition>
                  </v-img>

                  <v-btn color="primary" block @click="appearanceModal = true">&emsp;Set Pilot Images&emsp;</v-btn>
                  <v-dialog lazy v-model="appearanceModal" fullscreen hide-overlay transition="dialog-bottom-transition">
                  <v-card>
                    <v-toolbar fixed dense flat>
                      <v-toolbar-title>Set Pilot Portrait</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn icon large @click="appearanceModal = false"> <v-icon large>close</v-icon> </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-spacer class="mt-5" />
                    <image-selector @assign-portrait="setPortrait" />
                  </v-card>
                </v-dialog>

                </v-flex>
                <br>
                <v-flex>
                </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            </v-container>

            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn large color="primary" @click="stepForward" :disabled="!newPilot.callsign && !newPilot.name">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="2">
            <background-selector @selected="itemSelect" :preSelected="newPilot.background" />
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="3">
            <skill-selector :pilotSkills="newPilot.skills" new-pilot @set-skills="setSkills"/>
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

            <v-stepper-content step="4">
            <talent-selector :pilotTalents="newPilot.talents" new-pilot @set-talents="setTalents"/>
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

            <v-stepper-content step="5">
              <mech-skills-selector :mechSkills="newPilot.mechSkills" new-pilot />
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="6">
            <v-container>
              <v-layout column>
                <v-flex><span class="display-3">{{newPilot.callsign}}</span> // <span class="title">{{newPilot.name}}</span></v-flex>
                <v-flex>{{item('Backgrounds', newPilot.background).name}}</v-flex>
                <v-flex v-if="newPilot.history"><blockquote class="blockquote">{{newPilot.history}}</blockquote></v-flex>
                <v-layout row justify-space-around>
                <v-flex xs4>
                  <v-card style="height:100%">
                    <v-card-title class="mb-0 pb-2"><h3 class="headline mb-0">Pilot Skills</h3></v-card-title>
                    <v-divider class="m-0 p-0" />
                    <v-card-text>
                    <div class="pl-2" v-for="skill in newPilot.skills" :key="`confirm_${skill.id}`">
                        <v-layout>
                          <v-flex xs12>
                            <v-tooltip :disabled="!skill.specialty && !skill.flaw" right>
                              <v-chip slot="activator"
                                :dark="!skill.specialty || !skill.flaw" 
                                :color="chipColor(skill)"
                                small>
                                <v-avatar v-if="skill.specialty && skill.flaw"><v-icon small>trending_flat</v-icon></v-avatar>
                                <v-avatar v-else-if="skill.specialty"><v-icon small>star</v-icon></v-avatar>
                                <v-avatar v-else-if="skill.flaw"><v-icon small>thumb_down</v-icon></v-avatar>
                                +<b>{{skill.bonus}}</b>
                              </v-chip>
                              <span v-if="skill.specialty && skill.flaw">+0 Accuracy</span>
                              <span v-else-if="skill.specialty">+1 Accuracy</span>
                              <span v-else-if="skill.flaw">-1 Accuracy</span>
                            </v-tooltip>
                            <strong>{{item('Skills', skill.id).trigger}}</strong>
                          </v-flex>
                        </v-layout>
                    </div>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs4>
                  <v-card style="height:100%">
                    <v-card-title class="mb-0 pb-2"><h3 class="headline mb-0">Talents</h3></v-card-title>
                    <v-divider class="m-0 p-0" />
                    <v-card-text>
                    <div class="pl-2" v-for="talent in newPilot.talents" :key="`confirm_${talent.id}`">
                        <v-layout>
                          <v-flex xs12>
                            <v-icon v-for="n in talent.rank" :key="n + talent.id">star</v-icon>
                            <strong>{{item('Talents', talent.id).name}}</strong>
                          </v-flex>
                        </v-layout>
                    </div>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs4>
                  <v-card style="height:100%">
                    <v-card-title class="mb-0 pb-2"><h3 class="headline mb-0">Mech Skills</h3></v-card-title>
                    <v-divider class="m-0 p-0" />
                    <v-card-text>
                    <li class="title" v-if="newPilot.mechSkills.hull">Hull +{{newPilot.mechSkills.hull}}</li>
                    <li class="title" v-if="newPilot.mechSkills.agi">Agility +{{newPilot.mechSkills.agi}}</li>
                    <li class="title" v-if="newPilot.mechSkills.sys">Systems +{{newPilot.mechSkills.sys}}</li>
                    <li class="title" v-if="newPilot.mechSkills.eng">Engineering +{{newPilot.mechSkills.eng}}</li>
                    </v-card-text>
                  </v-card>
                </v-flex>
                </v-layout>
              </v-layout>
            </v-container>
            <v-layout>
              <v-flex xs12 class="text-xs-right">
                <span class="caption mr-5">Is this correct?</span>
              </v-flex>
            </v-layout> 
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="success" @click="savePilot" :disabled="!canSavePilot">Confirm &nbsp;<v-icon>done</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

        </v-stepper-items>
      </v-stepper>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
  import {BackgroundSelector, SkillSelector, TalentSelector, MechSkillsSelector, ImageSelector} from '../Selectors'
  import io from '@/store/data_io'

  export default {
    name: 'new-pilot',
    components: { BackgroundSelector, SkillSelector, TalentSelector, MechSkillsSelector, ImageSelector },
    data: () => ({
      np_step: 0,
      appearanceModal: false,
      newPilot: {
        callsign: '',
        name: '',
        background: '',
        history: '',
        skills: [],
        talents: [],
        mechSkills: {
          hull: 0,
          agi: 0,
          sys: 0,
          eng: 0
        }
      }
    }),
    methods: {
      itemSelect: function (payload) {
        this.stepForward()
        this.newPilot[payload.field] = payload.value
      },
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      setSkills: function (skills) {
        this.itemSelect({field: 'skills', value: skills})
      },
      setTalents: function (talents) {
        this.itemSelect({field: 'talents', value: talents})
      },
      setMechSkills: function (mskills) {
        this.itemSelect({field: 'mechSkills', value: mskills})
      },
      chipColor: function (skill) {
        if ((skill.specialty && skill.flaw)) return ''
        if (skill.specialty) return 'green'
        else if (skill.flaw) return 'red'
        else return 'primary'
      },
      savePilot: function () {
        this.$store.dispatch('addPilot', this.newPilot)
        this.$router.push('./roster')
      },
      stepBack: function () {
        this.np_step--
        window.scrollTo(0, 0)
      },
      stepForward: function () {
        this.np_step++
        window.scrollTo(0, 0)
      },
      setPortrait: function (src) {
        this.newPilot.portrait = src
        this.appearanceModal = false
      },
      randomCallsign: function () {
        this.newPilot.callsign = `${io.randomName('callsigns.txt')}`
        this.$forceUpdate()
      },
      randomName: function () {
        this.newPilot.name = `${io.randomName('firstnames.txt')} ${io.randomName('lastnames.txt')}`
        this.$forceUpdate()
      }
    },
    computed: {
      hasMechSkills: function () {
        return this.newPilot.mechSkills.hull +
          this.newPilot.mechSkills.agi +
          this.newPilot.mechSkills.sys +
          this.newPilot.mechSkills.eng === 2
      },
      canSavePilot: function () {
        return this.hasMechSkills &&
          this.newPilot.talents.length === 3 &&
          this.newPilot.skills.length === 4 &&
          this.newPilot.callsign !== '' &&
          this.newPilot.name !== ''
      }
    }
  }
</script>