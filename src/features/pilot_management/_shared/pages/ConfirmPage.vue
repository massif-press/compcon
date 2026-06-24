<template>
  <stepper-content :complete="pilotComplete"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    no-confirm
    @back="$emit('back')">
    <pilot-registration-card :pilot="pilot"
      :pilot-ready="pilotReady" />
    <br v-if="context === 'new'" />
    <v-alert v-if="context === 'new' && !pilotReady"
      type="error"
      variant="outlined"
      tile>
      <span class="stat-text text-accent">
        {{ $t('pm.shared.warningSubmission', { id: pilot.ID }) }}:
      </span>
      <ul class="flavor-text text-error">
        <li v-if="!pilot.Callsign">
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          {{ $t('pm.shared.critical') }}
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          &nbsp;{{ $t('pm.shared.pilotCALLSIGNBlankOrInvalid') }}
        </li>
        <li v-if="!pilot.Name">
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          {{ $t('pm.shared.critical') }}
          <v-icon icon="mdi-alert" size="small" class="mx-n1" />
          &nbsp;{{ $t('pm.shared.pilotNAMEBlankOrInvalid') }}
        </li>
        <li v-if="!pilot.SkillsController.HasFullSkills">{{ $t('pm.shared.pilotSKILLTRIGGERSMissingOrIncomplete') }}</li>
        <li v-if="!pilot.TalentsController.HasFullTalents">{{ $t('pm.shared.pilotTALENTSMissingOrIncomplete') }}</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">{{ $t('pm.shared.pilotMECHSKILLSMissingOrIncomplete') }}</li>
        <li v-if="!pilot.LicenseController.HasLicenses">{{ $t('pm.shared.pilotLICENSEDATAMissingOrIncomplete') }}</li>
        <li v-if="!pilot.CoreBonusController.HasCBs">{{ $t('pm.shared.pilotCOREBONUSDATAMissingOr') }}</li>
      </ul>
    </v-alert>
    <cc-alert v-else-if="context === 'level' && !pilotReady"
      color="error">
      <div class="stat-text">
        {{ $t('pm.shared.warningSubmission', { id: pilot.ID }) }}:
      </div>
      <ul class="flavor-text text-stark">
        <li v-if="!pilot.Callsign">{{ $t('pm.shared.pilotCALLSIGNBlankOrInvalid') }}</li>
        <li v-if="!pilot.Name">{{ $t('pm.shared.pilotNAMEBlankOrInvalid') }}</li>
        <li v-if="!pilot.SkillsController.HasFullSkills">{{ $t('pm.shared.pilotSKILLTRIGGERSIncompleteOrInvalid') }}</li>
        <li v-if="!pilot.TalentsController.HasFullTalents">{{ $t('pm.shared.pilotTALENTSIncompleteOrInvalid') }}</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">{{ $t('pm.shared.pilotMECHSKILLSIncompleteOrInvalid') }}</li>
        <li v-if="!pilot.LicenseController.HasLicenses">{{ $t('pm.shared.pilotLICENSESIncompleteOrInvalid') }}</li>
        <li v-if="!pilot.CoreBonusController.HasCBs">{{ $t('pm.shared.pilotCOREBONUSESIncompleteOrInvalid') }}</li>
      </ul>
    </cc-alert>

    <cc-button block
      color="success"
      class="my-6"
      prepend-icon="cc:orbital"
      :disabled="context === 'new' && !pilotReady"
      @click="savePilot()">
      <span v-if="context === 'new'">
        {{ $t('pm.shared.registerNewPilot', { callsign: pilot.Callsign || default_callsign, name: pilot.Name || default_name }) }}
      </span>
      <span v-else>
        {{ $t('pm.shared.updatePilotRecord', { callsign: pilot.Callsign, name: pilot.Name }) }}
      </span>
    </cc-button>

    <div v-if="context === 'new' && !pilotReady"
      class="text-right">
      <div class="d-inline-block">
        <cc-button size="small"
          color="primary"
          :tooltip="$t('pm.tooltips.forcePilotRegistration')"
          :disabled="missingBasicInfo"
          @click="savePilot()">
          {{ $t('pm.shared.registrationOverride') }}
        </cc-button>
      </div>
    </div>
  </stepper-content>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotStore } from '@/stores'
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent'
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue'
import StepperContent from '../../_components/StepperContent.vue'

defineOptions({ name: 'confirm-page' })

const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
  groupID?: string
}>()

const emit = defineEmits<{ back: []; done: [] }>()

const router = useRouter()
const default_callsign = ref('[NEW CALLSIGN]')
const default_name = ref('New Pilot')

const pilotReady = computed(() => {
  const p = props.pilot as any
  return p.HasIdent && p.SkillsController.HasFullSkills && p.TalentsController.HasFullTalents && p.MechSkillsController.HasFullHASE
})

const pilotComplete = computed(() => {
  const p = props.pilot as any
  if (props.context === 'new') return pilotReady.value && p.LicenseController.HasLicenses && p.CoreBonusController.HasCBs
  return !!(p.Callsign && p.Name && p.SkillsController.HasFullSkills && p.TalentsController.HasFullTalents && p.MechSkillsController.HasFullHASE && p.LicenseController.HasLicenses && p.CoreBonusController.HasCBs)
})

const missingBasicInfo = computed(() => !(props.pilot as any).Callsign || !(props.pilot as any).Name)

function savePilot() {
  if (props.context === 'new') {
    const p = props.pilot as any
    p.Callsign = p.Callsign || default_callsign.value
    p.Name = p.Name || default_name.value
    PilotStore().AddPilot(p as Pilot, props.groupID)
    if (p.isTemplate) AchievementEventSystem.emit('add_template_pilot')
    AchievementEventSystem.emit('add_pilot')
    emit('done')
  } else {
    const p = props.pilot as Pilot
    const originalIndex = PilotStore().Pilots.findIndex((pi) => pi.ID === p.ID)
    PilotStore().SetPilot(originalIndex, p)
    if (p.Level === 12) AchievementEventSystem.emit('levelup_total', 12)
    router.push({ name: 'pilot_sheet_redirect', params: { pilotID: p.ID } })
  }
}
</script>
