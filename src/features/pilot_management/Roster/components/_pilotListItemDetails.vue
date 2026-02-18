<template>
  <div style="font-size: 14px"
    class="flavor-text">
    <div>
      <v-icon icon="cc:skill"
        start />
      <span v-if="!pilot.SkillsController.Skills.length"
        style="opacity: 0.6"
        v-text="`[ NO DATA ]`" />
      <span v-for="(s, i) in pilot.SkillsController.Skills">
        {{ s.Skill.Name }} {{ 'I'.repeat(s.Rank) }}
        <cc-slashes v-if="i < pilot.SkillsController.Skills.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div>

    <div>
      <v-icon icon="cc:talent"
        start />
      <span v-if="!pilot.TalentsController.Talents.length"
        style="opacity: 0.6"
        v-text="`[ NO DATA ]`" />
      <span v-for="(s, i) in pilot.TalentsController.Talents">
        {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
        <cc-slashes v-if="i < pilot.TalentsController.Talents.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div>

    <div v-if="pilot.CoreBonusController.CoreBonuses.length"
      cols="auto">
      <v-icon icon="cc:corebonus"
        start
        class="mt-n1" />
      <span v-for="(b, i) in pilot.CoreBonusController.CoreBonuses">
        {{ b.Name }}
        <cc-slashes v-if="i < pilot.CoreBonusController.CoreBonuses.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Pilot } from '@/class';

export default {
  name: 'pilot-list-item-details',
  props: {
    pilot: { type: Pilot, required: true }
  }
}
</script>