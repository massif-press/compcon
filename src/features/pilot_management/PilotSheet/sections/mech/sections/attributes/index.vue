<template>
  <mech-statblock :mech="mech"
    :color="color">
    <template #prepend>
      <hase-pips :mech="mech"
        attr="hull"
        :val="pilot.MechSkillsController.MechSkills.Hull"
        :color="color" />
      <hase-pips :mech="mech"
        attr="agility"
        :val="pilot.MechSkillsController.MechSkills.Agi"
        :color="color" />
      <hase-pips :mech="mech"
        attr="systems"
        :val="pilot.MechSkillsController.MechSkills.Sys"
        :color="color" />
      <hase-pips :mech="mech"
        attr="engineering"
        :val="pilot.MechSkillsController.MechSkills.Eng"
        :color="color" />
      <div>
        <v-divider class="mt-2" />
        <span class="text-overline no-height">{{ $t('pm.sheet.systemPoints') }}</span>
        <v-tooltip>
          <template #activator="{ props }">
            <span v-bind="props"
              class="heading h3 no-height text-accent">
              &nbsp;{{ mech.MaxSP }}
            </span>
          </template>
          <div class="heading h4"
            v-text="`${mech.MaxSP} System Points`" />
          <v-divider />
          <p v-html-safe="mech.SPContributors.join('<br />')"
            class="py-2" />
        </v-tooltip>
      </div>
    </template>
  </mech-statblock>
</template>

<script setup lang="ts">
import { Pilot } from '@/classes/pilot/Pilot';
import HasePips from './HasePips.vue';
import MechStatblock from './MechStatblock.vue';
import { Mech } from '@/classes/mech/Mech';

defineProps({
  mech: {
    type: Mech,
    required: true,
  },
  pilot: {
    type: Pilot,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
})

</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
