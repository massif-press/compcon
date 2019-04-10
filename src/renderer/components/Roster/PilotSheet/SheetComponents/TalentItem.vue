<template>
  <v-expansion-panel-content>
    <v-toolbar-title slot="header" v-if="talentData.err">
      <span class="subheading grey--text">// MISSING DATA //</span>&emsp;
      <span v-if="talent.brew" class="caption grey--text">({{talent.brew}})</span>
    </v-toolbar-title>

    <v-toolbar-title slot="header" v-else>
      <span>{{talentData.name}}</span>
      <span v-for="n in talent.rank" :key="`${talentData.id}_prank_${n}`"><v-icon>star</v-icon></span>
    </v-toolbar-title>

    <div v-if="!talentData.err">
      <v-card >
        <v-card-title><p class="fluff-text mb-0 pb-0 pt-0" v-html="talentData.description" /></v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div>
            <div class="title"><v-icon class="mb-1">star</v-icon> {{talentData.r1_name}}</div>
            <p class="pl-4 effect-text" v-html="talentData.r1_desc" />
          </div>
        </v-card-title>
      </v-card>
      <v-card :color="isLocked(2) ? 'grey lighten-5' : ''">
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div>
            <div class="title">
              <span v-if="isLocked(2)">
                <v-icon class="mb-1">lock</v-icon> {{talentData.r2_name}}
              </span>
              <span v-else>
                <v-icon class="mb-1">star</v-icon><v-icon class="mb-1">star</v-icon> {{talentData.r2_name}}
              </span>
            </div>
            <p class="pl-4 effect-text" v-html="talentData.r2_desc" />
          </div>
        </v-card-title>
      </v-card>
      <v-card :color="isLocked(3) ? 'grey lighten-5' : ''">
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div>
            <div class="title">
              <span v-if="isLocked(3)">
                <v-icon class="mb-1">lock</v-icon> {{talentData.r3_name}}
              </span>
              <span v-else>
                <v-icon class="mb-1">star</v-icon><v-icon class="mb-1">star</v-icon><v-icon class="mb-1">star</v-icon> {{talentData.r3_name}}
              </span>
            </div>
            <p class="pl-4 effect-text" v-html="talentData.r3_desc" />
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
      talentData: Object
    },
    methods: {
      isLocked (target: number) {
        return !(this.talent.rank >= target)
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
