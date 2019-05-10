<template>
<v-container id="np-container" fluid>
  <v-layout>
    <v-flex>
      <v-stepper id="np-stepper" v-model="lv_step">
        <v-stepper-header>
          <v-stepper-step :complete="lv_step > 1" step="1">Overview</v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="lv_step > 2" step="2">Assign Skill Points</v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="lv_step > 3" step="3">Assign Talent Point</v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="lv_step > 4" step="4">Assign Mech Skill Point</v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="lv_step > 5" step="5">Select New License</v-stepper-step>
          <v-divider />
          <v-stepper-step v-if="pilot.level % 3 === 0" :complete="lv_step > 6" step="6">Select New Core Bonus</v-stepper-step>
          <v-divider />
          <v-stepper-step :step="pilot.level % 3 === 0 ? '7' : '6'">Confirm</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container>
                <level-update-block :lvl="pilot.level" :callsign="pilot.callsign" />        
            </v-container>

            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn large color="primary" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="2">
            <skill-selector v-if="lv_step === 2" :pilotSkills="pilot.skills" :pilotLevel="pilot.level" level-up @set-skills="setSkills"/>
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" :disabled="newItems.skills.length === 0" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="3">
            <talent-selector v-if="lv_step === 3" :pilotTalents="pilot.talents" :pilotLevel="pilot.level" level-up @set-talents="setTalents"/>
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" :disabled="newItems.talents.length === 0"  @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

            <v-stepper-content step="4">
            <mech-skills-selector v-if="lv_step === 4" :mechSkills="mSkills" level-up :pilotLevel="pilot.level" @new-mech-skills="setMechSkills"/>        
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" :disabled="!hasNewMechSkills()"  @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

            <v-stepper-content step="5">
            <license-selector v-if="lv_step === 5" :pilotLicenses="pilot.licenses" level-up :pilotLevel="pilot.level" @set-licenses="setLicenses"/>    
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" :disabled="newItems.licenses.length === 0" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content v-if="pilot.level % 3 === 0" step="6">
            <core-bonus-selector v-if="lv_step === 6" :pilotBonuses="pilot.core_bonuses" level-up :pilotLevel="pilot.level" 
              :pilotLicenses="getBonusLicenses()" @set-bonuses="setBonuses"/>          
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="primary" @click="stepForward">Continue<v-icon>chevron_right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content :step="pilot.level % 3 === 0 ? '7' : '6'">
            <v-container>
              <confirmation-block :pilot="pilot" :changes="newItems" />
            </v-container>

            <v-layout>
              <v-flex xs12 class="text-xs-right">
                <span class="caption mr-5">Is this correct?</span>
              </v-flex>
            </v-layout> 
            <v-layout justify-space-between>
              <v-flex xs1>
                <v-btn flat to="pilot">Cancel</v-btn>
              </v-flex>
              <v-flex shrink>
                <v-btn color="primary" flat @click="stepBack"><v-icon>chevron_left</v-icon>Back</v-btn>
                <v-btn large color="success" @click="savePilot" >Confirm &nbsp;<v-icon>done</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-stepper-content>

        </v-stepper-items>
      </v-stepper>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'
  import { SkillSelector, TalentSelector, MechSkillsSelector, LicenseSelector, CoreBonusSelector } from '../Selectors'
  import LevelUpdateBlock from './LevelUpdateBlock.vue'
  import ConfirmationBlock from './ConfirmationBlock.vue'

  export default Vue.extend({
    name: 'new-pilot',
    components: { SkillSelector, TalentSelector, MechSkillsSelector, LicenseSelector, CoreBonusSelector, LevelUpdateBlock, ConfirmationBlock },
    data: () => ({
      lv_step: 0,
      pilot: {} as Pilot,
      mSkills: {} as MechSkills,
      newItems: {
        level: 0,
        skills: [],
        talents: [],
        mechSkills: {
          hull: 0,
          agi: 0,
          sys: 0,
          eng: 0
        },
        licenses: []
      }
    }),
    methods: {
      itemSelect (payload: {field: string, value: any}) {
        (this as any).newItems[payload.field] = payload.value
      },
      item (type: string, id: string) {
        return this.$store.getters['getItemById'](type, id)
      },
      setSkills (skills: any) {
        this.itemSelect({field: 'skills', value: skills})
      },
      setTalents (talents: any) {
        this.itemSelect({field: 'talents', value: talents})
      },
      setMechSkills (mskills: any) {
        this.itemSelect({field: 'mechSkills', value: mskills})
      },
      setLicenses (licenses: any) {
        this.itemSelect({field: 'licenses', value: licenses})
      },
      getBonusLicenses (): any {
        var vm = this as any
        return _.clone(vm.newItems.licenses)
      },
      setBonuses (cbs: any) {
        this.itemSelect({field: 'core_bonuses', value: cbs})
      },
      savePilot () {
        var saveItems = this.newItems as any
        for (const key in saveItems) {
          this.$store.dispatch('editPilot', {
            attr: key,
            val: saveItems[key]
          })
        }
        this.$router.push('./pilot')
      },
      stepBack () {
        this.lv_step--
        window.scrollTo(0, 0)
      },
      stepForward () {
        this.lv_step++
        window.scrollTo(0, 0)
      },
      hasNewMechSkills () {
        var m = this.newItems.mechSkills
        return m.hull + m.agi + m.eng + m.sys > 0
      },
      init () {
        this.pilot = JSON.parse(JSON.stringify(this.$store.getters['getPilot']))
        this.mSkills = JSON.parse(JSON.stringify(this.pilot.mechSkills))
        this.pilot.level++
        this.newItems.level = this.pilot.level
      }
    },
    created () {
      this.init()
    }
  })
</script>
