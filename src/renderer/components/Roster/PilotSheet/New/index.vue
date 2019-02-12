<template>
<v-container id="np-container" fluid>
  <v-layout>
    <v-flex>
      <v-stepper id="np-stepper" v-model="np_step">
        <v-stepper-header>
          <v-stepper-step editable :complete="np_step > 1" step="1">Identification<small v-if="newPilot.callsign">{{newPilot.callsign}}</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="newPilot.background !== ''" step="2">Background<small v-if="newPilot.background">{{item('Backgrounds', newPilot.background).name}}</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="np_step > 3" step="3">Skills<small v-if="newPilot.skills.length">Skills Selected</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable :complete="np_step > 4" step="4">Talents<small v-if="newPilot.talents.length">Talents Selected</small></v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="5">Confirm</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-text-field label="Callsign" v-model="newPilot.callsign" clearable/>
            <v-text-field label="Name" v-model="newPilot.name" clearable/>
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn large :disabled="!newPilot.name || !newPilot.callsign" color="primary" @click="np_step++">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="2">
            <background-selector @selected="itemSelect" :preSelected="newPilot.background" />
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex xs1>
                <v-btn color="primary" flat @click="np_step--"><v-icon>chevron_left</v-icon>Back</v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="3">
            <skill-selector :pilotSkills="newPilot.skills" :pilotLevel="0" @set-skills="setSkills"/>
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn color="primary" flat @click="np_step--"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" @click="np_step++">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

            <v-stepper-content step="4">
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn color="primary" flat @click="np_step--"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" @click="np_step++">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

            <v-stepper-content step="5">
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="roster">Cancel</v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn color="primary" flat @click="np_step--"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="success" >Confirm &nbsp;<v-icon>done</v-icon></v-btn>
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
  import BackgroundSelector from '../Selectors/BackgroundSelector'
  import SkillSelector from '../Selectors/SkillSelector'
  export default {
    name: 'new-pilot',
    components: { BackgroundSelector, SkillSelector },
    data: () => ({
      np_step: 0,
      newPilot: {
        background: '',
        skills: [],
        talents: []
      },
      value: 1,
      max: 6
    }),
    methods: {
      itemSelect: function (payload) {
        this.np_step++
        this.newPilot[payload.field] = payload.value
        console.log(this.newPilot)
      },
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      }
    }
  }
</script>

<style scoped>
</style>