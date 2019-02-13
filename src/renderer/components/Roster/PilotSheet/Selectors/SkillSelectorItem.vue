<template>
  <v-card class="m-2">
    <v-card-text class="p-1">
    <v-layout>
      <v-flex xs3 align-self="center" >
        <strong class="center-align">&emsp;{{skillData.trigger}}</strong>
      </v-flex>
      <v-flex xs6 align-self="center">
        <span class="center-align">{{skillData.description}}</span>
      </v-flex>
      <v-flex>
          <v-tooltip top>
            <v-btn icon slot="activator" :disabled="!canAdd" @click="clicked('addBonus')">
              <v-icon v-if="isNewPilot">check</v-icon>
              <v-icon v-else>arrow_upward</v-icon>
            </v-btn>
            <span>Increase Skill Bonus</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn icon slot="activator" :disabled="!canSubtract" @click="clicked('subtractBonus')">
              <v-icon v-if="isNewPilot">cancel</v-icon>
              <v-icon v-else>arrow_downward</v-icon>
            </v-btn>
            <span>Decrease Skill Bonus</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn icon slot="activator" :disabled="!canToggleSpecialize" @click="clicked('toggleSpecialty')">
              <v-icon :color="isSpecialized ? 'cyan darken-2' : ''">star</v-icon>
            </v-btn>
            <span>Toggle Specialty</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn icon slot="activator" :disabled="!canToggleFlaw"  @click="clicked('toggleFlaw')">
              <v-icon :color="isFlawed ? 'red darken-2' : ''">thumb_down</v-icon>
            </v-btn>
            <span>Toggle Flaw</span>
          </v-tooltip>
      </v-flex>
    </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'skill-selector-item',
    props: ['skillData', 'skills', 'isNewPilot'],
    methods: {
      clicked: function (action) {
        this.$emit('skill-click', {id: this.skillData.id, action: action})
      }
    },
    computed: {
      canAdd: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        if (this.isNewPilot) return (!this.$parent.pointLimit && s == null)
        return !this.$parent.pointLimit && (s == null || (s && s.bonus < 6))
      },
      canSubtract: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return s != null && s.bonus > 0
      },
      canToggleSpecialize: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return (!this.$parent.specializeLimit && s && s.bonus) || (s && s.specialty)
      },
      canToggleFlaw: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return !this.$parent.flawLimit || (s != null && s.flaw)
      },
      isSpecialized: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return s != null && s.specialty
      },
      isFlawed: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return s != null && s.flaw
      }
    }
  }
</script>

<style scoped>
  .v-block {
    height: 100%;
    float: right;
  }

  .center-align {
    min-height: 55px;
    display: inline-flex;
    align-items: center;
  }
</style>

