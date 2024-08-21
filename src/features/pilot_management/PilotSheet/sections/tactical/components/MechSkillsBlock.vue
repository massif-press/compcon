<template>
  <div>
    <section-header title="Mech Skills">
      <section-edit-chip
        :highlight="!pilot.MechSkillsController.HasFullHASE"
        :current="pilot.MechSkillsController.CurrentHASEPoints"
        :max="pilot.MechSkillsController.MaxHASEPoints"
        :label="`Edit Pilot Mech Skills (${pilot.MechSkillsController.CurrentHASEPoints}/${pilot.MechSkillsController.MaxHASEPoints})`"
        @open-selector="($refs as any).mechskillsSelector.show()" />
    </section-header>

    <cc-solo-dialog
      ref="mechskillsSelector"
      icon="cc:frame"
      no-confirm
      title="Set Pilot Mech Skills"
      fullscreen>
      <v-container>
        <mech-skills-selector :pilot="<Pilot>pilot" />
      </v-container>
    </cc-solo-dialog>
    <v-row dense class="py-3" justify="space-around">
      <v-col cols="auto">
        <hase-pips title="hull" :skill-points="pilot.MechSkillsController.MechSkills.Hull" />
      </v-col>
      <v-col cols="auto">
        <hase-pips title="agility" :skill-points="pilot.MechSkillsController.MechSkills.Agi" />
      </v-col>
      <v-col cols="auto">
        <hase-pips title="systems" :skill-points="pilot.MechSkillsController.MechSkills.Sys" />
      </v-col>
      <v-col cols="auto">
        <hase-pips title="engineering" :skill-points="pilot.MechSkillsController.MechSkills.Eng" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import MechSkillsSelector from '@/features/pilot_management/_components/selectors/MechSkillsSelector.vue';
import HasePips from './HasePips.vue';
import { Pilot } from '@/class';

export default {
  name: 'skill-block',
  components: { SectionHeader, SectionEditChip, HasePips, MechSkillsSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
