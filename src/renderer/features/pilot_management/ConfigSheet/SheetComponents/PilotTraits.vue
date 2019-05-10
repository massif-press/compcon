<template>
  <div class="mt-2 mb-2">
    <v-expansion-panel dark dense>
      <v-expansion-panel-content>
        <template v-slot:header dense>
          <div class="text-uppercase title">talents</div>
        </template>
        <v-card>
          <v-card-text v-for="(talent, index) in pilot.talents" :key="talent.id" class="pb-0 pt-0">
            <span class="minor-title">{{getTalent(talent.id).r1_name}}:</span>
            <span class="effect-text" v-html="getTalent(talent.id).r1_desc" />
            <div v-if="talent.rank >= 2">
              <span class="minor-title">{{getTalent(talent.id).r2_name}}:</span>
              <span class="effect-text" v-html="getTalent(talent.id).r2_desc" />
            </div>
            <div v-if="talent.rank === 3">
              <span class="minor-title">{{getTalent(talent.id).r3_name}}:</span>
              <span class="effect-text" v-html="getTalent(talent.id).r3_desc" />
            </div>          
            <v-divider v-if="index + 1 < pilot.talents.length" class="ma-2"/>
          </v-card-text>
        </v-card>
       </v-expansion-panel-content>
      <v-expansion-panel-content>
        <template v-slot:header dense>
          <div class="text-uppercase title">core bonuses</div>
        </template>
        <v-card>
          <v-card-text v-for="cb in pilot.core_bonuses" :key="cb" class="pb-0 pt-0">
            <span class="minor-title">{{getCoreBonus(cb).name}}:</span>
            <span class="effect-text" v-html="getCoreBonus(cb).effect" />
          </v-card-text>
        </v-card>
       </v-expansion-panel-content>       
    </v-expansion-panel>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'pilot-trait-item',
    props: {
      pilot: Object
    }
  })
</script>
