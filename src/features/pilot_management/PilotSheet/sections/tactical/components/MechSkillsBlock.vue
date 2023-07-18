<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -50px !important">
      <section-edit-chip
        :highlight="!pilot.MechSkillsController.HasFullHASE"
        :current="pilot.MechSkillsController.CurrentHASEPoints"
        :max="pilot.MechSkillsController.MaxHASEPoints"
        :label="`Edit Pilot Mech Skills (${pilot.MechSkillsController.CurrentHASEPoints}/${pilot.MechSkillsController.MaxHASEPoints})`"
        @open-selector="($refs as any).mechskillsSelector.show()"
      />
      Mech Skills
    </cc-title>
    <cc-solo-dialog
      ref="mechskillsSelector"
      icon="cc:frame"
      no-confirm
      title="Set Pilot Mech Skills"
      fullscreen
    >
      <cc-mech-skills-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-row density="compact" class="pt-3 pb-3" justify="space-around">
      <v-col cols="auto" density="compact" class="py-0">
        <hase-pips title="hull" :skill-points="pilot.MechSkillsController.MechSkills.Hull" />
      </v-col>
      <v-col cols="auto" density="compact" class="py-0">
        <hase-pips title="agility" :skill-points="pilot.MechSkillsController.MechSkills.Agi" />
      </v-col>
      <v-col cols="auto" density="compact" class="py-0">
        <hase-pips title="systems" :skill-points="pilot.MechSkillsController.MechSkills.Sys" />
      </v-col>
      <v-col cols="auto" density="compact" class="py-0">
        <hase-pips title="engineering" :skill-points="pilot.MechSkillsController.MechSkills.Eng" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import SectionEditChip from '../../components/SectionEditChip.vue';
import HasePips from './HasePips.vue';

export default {
  name: 'skill-block',
  components: { SectionEditChip, HasePips },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
