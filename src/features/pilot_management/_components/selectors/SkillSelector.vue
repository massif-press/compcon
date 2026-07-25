<template>
  <cc-compendium-browser :items="baseSkills"
    item-type="Skill"
    :options="options"
    :active-ids="activeSkillIds"
    outline-selected
    view-key="sel-skill"
    page-scroll>
    <template #item="{ item }">
      <skill-select-item :skill="item"
        :bonus="pilot.SkillsController.GetSkill(item.ID)?.Bonus || 0"
        :can-add="pilot.SkillsController.CanAddSkill(item)"
        :can-remove="pilot.SkillsController.CanRemoveSkill(item)"
        @add="addSkill(item)"
        @remove="removeSkill(item)" />
    </template>

    <template #header>
      <div class="d-flex align-center">
        <div class="flex-grow-1">
          <cc-button size="x-small"
            :disabled="pilot.SkillsController.HasFullSkills"
            color="info"
            block
            prepend-icon="mdi-plus"
            @click="customDialog = true">
            {{ $t('classes.newSkillTrigger') }}
          </cc-button>
        </div>
        <selector-options-menu class="ml-1"
          :disabled="!pilot.SkillsController.Skills.length"
          @reset="resetSkills()" />
      </div>
    </template>

    <template #top>
      <selector-header :current="pilot.SkillsController.CurrentSkillPoints"
        :max="pilot.SkillsController.MaxSkillPoints"
        :complete="complete"
        :complete-text="$t('pm.selectors.skillSelectionComplete')">
        <selector-chip v-for="s in pilot.SkillsController.Skills"
          :key="s.Skill.ID"
          @remove="removeSkill(s.Skill)">
          {{ s.Skill.Trigger }}&nbsp;<b>+{{ s.Bonus }}</b>
        </selector-chip>
      </selector-header>
    </template>
  </cc-compendium-browser>

  <cc-dialog v-model="customDialog"
    max-width="60vw"
    :title="$t('classes.newSkillTrigger')"
    icon="cc:skill" :close-on-click="false" major>
    <div class="pa-3">
      <add-custom-skill :pilot="pilot"
        @add-custom="onAddCustom($event)" />
    </div>
  </cc-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CompendiumStore } from '@/stores'
import { Rules } from '@/classes/utility/Rules'
import { Pilot } from '@/classes/pilot/Pilot'
import AddCustomSkill from './components/_AddCustomSkill.vue'
import SkillSelectItem from './components/_SkillSelectItem.vue'
import SelectorHeader from './components/_SelectorHeader.vue'
import SelectorChip from './components/_SelectorChip.vue'
import SelectorOptionsMenu from './components/_SelectorOptionsMenu.vue'
import { filterByLcpConfig } from './useLcpFilter'

const props = defineProps<{ pilot: Pilot }>()

const emit = defineEmits<{ reset: [] }>()

const customDialog = ref(false)

const options = {
  views: ['list'],
  initialView: 'list',
  groups: ['none', 'lcp'],
  initialGroup: 'none',
  noSource: true,
}

const familyOrder = ['str', 'dex', 'int', 'cha']
const familyRank = (f: string) => (familyOrder.indexOf(f) + 1 || familyOrder.length + 1)
const customSkills = computed(() =>
  props.pilot.SkillsController.Skills.filter((s: any) => s.IsCustom).map((s: any) => s.Skill)
)
const baseSkills = computed(() =>
  [...filterByLcpConfig(CompendiumStore().Skills, props.pilot.LcpConfig), ...customSkills.value].sort(
    (a, b) => {
      const d = familyRank(a.Family) - familyRank(b.Family)
      return d !== 0 ? d : a.Name.localeCompare(b.Name)
    }
  )
)

const activeSkillIds = computed(() => props.pilot.SkillsController.Skills.map((s: any) => s.Skill.ID))

const complete = computed(
  () =>
    !props.pilot.SkillsController.IsMissingSkills &&
    props.pilot.SkillsController.Skills.length >= Rules.MinimumPilotSkills
)

function addSkill(skill: any) {
  if (props.pilot.SkillsController.CanAddSkill(skill)) props.pilot.SkillsController.AddSkill(skill)
}
function removeSkill(skill: any) {
  if (props.pilot.SkillsController.CanRemoveSkill(skill)) props.pilot.SkillsController.RemoveSkill(skill)
}
function resetSkills() {
  props.pilot.SkillsController.ClearSkills()
  emit('reset')
}
function onAddCustom(e: { skill: string; description: string; detail: string }) {
  props.pilot.SkillsController.AddCustomSkill(e)
  customDialog.value = false
}
</script>
