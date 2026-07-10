<template>
  <v-container fluid>
    <v-row justify="space-around"
      align="center">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div class="font-weight-light text-center my-n2"
          style="letter-spacing: calc(5px + 2cqw); font-size: calc(20px + 2cqw)">
          {{ $t('common.activeMode') }}
        </div>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row class="mt-1"
      :class="!mobile && 'px-5'"
      justify="space-around">
      <v-col v-for="(list, i) in lists"
        :key="`list-${i}`"
        cols="12"
        lg="">
        <v-card variant="tonal"
          height="100%"
          :class="!mobile && 'px-6'"
          flat
          tile>
          <v-list height="100%"
            class="pt-0"
            flat
            tile>
            <v-list-item class="text-center">
              <v-icon :icon="headers[i].icon"
                size="20vw" />
              <v-list-item-title class="heading h2"
                :class="headers[i].subtitle ? 'text-grey' : 'text-accent'"
                v-text="headers[i].title" />
              <v-list-item-subtitle v-if="headers[i].subtitle"
                v-text="headers[i].subtitle"
                class="text-cc-overline my-n1" />
            </v-list-item>
            <div v-for="(e, index) in list"
              :key="`entry-${index}`">
              <v-list-item v-if="!e.small"
                lines="two"
                :key="e.title"
                :title="e.title"
                :class="e.disabled ? 'bg-panel' : 'bg-primary'"
                density="compact"
                class="my-1"
                :disabled="e.disabled"
                :subtitle="e.subtitle"
                :to="e.to">
                <template #prepend>
                  <v-avatar>
                    <v-icon size="x-large"
                      :icon="e.icon" />
                  </v-avatar>
                </template>
              </v-list-item>
              <div v-else>
                <v-btn v-if="(e as any).id === 'last-local' && lastLocalEncounter"
                  block
                  size="small"
                  tile
                  color="accent"
                  flat
                  @click="loadLastLocalEncounter()">
                  <v-icon :icon="e.icon"
                    start />
                  {{ $t('active.landing.resumeRound', {
                    name: lastLocalEncounter.Encounter.Name, n:
                  lastLocalEncounter.Round }) }}
                </v-btn>
                <v-btn v-else-if="(e as any).id === 'last-sheet' && lastLocalSheet"
                  block
                  size="small"
                  tile
                  color="accent"
                  flat
                  @click="loadLastLocalSheet()">
                  <v-icon :icon="e.icon"
                    start />
                  {{ $t('active.landing.resumeRound', {
                    name: lastLocalSheet.Combatant.actor.Name,
                    n:
                      lastLocalSheet.Combatant.actor.CombatController.Round }) }}
                </v-btn>
                <v-btn v-else
                  block
                  size="small"
                  tile
                  flat
                  color="gray"
                  disabled
                  :prepend-icon="e.icon"
                  :to="e.to"
                  class="my-1">
                  {{ e.subtitle }}
                </v-btn>
              </div>
            </div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { EncounterStore, PilotSheetStore } from '@/stores';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()

const _display = useDisplay()

const headers = ref([
  {
    icon: 'cc:lancer',
    title: t('common.gameName'),
  },
  {
    icon: 'cc:nhp',
    title: t('active.titles.gameMaster'),
  },
  {
    icon: 'cc:diasporan',
    title: t('active.titles.observer'),
    subtitle: t('active.subtitles.inDevelopmentReleaseV32'),
  },
])
const lists = ref([
  [
    {
      title: t('active.titles.activeCharacterSheets'),
      subtitle: t('active.subtitles.createManageAndRunActivePlayer'),
      icon: 'cc:pilot',
      to: '/active-mode/sheet-manager',
    },
    {
      id: 'last-sheet',
      small: true,
      subtitle: t('active.subtitles.resumeLast'),
      icon: 'mdi-restart',
      to: '',
    },
    {
      title: t('active.titles.joinAnOnlineTable'),
      subtitle: t('active.subtitles.featureInDevelopmentV32'),
      disabled: true,
      icon: 'cc:squad',
      to: '',
    },
  ],
  [
    {
      title: t('active.titles.localEncounters'),
      subtitle: t('active.subtitles.createManageAndRunLocalEncounters'),
      icon: 'cc:encounter',
      to: '/active-mode/manage-encounters',
    },
    {
      id: 'last-local',
      small: true,
      subtitle: t('active.subtitles.resumeLast'),
      icon: 'mdi-restart',
      to: '',
    },
    {
      title: t('active.titles.localCampaigns'),
      subtitle: t('active.subtitles.featureInDevelopmentV31'),
      disabled: true,
      icon: 'cc:campaign',
      to: '',
    },
    {
      title: t('active.titles.hostAnOnlineTable'),
      subtitle: t('active.subtitles.featureInDevelopmentV32'),
      disabled: true,
      icon: 'mdi-lan',
      to: '',
    },
  ],
  [
    {
      title: t('active.titles.spectatorMode'),
      subtitle: t('active.subtitles.featureInDevelopmentV32'),
      disabled: true,
      icon: 'mdi-monitor-share',
      to: '',
    },
    {
      small: true,
      subtitle: t('active.subtitles.resumeLast'),
      icon: 'mdi-restart',
      to: '',
    },
    {
      title: t('active.titles.campaignDisplay'),
      subtitle: t('active.subtitles.featureInDevelopmentV32'),
      disabled: true,
      icon: 'mdi-monitor-dashboard',
      to: '',
    },
  ],
])

const mobile = computed(() => {
  return _display.mdAndDown.value;
})
const lastLocalEncounter = computed(() => {
  return EncounterStore().getActiveEncounter(EncounterStore().CurrentActiveID);
})
const lastLocalSheet = computed(() => {
  return PilotSheetStore().GetSheet(PilotSheetStore().CurrentActiveID);
})

function loadLastLocalEncounter() {
  if (lastLocalEncounter.value) {
    router.push(`active-mode/gm-encounter-runner/${lastLocalEncounter.value.ID}`);
  }
}
function loadLastLocalSheet() {
  if ((lastLocalSheet.value)) {
    router.push(`active-mode/pilot-runner/${lastLocalSheet.value.ID}`);
  }
}
</script>
