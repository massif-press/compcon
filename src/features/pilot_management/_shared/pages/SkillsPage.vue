<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? $t('common.pilotSkillTriggers') : $t('pm.shared.improveSkillTriggers') }}</cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      {{ $t('pm.new.uadIDENTService') }}
      <cc-slashes />
      {{ $t('pm.shared.rm4bPilotSelfAssessment1') }}
    </div>
    <div v-else
      class="heading h2">
      {{ $t('pm.level.mv2LicenseAcquisitionRequest') }}
      <cc-slashes />
      &nbsp;{{ $t('pm.shared.mv2ASkillImprovementAssessment') }}
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.shared.theRM4bPILOTSELFASSESSMENT2') }}
      <br />
      <b>{{ $t('pm.shared.nb') }}</b>
      {{ $t('pm.shared.theFollowingFormIsComprisedOf') }}
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      {{ $t('pm.shared.theMV2APilotSelfAssessment') }}
      <br />
      <b>{{ $t('pm.shared.nb') }}</b>
      {{ $t('pm.shared.theFollowingFormIsComprisedOf') }}
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new' ? $t('pm.shared.selectSkillTriggers', { word, count }) : $t('pm.shared.addOrImproveSkill') }}
      </div>
      <p class="text-cc-overline">
        {{ $t('pm.new.bySubmittingThisFormYouAttest') }}
      </p>
    </v-alert>

    <v-scroll-y-reverse-transition v-if="context === 'new'">
      <cc-alert v-if="pilot.Background && !pilot.SkillsController.HasFullSkills"
        class="my-2"
        icon="mdi-orbit"
        :title="$t('pm.titles.skillSuggestionsAvailable')">
        <p class="text-cc-overline text-disabled">
          {{ $t('pm.shared.identSERVICEPRIMARYHasGeneratedA') }}
        </p>
        <div class="mx-3 mt-2">
          <cc-button size="small"
            :color="suggestedSet ? 'success' : 'accent'"
            block
            prepend-icon="mdi-auto-mode"
            :append-icon="suggestedSet ? 'mdi-check' : undefined"
            @click="setSuggestedSkills()">
            {{ suggestedSet ? $t('pm.shared.suggestedSkillsAdded') : $t('pm.shared.addSuggestedSkills') }}
          </cc-button>
        </div>
      </cc-alert>
    </v-scroll-y-reverse-transition>

    <skill-selector flat
      :level-up="context === 'level'"
      :pilot="<Pilot>pilot"
      @reset="suggestedSet = false" />
  </stepper-content>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores'
import StepperContent from '../../_components/StepperContent.vue'
import SkillSelector from '../../_components/selectors/SkillSelector.vue'
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'skills-page' })

const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
}>()

const emit = defineEmits<{ back: []; next: [] }>()

const suggestedSet = ref(false)

const canContinue = computed(() => !(props.pilot as any).SkillsController.IsMissingSkills)
const count = computed(() => (props.pilot as any).SkillsController.MaxSkillPoints)
const word = computed(() => {
  const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen']
  return words[count.value] ?? count.value
})

function setSuggestedSkills() {
  const bgItem = CompendiumStore().Backgrounds.find(
    (b) => b.Name.toLowerCase() === (props.pilot as any).Background.toLowerCase()
  )
  if (!bgItem || !bgItem.SuggestedSkills?.length) return
  if (suggestedSet.value) {
    bgItem.SuggestedSkills.forEach((skill) => (props.pilot as any).SkillsController.RemoveSkill(skill))
    suggestedSet.value = false
    return
  }
  ;(props.pilot as any).SkillsController.ClearSkills()
  bgItem.SuggestedSkills.forEach((skill) => (props.pilot as any).SkillsController.AddSkill(skill))
  suggestedSet.value = true
}
</script>
