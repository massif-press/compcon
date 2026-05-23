<template>
  <div style="font-size: 14px"
    class="flavor-text">
    <!-- <div>
      <v-icon icon="cc:skill"
        start />
      <span v-if="!pilot.SkillsController.Skills.length"
        style="opacity: 0.6"
        v-text="`[ NO DATA ]`" />
      <span v-for="(s, i) in pilot.SkillsController.Skills"
        :key="s.Skill.ID">
        {{ s.Skill.Name }} {{ 'I'.repeat(s.Rank) }}
        <cc-slashes v-if="Number(i) < pilot.SkillsController.Skills.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div> -->

    <div style="margin-bottom: 2px;">
      <v-icon icon="cc:talent"
        start />
      <span v-if="!pilot.TalentsController.Talents.length"
        style="opacity: 0.6"
        v-text="`[ NO DATA ]`" />
      <span v-for="(s, i) in pilot.TalentsController.Talents"
        :key="s.Talent.ID">
        {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
        <cc-slashes v-if="Number(i) < pilot.TalentsController.Talents.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div>

    <div v-if="pilot.CoreBonusController.CoreBonuses.length"
      style="margin-bottom: 2px;">
      <v-icon icon="cc:corebonus"
        start
        class="mt-n1" />
      <span v-for="(b, i) in pilot.CoreBonusController.CoreBonuses"
        :key="b.ID">
        {{ b.Name }}
        <cc-slashes v-if="Number(i) < pilot.CoreBonusController.CoreBonuses.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div>

    <div v-if="pilot.Mechs.length">
      <v-icon icon="cc:frame"
        start
        class="mt-n1" />

      <span v-for="(b, i) in sortedMechs"
        :key="b.ID"
        :class="`${b.ID === pilot.FavoriteMech?.ID ? 'font-weight-bold text-stark' : ''}`">
        {{ b.Name }} ({{ b.Frame.Source }} {{ b.Frame.Name }})
        <cc-slashes v-if="Number(i) < sortedMechs.length - 1"
          class="pr-3"
          style="opacity: 0.4" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ pilot: any }>()

const sortedMechs = computed<any[]>(() =>
  props.pilot.Mechs.slice().sort((a, b) =>
    props.pilot.FavoriteMech?.ID === a.ID ? -1 : props.pilot.FavoriteMech?.ID === b.ID ? 1 : 0
  )
)
</script>
