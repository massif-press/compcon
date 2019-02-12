<template>
  <b-card no-body>
    <v-layout>
      <v-flex xs3 align-self="center">
        <strong>&emsp;{{skillData.trigger}}</strong>
      </v-flex>
      <v-flex xs6 align-self="center">
        <p class="card-text">{{skillData.description}}</p>
      </v-flex>
      <v-flex xs3>
        <v-btn-toggle class="v-block">
          <v-tooltip>
            <v-btn slot="activator" :disabled="!canAdd"  @click="clicked('addBonus')"><b-icon name="arrow-up" /></v-btn>
            <span>Increase Skill Bonus</span>
          </v-tooltip>
          <v-tooltip>
            <v-btn slot="activator" :disabled="!canSubtract" @click="clicked('subtractBonus')"><b-icon name="arrow-down" /></v-btn>
            <span>Decrease Skill Bonus</span>
          </v-tooltip>
          <v-tooltip>
            <v-btn slot="activator" :disabled="!canToggleSpecialize" :variant="isSpecialized ? 'success' : ''" @click="clicked('toggleSpecialty')"><b-icon name="star" /></v-btn>
            <span>Toggle Specialty</span>
          </v-tooltip>
          <v-tooltip>
            <v-btn slot="activator" :disabled="!canToggleFlaw" :variant="isFlawed ? 'danger' : ''" @click="clicked('toggleFlaw')"><b-icon name="skull-crossbones" /></v-btn>
            <span>Toggle Flaw</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-flex>
    </v-layout>
  </b-card>
</template>

<script>
  export default {
    name: 'skill-selector-item',
    props: ['skillData', 'skills'],
    methods: {
      clicked: function (action) {
        this.$emit('skill-click', {id: this.skillData.id, action: action})
      }
    },
    computed: {
      canAdd: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return !this.$parent.pointLimit && (s == null || (s && s.bonus < 6))
      },
      canSubtract: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return s != null && s.bonus > 0
      },
      canToggleSpecialize: function () {
        var s = this.skills.find(x => x.id === this.skillData.id)
        return (!this.$parent.specializeLimit) || (s != null && s.specialty)
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
</style>

