<template>
  <stepper-content :complete="canContinue()"
    :exit="`/pilot/${pilot.ID}`"
    back
    no-confirm
    @back="$emit('back')">
    <pilot-registration-card :pilot="pilot"
      :pilot-ready="pilotReady" />
    <cc-alert v-if="!pilotReady"
      color="error">
      <div class="stat-text">
        WARNING: Submission for IDENT record {{ pilot.ID }} has the following issue(s):
      </div>
      <ul class="flavor-text text-stark">
        <li v-if="!pilot.Callsign">PILOT CALLSIGN blank or invalid</li>
        <li v-if="!pilot.Name">PILOT NAME blank or invalid</li>
        <li v-if="!pilot.SkillsController.HasFullSkills">
          PILOT SKILL TRIGGERS incomplete or invalid
        </li>
        <li v-if="!pilot.TalentsController.HasFullTalents">PILOT TALENTS incomplete or invalid</li>
        <li v-if="!pilot.MechSkillsController.HasFullHASE">
          PILOT MECH SKILLS incomplete or invalid
        </li>
        <li v-if="!pilot.LicenseController.HasLicenses">PILOT LICENSES incomplete or invalid</li>
        <li v-if="!pilot.CoreBonusController.HasCBs">PILOT CORE BONUSES incomplete or invalid</li>
      </ul>
    </cc-alert>
    <cc-button block
      color="success"
      class="my-6"
      prepend-icon="cc:orbital"
      @click="savePilot()">
      Update Pilot Record // {{ pilot.Callsign }} ({{ pilot.Name }})
    </cc-button>
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotStore } from '@/stores'
import PilotRegistrationCard from '../../PilotSheet/components/PilotRegistrationCard.vue'
import StepperContent from '../../_components/StepperContent.vue'
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent'

const props = defineProps<{
  pilot: object
  original: object
}>()

defineEmits<{ 'back': [] }>()

const router = useRouter()

const pilotReady = computed(() =>
  (props.pilot as any).HasIdent &&
  (props.pilot as any).SkillsController.HasFullSkills &&
  (props.pilot as any).TalentsController.HasFullTalents &&
  (props.pilot as any).MechSkillsController.HasFullHASE
)

function canContinue() {
  const p = props.pilot as any
  return (
    p.Callsign && p.Name &&
    p.SkillsController.HasFullSkills &&
    p.TalentsController.HasFullTalents &&
    p.MechSkillsController.HasFullHASE &&
    p.LicenseController.HasLicenses &&
    p.CoreBonusController.HasCBs
  )
}

function savePilot() {
  const p = props.pilot as Pilot
  const originalIndex = PilotStore().Pilots.findIndex((pi) => pi.ID === p.ID)
  PilotStore().SetPilot(originalIndex, p)
  if (p.Level === 12) {
    AchievementEventSystem.emit('levelup_total', 12)
  }
  router.push({ name: 'pilot_sheet_redirect', params: { pilotID: p.ID } })
}
</script>
