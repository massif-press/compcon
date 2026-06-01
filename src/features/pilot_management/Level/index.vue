<template>
  <cc-tabs ref="tabs"
    fixed>
    <template #tabs>
      <v-tab>
        <v-icon v-if="step > 1"
          start
          icon="mdi-check" />
        Overview
      </v-tab>
      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.SkillsController.HasFullSkills"
          start
          icon="mdi-check" />
        Skills
      </v-tab>
      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.TalentsController.HasFullTalents"
          start
          icon="mdi-check" />
        Talents
      </v-tab>
      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.MechSkillsController.HasFullHASE"
          start
          icon="mdi-check" />
        Mech Skills
      </v-tab>
      <v-divider />

      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.LicenseController.HasLicenses"
          start
          icon="mdi-check" />
        Licenses
      </v-tab>
      <v-divider />

      <v-divider />
      <v-tab>
        <v-icon v-if="pilot.CoreBonusController.HasCBs"
          start
          icon="mdi-check" />
        CORE Bonuses
      </v-tab>
      <v-divider />
      <v-tab>Confirm</v-tab>
    </template>
    <v-container>
      <template #default>
        <v-window-item>
          <overview-page :pilot="pilot"
            :cb-eligible="cbEligible"
            @next="setStep(1)" />
        </v-window-item>
        <v-window-item>
          <skills-page :pilot="pilot"
            context="level"
            @next="setStep(2)"
            @back="setStep(0)" />
        </v-window-item>
        <v-window-item>
          <talents-page :pilot="pilot"
            context="level"
            @next="setStep(3)"
            @back="setStep(1)" />
        </v-window-item>
        <v-window-item>
          <mech-skills-page :pilot="pilot"
            context="level"
            @next="setStep(4)"
            @back="setStep(2)" />
        </v-window-item>
        <v-window-item>
          <license-page :pilot="pilot"
            context="level"
            @next="setStep(5)"
            @back="setStep(3)" />
        </v-window-item>
        <v-window-item>
          <core-bonus-page :pilot="pilot"
            context="level"
            :cb-eligible="cbEligible"
            @next="setStep(6)"
            @back="setStep(4)" />
        </v-window-item>
        <v-window-item>
          <confirm-page :pilot="pilot"
            context="level"
            @back="setStep(5)" />
        </v-window-item>
      </template>
    </v-container>
  </cc-tabs>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import OverviewPage from './pages/OverviewPage.vue';
import SkillsPage from '../_shared/pages/SkillsPage.vue';
import TalentsPage from '../_shared/pages/TalentsPage.vue';
import MechSkillsPage from '../_shared/pages/MechSkillsPage.vue';
import LicensePage from '../_shared/pages/LicensePage.vue';
import CoreBonusPage from '../_shared/pages/CoreBonusPage.vue';
import ConfirmPage from '../_shared/pages/ConfirmPage.vue';
import { PilotStore } from '@/stores';
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'level-wizard' })

const route = useRoute()

const props = defineProps<{
  pilotID: string
}>()

const tabs = ref<any>(null)

const step = ref(1)
const pilot = ref({} as Pilot)
const cbEligible = ref(false)

const currentPilot = computed(() => {
      return PilotStore().Pilots.find((p) => p.ID === props.pilotID) as Pilot;
    })

pilot.value = Pilot.Deserialize(Pilot.Serialize(currentPilot.value));
pilot.value.Level++;
cbEligible.value = pilot.value.CoreBonusController.IsMissingCBs;

function setTab(tab: number) {
      step.value = tab;
    }
function setStep(n: number) {
      step.value = n;
      tabs.value.setTab(n);
    }
</script>
