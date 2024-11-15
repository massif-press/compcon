<template>
  <div>
    <section-header title="Skill Triggers">
      <section-edit-chip
        v-if="!pilot.IsRemote"
        :highlight="!pilot.SkillsController.HasFullSkills"
        :current="pilot.SkillsController.CurrentSkillPoints"
        :max="pilot.SkillsController.MaxSkillPoints"
        :label="`Edit Pilot Skill Triggers (${pilot.SkillsController.CurrentSkillPoints}/${pilot.SkillsController.MaxSkillPoints})`"
        @open-selector="($refs as any).skillSelector.show()" />
    </section-header>
    <cc-solo-dialog
      ref="skillSelector"
      icon="cc:skill"
      no-confirm
      title="Set Pilot Skill Triggers"
      fullscreen>
      <skill-selector :pilot="<Pilot>pilot" modal />
    </cc-solo-dialog>
    <v-row style="width: calc(100vw - 350px)" density="compact" class="my-2 pl-10">
      <v-col cols="12" md="auto" class="mr-2 text-center">
        <div class="stat-text">PILOT GRIT</div>
        <div class="heading h1 text-secondary" style="font-size: 80px; line-height: 50px">
          +{{ pilot.Grit }}
        </div>
      </v-col>
      <v-col>
        <no-data-block v-if="!pilot.SkillsController.Skills.length" />
        <cc-skill-item
          v-for="s in pilot.SkillsController.Skills"
          v-else
          :bonus="s.Bonus"
          :skill="s.Skill"
          pilot />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import SkillSelector from '@/features/pilot_management/_components/selectors/SkillSelector.vue';
import { Pilot } from '@/class';

export default {
  name: 'skill-block',
  components: { SectionEditChip, SectionHeader, NoDataBlock, SkillSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
