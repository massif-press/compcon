<template>
  <div class="mt-2 mb-2">
    <v-expansion-panel dark dense>
      <v-expansion-panel-content>
        <template v-slot:header dense>
          <div class="text-uppercase title">talents</div>
        </template>
        <v-card>
          <v-card-text v-for="(ptalent, index) in pilot.Talents" :key="ptalent.Talent.ID" class="pb-0 pt-0">
            <div v-for="n in 3" :key="'talent_'+n">
              <div v-if="ptalent.Rank >= n">
                <span class="minor-title">{{ptalent.Talent.Rank(n - 1).name}}:</span>
                <span class="effect-text" v-html="ptalent.Talent.Rank(n - 1).description" />
              </div>
            </div>      
            <v-divider v-if="index + 1 < pilot.talents.length" class="ma-2"/>
          </v-card-text>
        </v-card>
       </v-expansion-panel-content>
      <v-expansion-panel-content v-if="pilot.CoreBonuses.length">
        <template v-slot:header dense>
          <div class="text-uppercase title">core bonuses</div>
        </template>
        <v-card>
          <v-card-text v-for="cb in pilot.CoreBonuses" :key="cb.ID" class="pb-0 pt-0">
            <span class="minor-title">{{cb.Name}}:</span>
            <span class="effect-text" v-html="cb.Effect" />
          </v-card-text>
        </v-card>
       </v-expansion-panel-content>       
    </v-expansion-panel>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Pilot } from '@/class';

  export default Vue.extend({
    name: 'pilot-trait-item',
    props: {
      pilot: Pilot
    }
  })
</script>
