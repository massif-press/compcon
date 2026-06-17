<template>
  <selector :title="$t('common.pilotSkillTriggers')"
    :success="!pilot.SkillsController.IsMissingSkills && enoughSelections"
    :flat="flat"
    :modal="modal"
    :selected="pilot.SkillsController.CurrentSkillPoints"
    :total="pilot.SkillsController.MaxSkillPoints">
    <template #float>
      <v-card v-if="!pilot.SkillsController.IsMissingSkills && enoughSelections"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="$t('pm.selectors.skillSelectionComplete')" />
      <v-card
        v-if="pilot.SkillsController.MaxSkillPoints > pilot.SkillsController.CurrentSkillPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="`${pilot.SkillsController.MaxSkillPoints - pilot.SkillsController.CurrentSkillPoints}
            Skill Points remaining`
          " />

      <cc-button variant="text"
        size="x-small"
        block
        :disabled="!pilot.SkillsController.Skills.length"
        @click="resetSkills()">
        {{ $t('common.reset') }}
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select v-model="jump"
          :label="$t('pm.fields.jumpTo')"
          color="primary"
          variant="outlined"
          :items="jumpItems" />
      </div>
    </template>

    <template #right-column>
      <div v-for="h in headers"
        :key="`header_${h.attr}`"
        class="mb-4">
        <div v-if="h.attr !== 'Custom'"
          class="text-cc-overline">
          {{ $t('pm.selectors.yourAbilityTo') }}
        </div>
        <div v-if="mobile"
          class="text-cc-overline text-accent mb-2">
          {{ h.description }}
        </div>
        <cc-title v-else
          class="py-1 mb-2">
          {{ h.description }}
        </cc-title>
        <skill-select-item v-for="s in skills[h.attr]"
          :id="`skill_${s.ID}`"
          :key="`skill_${s.ID}`"
          :skill="s"
          :bonus="pilot.SkillsController.GetSkill(s.ID)?.Bonus || 0"
          :can-add="pilot.SkillsController.CanAddSkill(s)"
          :can-remove="pilot.SkillsController.CanRemoveSkill(s)"
          @add="pilot.SkillsController.AddSkill(s)"
          @remove="pilot.SkillsController.RemoveSkill(s)" />
      </div>
      <add-custom-skill :pilot="pilot"
        @add-custom="pilot.SkillsController.AddCustomSkill($event)" />
      <div style="height: 12px" />
    </template>
  </selector>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { groupBy } from 'lodash-es'
import { CompendiumStore } from '@/stores'
import { Rules } from '@/classes/utility/Rules'
import { Pilot } from '@/classes/pilot/Pilot'
import { rules } from '@massif/lancer-data'
import logger from '@/user/logger'
import SkillSelectItem from './components/_SkillSelectItem.vue'
import AddCustomSkill from './components/_AddCustomSkill.vue'
import Selector from './components/_SelectorBase.vue'

const props = withDefaults(defineProps<{
  pilot: Pilot
  levelUp?: boolean
  modal?: boolean
  flat?: boolean
}>(), { levelUp: false, modal: false, flat: false })

const emit = defineEmits<{ reset: [] }>()

const { smAndDown: mobile } = useDisplay()

const jump = ref('')

const headers = computed(() => rules.skill_headers)

const baseSkills = computed(() => {
  if (!props.pilot.LcpConfig) return CompendiumStore().Skills
  return CompendiumStore().Skills.filter(
    x =>
      !x.InLcp ||
      props.pilot.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
      props.pilot.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
  )
})

const staticSkills = computed(() => groupBy(baseSkills.value, 'Family'))
const flatSkills = computed(() => baseSkills.value)

const skills = computed(() => {
  const cs = props.pilot.SkillsController.Skills.filter((x: any) => x.IsCustom)
  if (cs.length) return { ...staticSkills.value, Custom: cs.map((x: any) => x.Skill) }
  return staticSkills.value
})

const selectedMin = computed(() => Rules.MinimumPilotSkills)
const enoughSelections = computed(() => !(props.pilot.SkillsController.Skills.length < selectedMin.value))

const jumpItems = computed(() => [
  ...props.pilot.SkillsController.Skills.map((x: any) => ({
    title: x.Skill.Trigger,
    value: x.Skill.ID,
    subtitle: `// Pilot Rank: ${x.Rank} (+${x.Bonus})`,
  })),
  ...flatSkills.value
    .filter(x => !props.pilot.SkillsController.Skills.find(y => y.Skill.ID === x.ID))
    .map(x => ({ title: x.Trigger, value: x.ID })),
])

watch(jump, (val) => scroll(val))

function scrollTo(e: string): void {
  const el = document.getElementById(e)
  if (!el) {
    logger.warn(`Element with ID ${e} not found`, null)
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function scroll(id: string) {
  scrollTo(`skill_${id}`)
}

function resetSkills() {
  props.pilot.SkillsController.ClearSkills()
  emit('reset')
}
</script>
