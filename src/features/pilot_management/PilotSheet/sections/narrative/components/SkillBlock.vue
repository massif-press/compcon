<template>
  <div>
    <section-header title="Skill Triggers">
      <cc-modal title="Set Pilot Skill Triggers"
        icon="cc:skill">
        <template #activator="{ open }">
          <section-edit-chip v-if="!pilot.IsRemote"
            :highlight="!pilot.SkillsController.HasFullSkills"
            :current="pilot.SkillsController.CurrentSkillPoints"
            :max="pilot.SkillsController.MaxSkillPoints"
            :label="`Edit Pilot Skill Triggers (${pilot.SkillsController.CurrentSkillPoints}/${pilot.SkillsController.MaxSkillPoints})`"
            @open-selector="open" />
        </template>
        <skill-selector :pilot="<Pilot>pilot"
          modal />
      </cc-modal>
    </section-header>
    <div :style="!mobile && 'width: calc(100vw - 275px)'"
      dense
      class="my-2 px-4">
      <no-data-block v-if="!pilot.SkillsController.Skills.length" />
      <cc-skill-item v-for="s in pilot.SkillsController.Skills"
        v-else
        :key="s.Skill.ID"
        :bonus="s.Bonus"
        :skill="s.Skill"
        pilot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import SkillSelector from '@/features/pilot_management/_components/selectors/SkillSelector.vue';
import { Pilot } from '@/classes/pilot/Pilot'

defineProps({
  pilot: {
    type: Pilot,
    required: true,
  },
})

const { smAndDown: mobile } = useDisplay()
</script>
