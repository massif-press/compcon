<template>
  <v-card class="m-2">
    <v-card-text class="p-1">
    <v-layout justify-space-between>
      <v-flex xs3 align-self="center" >
        <strong class="center-align">&emsp;{{skillData.trigger}}</strong>
      </v-flex>
      <v-flex xs7 align-self="center">
        <span class="center-align">{{skillData.description}}</span>
      </v-flex>
      <v-flex shrink>
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
            <span v-if="isNewPilot">Remove Skill Trigger</span>
            <span v-else>Decrease Skill Bonus</span>
          </v-tooltip>
      </v-flex>
    </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'skill-selector-item',
    props: ['skillData', 'isNewPilot', 'can-add', 'can-subtract'],
    methods: {
      clicked: function (action) {
        this.$emit('skill-click', {id: this.skillData.id, action: action})
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

