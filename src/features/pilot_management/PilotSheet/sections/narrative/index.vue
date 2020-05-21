<template>
  <div>
    <v-row v-if="pilot.Quirk" align="center">
      <v-col cols="10">
        <div class="flavor-text font-weight-bold stark--text">CLONE QUIRK</div>
        <v-alert icon="mdi-dna" prominent dense color="primary" outlined>
          <div class="body-text stark--text font-weight-bold">{{ pilot.Quirk }}</div>
        </v-alert>
      </v-col>
    </v-row>
    <skill-block :pilot="pilot" />
    <dt-resources-block :pilot="pilot" />
    <!-- TODO: -->
    <!-- <cc-title small>
      <section-edit-icon label="Edit Pilot Organizations" />Organizations
    </cc-title>-->
    <pilot-loadout-block :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SkillBlock from './components/SkillBlock.vue'
import DtResourcesBlock from './components/DtResourcesBlock.vue'
import PilotLoadoutBlock from './components/PilotLoadoutBlock.vue'

export default Vue.extend({
  name: 'narrative-view',
  components: { SkillBlock, DtResourcesBlock, PilotLoadoutBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
