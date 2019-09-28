<template>
  <div>
    <v-card v-if="skill.err" flat outlined>
      <v-card-text class="text-center pa-1">
        <span class="flavor-text grey--text">// MISSING DATA //</span>
      </v-card-text>
    </v-card>
    <v-expansion-panels v-else focusable accordion>
      <v-expansion-panel class="elevation-0 text-center">
        <v-expansion-panel-header>
          <v-row>
            <v-col cols="3">
              <div class="centered text-left pl-3">
                <v-chip v-if="bonus" dark color="primary" small outline>
                  <b>+ {{ bonus }}</b>
                </v-chip>
                <span class="stat-text">{{ skill.Trigger }}</span>
              </div>
            </v-col>
            <v-col cols="9">
              <span class="body">{{ skill.Description }}</span>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col offset="3">
              <p class="text-left flavor-text">{{ skill.Detail }}</p>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'skill-item',
  props: {
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
    skill: {
      type: Object,
      required: true,
    },
  },
})
</script>