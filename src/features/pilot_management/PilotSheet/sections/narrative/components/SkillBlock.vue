<template>
  <div>
    <cc-title small color="pilot" style="margin-left: -40px !important">
      <section-edit-chip
        :highlight="!pilot.SkillsController.HasFullSkills"
        :current="pilot.SkillsController.CurrentSkillPoints"
        :max="pilot.SkillsController.MaxSkillPoints"
        :label="`Edit Pilot Skill Triggers (${pilot.SkillsController.CurrentSkillPoints}/${pilot.SkillsController.MaxSkillPoints})`"
        @open-selector="$refs.skillSelector.show()"
      />
      Skill Triggers
    </cc-title>
    <cc-solo-dialog
      ref="skillSelector"
      icon="cc:skill"
      no-confirm
      title="Set Pilot Skill Triggers"
      fullscreen
    >
      <cc-skill-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-row
      :style="$vuetify.display.lgAndUp ? `width: calc(100vw - 250px)` : ''"
      dense
      class="mt-2"
    >
      <v-col cols="12" md="auto" class="mr-2 text-center">
        <div class="stat-text">PILOT GRIT</div>
        <div
          class="heading h1 secondary--text"
          :style="
            $vuetify.display.lgAndUp
              ? 'font-size: 80px; line-height: 50px'
              : 'line-height: 30px'
          "
        >
          +{{ pilot.Grit }}
        </div>
      </v-col>
      <v-col>
        <no-data-block v-if="!pilot.SkillsController.Skills.length" />
        <cc-skill-item
          v-for="(s, i) in pilot.SkillsController.Skills"
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
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';

export default {
  name: 'skill-block',
  components: { SectionEditChip, NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
