<template>
  <v-container>
    <v-layout align-center justify-center column fill-height>
      <v-alert value="true" :type="!pointLimit ? 'info' : 'success'" outline>{{currentPoints}}/{{maxPoints}} Mech Skills selected</v-alert>
    </v-layout>
    <v-layout align-center justify-center column fill-height>
      <v-flex><span class="headline">HULL</span></v-flex>
      <v-flex>
        <span class="font-weight-light">Your HULL skill describes your ability to build and pilot durable, heavy mechs that can take punches and keep going</span>
      </v-flex>
      <v-flex>
        <v-btn :disabled="mechSkills.hull <= 0" icon left bottom @click="changeSkill('hull', '-')"><v-icon>remove</v-icon></v-btn>
        <v-rating class="d-inline-block" v-model="mechSkills.hull" hover x-large length=6 readonly empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        <v-btn :disabled="mechSkills.hull >= 6 || pointLimit" icon right bottom @click="changeSkill('hull', '+')"><v-icon>add</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ml-4 mr-4 mt-0 pt-0 mb-3" />
    <v-layout align-center justify-center column fill-height>
      <v-flex><span class="headline">AGILITY</span></v-flex>
      <v-flex>
        <span class="font-weight-light">Your AGILITY skill describes your ability to build and pilot fast, evasive mechs</span>
      </v-flex>
      <v-flex>
        <v-btn :disabled="mechSkills.agi <= 0" icon left bottom @click="changeSkill('agi', '-')"><v-icon>remove</v-icon></v-btn>
        <v-rating class="d-inline-block" v-model="mechSkills.agi" hover x-large length=6 readonly empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        <v-btn :disabled="mechSkills.agi >= 6 || pointLimit" icon right bottom @click="changeSkill('agi', '+')"><v-icon>add</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ml-4 mr-4 mt-0 pt-0 mb-3" />
    <v-layout align-center justify-center column fill-height>
      <v-flex><span class="headline">SYSTEMS</span></v-flex>
      <v-flex>
        <span class="font-weight-light">Your SYSTEMS skill describes your ability to build and pilot technical mechs with powerful electronic warfare tools</span>
      </v-flex>
      <v-flex>
        <v-btn :disabled="mechSkills.sys <= 0" icon left bottom @click="changeSkill('sys', '-')"><v-icon>remove</v-icon></v-btn>
        <v-rating class="d-inline-block" v-model="mechSkills.sys" hover x-large length=6 readonly empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        <v-btn :disabled="mechSkills.sys >= 6 || pointLimit" icon right bottom @click="changeSkill('sys', '+')"><v-icon>add</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ml-4 mr-4 mt-0 pt-0 mb-3" />
    <v-layout align-center justify-center column fill-height>
      <v-flex><span class="headline">ENGINEERING</span></v-flex>
      <v-flex>
        <span class="font-weight-light">
          Your ENGINEERING skill describes your ability to build and pilot mechs with powerful reactors, supplies and support systems
        </span>
      </v-flex>
      <v-flex>
        <v-btn :disabled="mechSkills.eng <= 0" icon left bottom @click="changeSkill('eng', '-')"><v-icon>remove</v-icon></v-btn>
        <v-rating class="d-inline-block" v-model="mechSkills.eng" hover x-large length=6 readonly empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        <v-btn :disabled="mechSkills.eng >= 6 || pointLimit" icon right bottom @click="changeSkill('eng', '+')"><v-icon>add</v-icon></v-btn>
      </v-flex>
    </v-layout>
    <div v-if="isActivePilot">
      <v-divider class="mt-2 mb-2" />
      <v-layout class="ml-5 mr-5">
        <v-btn large color="primary" block :disabled="!pointLimit" @click="close">Save Mech Skills</v-btn>
      </v-layout>
    </div>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
  name: 'mech-skills-selector',
  props: {
    mechSkills: {
      type: Object
    },
    pilotLevel: {
      type: Number
    },
    isActivePilot: {
      type: Boolean
    },
    newPilot: {
      type: Boolean
    },
    levelUp: {
      type: Boolean
    }
  },
  data: () => ({
    pLvl: 0
  }),
  methods: {
    changeSkill (field: string, operator: string) {
      if (this.isActivePilot) {
        this.$store.dispatch('editPilot', {
          attr: ['mechSkills', field],
          val: operator === '+' ? this.mechSkills[field] + 1 : this.mechSkills[field] - 1
        })
      } else {
        operator === '+' ? this.mechSkills[field]++ : this.mechSkills[field]--
      }
      if (this.levelUp) this.$emit('new-mech-skills', this.mechSkills)
    },
    close () {
      this.$emit('close')
    }
  },
  computed: {
    maxPoints (): number {
      return this.pLvl + 2
    },
    currentPoints (): number {
      return this.mechSkills.hull + this.mechSkills.agi + this.mechSkills.sys + this.mechSkills.eng
    },
    pointLimit (): boolean {
      return this.currentPoints >= this.maxPoints
    }
  },
  created () {
    if (this.newPilot) this.pLvl = 0
    else this.pLvl = this.pilotLevel
  }
})
</script>
