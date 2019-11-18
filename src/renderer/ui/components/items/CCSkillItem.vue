<template>
  <div>
    <v-card v-if="skill.err" flat outlined>
      <v-card-text class="text-center pa-1">
        <span class="flavor-text grey--text">// MISSING DATA //</span>
      </v-card-text>
    </v-card>
    <v-expansion-panels v-else focusable accordion style="border-radius: 0px">
      <v-expansion-panel
        :class="`text-center no-shadow ${noBorder ? '' : 'border-thin-primary '}`"
        :style="pilot ? 'border-color: var(--v-pilot-base)' : ''"
      >
        <v-expansion-panel-header class="px-2">
          <v-row dense>
            <v-col cols="3" dense>
              <div class="centered text-left pl-3">
                <span class="stat-text">{{ skill.Trigger }}</span>
                <div v-if="bonus">
                  <v-icon v-for="n in bonus" :key="skill.ID + n" color="secondary" small>
                    mdi-hexagon
                  </v-icon>
                  <span class="flavor-text grey--text">(+{{ bonus }})</span>
                </div>
              </div>
            </v-col>
            <v-col cols="9" dense>
              <span class="body">{{ skill.Description }}</span>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row dense>
            <v-col offset="3" dense>
              <p class="pb-2 text-left flavor-text">{{ skill.Detail }}</p>
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
    noBorder: {
      type: Boolean,
      required: false,
    },
    pilot: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
