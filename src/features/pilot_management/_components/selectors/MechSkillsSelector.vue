<template>
  <v-card-text>
    <div class="mb-4">
      <cc-alert :color="pilot.MechSkillsController.IsMissingHASE ? 'warning' : 'success'"
        class="stat-text text-center">
        {{ pilot.MechSkillsController.CurrentHASEPoints }}/{{
          pilot.MechSkillsController.MaxHASEPoints
        }}
        {{ $t('pm.selectors.mechSkillsSelected') }}
      </cc-alert>
      <div class="text-right">
        <selector-options-menu :label="$t('pm.selectors.resetMechSkills')"
          :disabled="!pilot.MechSkillsController.CurrentHASEPoints"
          @reset="pilot.MechSkillsController.Reset()" />
      </div>
    </div>

    <v-row align="center">
      <v-col v-for="s in skills"
        :key="`skill_col_${s.text}`"
        cols="12"
        md="6"
        class="mb-6">
        <div class="heading h3 text-accent">
          {{ s.text }}
        </div>
        <p v-html-safe="s.description"
          class="flavor-text px-2 mb-3" />
        <v-row no-gutters
          justify="center"
          align="start">
          <v-col style="max-width: 500px">
            <cc-tickbar :model-value="pilot.MechSkillsController[s.val]"
              :icon="mobile ? undefined : s.icon"
              :size="mobile ? 'small' : 'default'"
              color="accent"
              controls
              :stop-add="pilot.MechSkillsController.HasFullHASE"
              :max="6"
              @update:model-value="pilot.MechSkillsController[s.val] = $event" />
          </v-col>
        </v-row>
        <div class="text-center py-2">
          <span v-for="(b, i) in s.bonuses"
            :key="`bonus_${s.val}_${i}`"
            class="heading h3">
            {{ b.text }}
            <span class="text-accent">+{{ b.value }}</span>
            <cc-slashes v-if="s.bonuses.length > i + 1"
              class="mx-2" />
          </span>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { Pilot } from '@/classes/pilot/Pilot'
import SelectorOptionsMenu from './components/_SelectorOptionsMenu.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps<{ pilot: Pilot }>()

const { smAndDown: mobile } = useDisplay()

const skills = computed(() => [
  {
    val: 'Hull',
    icon: 'mdi-alpha-h-box-outline',
    text: t('pm.tooltips.hull'),
    description: t('pm.subtitles.yourHullSkillDescribesYourAbility'),
    bonuses: [
      { text: t('pm.tooltips.mechHp'), value: props.pilot.MechSkillsController.MechSkills.Hull * 2 },
      { text: t('pm.tooltips.repairCapacity'), value: Math.floor(props.pilot.MechSkillsController.MechSkills.Hull / 2) },
    ],
  },
  {
    val: 'Agi',
    icon: 'mdi-alpha-a-box-outline',
    text: t('stats.agility'),
    description: t('pm.subtitles.yourAgilitySkillDescribesYourAbility'),
    bonuses: [
      { text: t('pm.tooltips.evasion'), value: props.pilot.MechSkillsController.MechSkills.Agi },
      { text: t('pm.tooltips.speed'), value: Math.floor(props.pilot.MechSkillsController.MechSkills.Agi / 2) },
    ],
  },
  {
    val: 'Sys',
    icon: 'mdi-alpha-s-box-outline',
    text: t('stats.systems'),
    description: t('pm.subtitles.yourSystemsSkillDescribesYourAbility'),
    bonuses: [
      { text: t('pm.tooltips.electronicDefense'), value: props.pilot.MechSkillsController.MechSkills.Sys },
      { text: t('pm.tooltips.techAttack'), value: props.pilot.MechSkillsController.MechSkills.Sys },
      { text: t('stats.sp'), value: Math.floor(props.pilot.MechSkillsController.MechSkills.Sys / 2) },
    ],
  },
  {
    val: 'Eng',
    icon: 'mdi-alpha-e-box-outline',
    text: t('stats.engineering'),
    description: t('pm.subtitles.yourEngineeringSkillDescribesYourAbility'),
    bonuses: [
      { text: t('pm.tooltips.heatCapacity'), value: props.pilot.MechSkillsController.MechSkills.Eng },
      { text: t('pm.tooltips.limitedSystemsBonus'), value: Math.floor(props.pilot.MechSkillsController.MechSkills.Eng / 2) },
    ],
  },
])

watch(() => props.pilot.MechSkillsController.IsMissingHASE, (newVal) => {
  if (newVal === false) window.scrollTo(0, document.body.scrollHeight)
})

watch(() => props.pilot.MechSkillsController.CurrentHASEPoints, () => {
  props.pilot.SaveController.save()
})

function calcMax(skill: any) {
  return (
    props.pilot.MechSkillsController.MaxHASEPoints -
    props.pilot.MechSkillsController.CurrentHASEPoints +
    props.pilot.MechSkillsController.MechSkills[skill.val]
  )
}
</script>

<style scoped>
.bonus-text {
  position: relative;
  bottom: 20px;
}
</style>
