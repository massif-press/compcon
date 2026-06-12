<template>
  <cc-confirm ref="confirm" />
  <cc-tabs ref="tabs"
    fixed>
    <template #tabs>
      <v-tab value="ident">
        <v-icon v-show="pilot.HasIdent"
          icon="mdi-check" />
        {{ $t('pm.new.identification') }}
      </v-tab>
      <v-tab value="skills">
        <v-icon v-show="pilot.SkillsController.HasFullSkills"
          icon="mdi-check" />
        {{ $t('pm.level.skills') }}
      </v-tab>
      <v-tab value="talents">
        <v-icon v-show="pilot.TalentsController.HasFullTalents"
          icon="mdi-check" />
        {{ $t('pm.level.talents') }}
      </v-tab>
      <v-tab value="mechskills">
        <v-icon v-show="pilot.MechSkillsController.HasFullHASE"
          icon="mdi-check" />
        {{ $t('pm.level.mechSkills') }}
      </v-tab>
      <v-slide-x-transition mode="out-in">
        <v-tab v-if="pilot.Level > 0"
          value="licenses">
          <v-icon v-show="pilot.LicenseController.HasLicenses"
            icon="mdi-check" />
          {{ $t('compendium.categories.licenses') }}
        </v-tab>
      </v-slide-x-transition>
      <v-slide-x-transition mode="out-in">
        <v-tab v-if="pilot.Level > 2"
          value="corebonuses">
          <v-icon v-show="pilot.CoreBonusController.HasCBs"
            icon="mdi-check" />
          {{ $t('compendium.categories.coreBonuses') }}
        </v-tab>
      </v-slide-x-transition>
      <v-tab value="confirm">{{ $t('common.confirm') }}</v-tab>
    </template>
    <v-container>
      <template #default>
        <v-window-item :key="0"
          value="ident">
          <identification-page :pilot="pilot"
            :group-i-d="groupID"
            @done="onDone()"
            @next="step = 'skills'"
            @templates="step = 'templates'"
            @set="pilot[$event.attr] = $event.val" />
        </v-window-item>
        <v-window-item :key="1"
          value="skills">
          <skills-page :pilot="pilot"
            context="new"
            @next="step = 'talents'"
            @back="step = 'ident'" />
        </v-window-item>
        <v-window-item :key="2"
          value="talents">
          <talents-page :pilot="pilot"
            context="new"
            @next="step = 'mechskills'"
            @back="step = 'skills'" />
        </v-window-item>
        <v-window-item :key="3"
          value="mechskills">
          <mech-skills-page :pilot="pilot"
            context="new"
            @next="step = pilot.Level > 0 ? 'licenses' : 'confirm'"
            @back="step = 'talents'" />
        </v-window-item>
        <v-window-item :key="4"
          value="licenses">
          <licenses-page :pilot="pilot"
            context="new"
            @next="step = pilot.Level > 2 ? 'corebonuses' : 'confirm'"
            @back="step = 'mechskills'" />
        </v-window-item>
        <v-window-item :key="5"
          value="corebonuses">
          <core-bonuses-page :pilot="pilot"
            context="new"
            @next="step = 'confirm'"
            @back="step = 'licenses'" />
        </v-window-item>
        <v-window-item :key="6"
          value="confirm">
          <confirm-page :pilot="pilot"
            context="new"
            :group-i-d="groupID"
            @back="pilot.Level < 2 ? 'corebonuses' : pilot.Level > 0 ? 'licenses' : 'mechskills'"
            @done="onDone()" />
        </v-window-item>
        <v-window-item :key="7"
          value="templates">
          <templates-page :pilot="pilot"
            @next="step = 'confirm'"
            @back="step = 'ident'" />
        </v-window-item>
      </template>
    </v-container>
  </cc-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import IdentificationPage from './pages/IdentificationPage.vue';
import SkillsPage from '../_shared/pages/SkillsPage.vue';
import TalentsPage from '../_shared/pages/TalentsPage.vue';
import MechSkillsPage from '../_shared/pages/MechSkillsPage.vue';
import LicensesPage from '../_shared/pages/LicensePage.vue';
import CoreBonusesPage from '../_shared/pages/CoreBonusPage.vue';
import ConfirmPage from '../_shared/pages/ConfirmPage.vue';
import TemplatesPage from './pages/TemplatesPage.vue';
import { Pilot } from '@/classes/pilot/Pilot'
import CcConfirm from '@/ui/notification/CCConfirm.vue';
import logger from '@/user/logger';
import { PilotStore } from '../store';
import { RemoveItem } from '@/io/Storage';
const router = useRouter()

defineOptions({ name: 'NewPilotWizard' })

const props = withDefaults(defineProps<{
  groupID?: string
}>(), {
  groupID: 'no_group'
})

const confirm = ref<any>(null)
const tabs = ref<any>(null)

const step = ref('ident')
const pilot = ref({} as Pilot)
const done = ref(false)

pilot.value = new Pilot();

function onDone() {
      done.value = true;
      router.push(`/pilot/${pilot.value.ID}`);
    }
</script>
