<template>
  <b-card no-body>
    <b-form-row>
      <b-col cols=3 align-self="center">
        <strong>&emsp;{{skillData.trigger}}</strong>
      </b-col>
      <b-col cols=6 align-self="center">
        <p class="card-text">{{skillData.description}}</p>
      </b-col>
      <b-col cols=3>
        <b-btn-group class="v-block">
          <b-tooltip :target="`add-btn-${skillData.id}`" title="Increase Skill Bonus" :triggers="['hover']"/>
          <b-btn :id="`add-btn-${skillData.id}`" :disabled="!canAdd"  @click="clicked('addBonus')"><v-icon name="arrow-up" /></b-btn>
          <b-tooltip :target="`sub-btn-${skillData.id}`" title="Decrease Skill Bonus" :triggers="['hover']"/>
          <b-btn :id="`sub-btn-${skillData.id}`" :disabled="!canSubtract" @click="clicked('subtractBonus')"><v-icon name="arrow-down" /></b-btn>
          <b-tooltip :target="`spec-btn-${skillData.id}`" title="Toggle Specialty" :triggers="['hover']"/>
          <b-btn :id="`spec-btn-${skillData.id}`" :disabled="!canToggleSpecialize" :variant="isSpecialized ? 'success' : ''" v-b-tooltip title="Toggle Specialty" @click="clicked('toggleSpecialty')"><v-icon name="star" /></b-btn>
          <b-tooltip :target="`flaw-btn-${skillData.id}`" title="Toggle Flaw" :triggers="['hover']" />
          <b-btn :id="`flaw-btn-${skillData.id}`" :disabled="!canToggleFlaw" :variant="isFlawed ? 'danger' : ''" @click="clicked('toggleFlaw')"><v-icon name="skull-crossbones" /></b-btn>
        </b-btn-group>
      </b-col>
    </b-form-row>
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

