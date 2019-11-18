<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-chip
        :highlight="!pilot.HasFullHASE"
        :current="pilot.CurrentHASEPoints"
        :max="pilot.MaxHASEPoints"
        :label="`Edit Pilot Mech Skills (${pilot.CurrentHASEPoints}/${pilot.MaxHASEPoints})`"
        @open-selector="$refs.mechskillsSelector.show()"
      />
      Mech Skills
    </cc-title>
    <cc-solo-dialog
      ref="mechskillsSelector"
      icon="cci-frame"
      no-confirm
      title="Set Pilot Mech Skills"
      fullscreen
    >
      <cc-mech-skills-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-row class="pt-1 pb-3">
      <v-col cols="auto" dense class="py-0">
        <hase-pips title="hull" :skill-points="pilot.MechSkills.Hull" />
      </v-col>
      <v-col cols="auto" dense class="py-0">
        <hase-pips title="agility" :skill-points="pilot.MechSkills.Agi" />
      </v-col>
      <v-col cols="auto" dense class="py-0">
        <hase-pips title="systems" :skill-points="pilot.MechSkills.Sys" />
      </v-col>
      <v-col cols="auto" dense class="py-0">
        <hase-pips title="engineering" :skill-points="pilot.MechSkills.Eng" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditChip from '../../components/SectionEditChip.vue'
import HasePips from './HasePips.vue'

export default Vue.extend({
  name: 'skill-block',
  components: { SectionEditChip, HasePips },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
