<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-chip
        :highlight="!pilot.HasFullSkills"
        :current="pilot.CurrentSkillPoints"
        :max="pilot.MaxSkillPoints"
        :label="`Edit Pilot Skill Triggers (${pilot.CurrentSkillPoints}/${pilot.MaxSkillPoints})`"
        @open-selector="$refs.skillSelector.show()"
      />
      Skill Triggers
    </cc-title>
    <cc-solo-dialog
      ref="skillSelector"
      icon="cci-skill"
      no-confirm
      title="Set Pilot Skill Triggers"
      fullscreen
    >
      <cc-skill-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-row :style="$vuetify.breakpoint.lgAndUp ? `width: calc(100vw - 250px)` : ''">
      <v-col cols="auto" class="mr-2 text-center">
        <span class="stat-text">PILOT GRIT</span>
        <br />
        <span class="heading mech secondary--text" style="font-size: 80px; line-height: 50px">
          +{{ pilot.Grit }}
        </span>
      </v-col>
      <v-col>
        <no-data-block v-if="!pilot.Skills.length" />
        <cc-skill-item
          v-for="(s, i) in pilot.Skills"
          v-else
          :key="`s_${i}`"
          :bonus="s.Bonus"
          :skill="s.Skill"
          pilot
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditChip from '../../components/SectionEditChip.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'

export default Vue.extend({
  name: 'skill-block',
  components: { SectionEditChip, NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
