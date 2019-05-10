<template>
  <v-expansion-panel-content>
    <v-toolbar-title slot="header" v-if="talentData.err" dense>
      <span class="subheading grey--text">// MISSING DATA //</span>&emsp;
      <span v-if="talent.brew" class="caption grey--text">({{talent.brew}})</span>
    </v-toolbar-title>

    <v-toolbar-title slot="header" v-else dense>
      <v-icon color="primary" v-html="`cc-rank-${talent.rank}`" />
      <span>{{talentData.name}}</span>
    </v-toolbar-title>

    <div v-if="!talentData.err">
      <v-card >
        <v-card-title><p class="fluff-text mb-0 pb-0 pt-0" v-html="talentData.description" /></v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div style="width:100%">
            <div class="title"><v-icon class="mt-2" color="primary">cc-rank-1</v-icon> {{talentData.r1_name}}</div>
            <p class="pl-4 effect-text" v-html="talentData.r1_desc" />
            <div class="ma-2 mr-5 ml-5" v-if="selectable">
              <v-btn v-if="available && talent.rank === 0" block color="primary" @click="addTalent()">
                Unlock {{talentData.name}} Rank I: {{talentData.r1_name}}
              </v-btn>
              <v-btn v-else-if="talent.rank === 1" block flat color="warning" @click="removeTalent()">
                Unlearn {{talentData.name}} Rank I: {{talentData.r1_name}}
              </v-btn>
            </div>          
          </div>
        </v-card-title>
      </v-card>
      <v-card :color="isLocked(2) ? 'grey lighten-5' : ''">
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div style="width:100%">
            <div class="title">
              <span v-if="isLocked(2)">
                <v-icon class="mb-1">lock</v-icon> {{talentData.r2_name}}
              </span>
              <span v-else>
                <v-icon class="mt-2" color="primary">cc-rank-2</v-icon> {{talentData.r2_name}}
              </span>
            </div>
            <p class="pl-4 effect-text" v-html="talentData.r2_desc" />
            <div class="ma-2 mr-5 ml-5" v-if="selectable && !newPilot">
              <v-btn v-if="available && talent.rank === 1" block color="primary" @click="addTalent()">
                Unlock {{talentData.name}} Rank II: {{talentData.r2_name}}
              </v-btn>
              <v-btn v-else-if="talent.rank === 2" block flat color="warning" @click="removeTalent()">
                Unlearn {{talentData.name}} Rank II: {{talentData.r2_name}}
              </v-btn>
            </div>
          </div>
        </v-card-title>
      </v-card>
      <v-card :color="isLocked(3) ? 'grey lighten-5' : ''">
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div style="width:100%">
            <div class="title">
              <span v-if="isLocked(3)">
                <v-icon class="mb-1">lock</v-icon> {{talentData.r3_name}}
              </span>
              <span v-else>
                <v-icon class="mt-2" color="primary">cc-rank-3</v-icon> {{talentData.r3_name}}
              </span>
            </div>
            <p class="pl-4 effect-text" v-html="talentData.r3_desc" />
            <div class="ma-2 mr-5 ml-5" v-if="selectable && !newPilot">
              <v-btn v-if="available && talent.rank === 2" block color="primary" @click="addTalent()">
                Unlock {{talentData.name}} Rank III: {{talentData.r3_name}}
              </v-btn>
              <v-btn v-else-if="talent.rank === 3" block flat color="warning" @click="removeTalent()">
                Unlearn {{talentData.name}} Rank III: {{talentData.r3_name}}
              </v-btn>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </v-expansion-panel-content>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'talent-item',
    props: {
      talent: Object,
      talentData: Object,
      pointLimit: Boolean,
      newPilot: Boolean,
      selectable: Boolean,
      available: Boolean
    },
    methods: {
      isLocked (target: number): boolean {
        return !(this.talent.rank >= target)
      },
      addTalent () {
        this.$emit('add')
      },
      removeTalent () {
        this.$emit('remove')
      }
    }    
  })
</script>

<style scoped>
  .locked {
    background-color: lightgray;
    cursor: not-allowed;
  }
</style>
