<template>
  <v-card>
    <v-card-text class="pa-0">
    <v-layout justify-space-between>
      <v-flex xs2>
        <div class="centered">
          <span class="text-xs-center title">{{skillData.trigger}}</span>
        </div>
      </v-flex>
      <v-flex xs8>
        <v-expansion-panel class="pa-0 ma-0">
          <v-expansion-panel-content expand-icon="search">
            <template v-slot:header>
              <div><span class="center-align subheading">{{skillData.description}}</span></div>
            </template>
            <v-card flat class="ma-0 pa-0" width="48vw">
              <v-card-text class="mt-0 mb-0 pt-0 pb-2"><em>{{skillData.detail}}</em></v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
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

  .centered {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
  }
</style>

