<template>
  <v-card-text>
    <div class="text-center body-text light-panel mb-4"
      style="border-radius: 3px">
      {{ $t('pm.sheet.duplicatingOrCloningAPilotWill') }}
    </div>

    <v-row justify="space-around">
      <v-col cols="12"
        md="6">
        <cc-button prepend-icon="mdi-content-copy"
          details="test"
          block
          color="primary"
          :tooltip="$t('pm.tooltips.thisWillCreateACopy')"
          @click="copyPilot">
          {{ $t('pm.sheet.duplicatePilot') }}
        </cc-button>
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-button prepend-icon="mdi-dna"
          large
          block
          color="primary"
          :tooltip="$t('pm.tooltips.thisWillCloneTheSelected')"
          :disabled="!!quirk"
          @click="rollQuirk">
          {{ $t('pm.sheet.flashClonePilot') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-scale-transition>
      <div v-if="quirk">
        <cc-alert color="deep-orange"
          variant="tonal"
          class="my-4">
          <div class="text-center heading h3 mb-2">
            <v-icon size="small"
              class="pb-1"
              start
              icon="mdi-alert" />
            <b style="letter-spacing: 15px">{{ $t('common.warning') }}</b>
            <v-icon size="small"
              class="pb-1"
              icon="mdi-alert" />
          </div>
          <div class="text-cc-overline"
            :class="!mobile && 'px-2'">
            {{ $t('pm.sheet.anyOrganizationsIndividualsOrTechnologiesEngaging') }}
            <ul class="pb-1">
              <li>
                {{ $t('pm.sheet.reproductionOfTheSubjectivePersonageOf') }}
              </li>
              <li>
                {{ $t('pm.sheet.transferOrTheSubjectivePersonageOf') }}
              </li>
              <li>
                {{ $t('pm.sheet.emulationOfASentientIndividualS') }}
              </li>
              <li>
                {{ $t('pm.sheet.intentionalDecorporealizationOfASentientBeing') }}
              </li>
              <li>
                {{ $t('pm.sheet.engagingInAnyActivityThatCould') }}
              </li>
            </ul>
            <v-divider class="pb-1" />
            <div class="text-center">
              {{ $t('pm.sheet.allFormsOfWholeSubjectivityRapid') }}
            </div>
          </div>
        </cc-alert>

        <v-row align="center"
          justify="center">
          <v-col cols="12"
            md="8">
            <div class="text-overline">{{ $t('pm.sheet.cloneQUIRK') }}</div>
            <cc-alert density="compact"
              color="primary">
              <v-card-text :class="mobile && 'px-0'">
                {{ quirk }}
              </v-card-text>
            </cc-alert>
          </v-col>
          <v-col cols="auto">
            <cc-button v-if="!mobile"
              icon="mdi-dice-6"
              variant="outlined"
              :tooltip="$t('pm.tooltips.rerollQuirk')"
              @click="rollQuirk" />
            <cc-button v-else
              prepend-icon="mdi-dice-6"
              @click="rollQuirk">{{ $t('pm.sheet.rerollQuirk') }}</cc-button>
          </v-col>
        </v-row>

        <v-row v-if="quirk"
          align="center"
          justify="center">
          <v-col cols="12"
            md="8">
            <cc-button large
              block
              tile
              color="secondary"
              @click="clonePilot">
              {{ $t('pm.sheet.decantFlashClone') }}
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </v-scale-transition>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CompendiumStore, PilotStore } from '@/stores';
import * as _ from 'lodash-es';
import { Pilot } from '@/classes/pilot/Pilot'
import { useDisplay } from 'vuetify';
const router = useRouter()

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  pilot: Pilot
}>()

const emit = defineEmits<{
  'close': []
}>()

const quirk = ref(null)

function show() {
      (dialog.value as any).show();
    }
function hide() {
      quirk.value = null;
      emit('close');
    }
function rollQuirk() {
      const compendium = CompendiumStore();
      quirk.value = _.sample(compendium.Lists.quirks);
    }
function clonePilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(props.pilot as Pilot));
      newPilot.RenewID();
      props.pilot.Name += '※';
      props.pilot.AddQuirk(quirk.value);
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      PilotStore().AddPilot(newPilot);
      hide();
      router.push({ name: 'pilot_sheet', params: { id: newPilot.ID } });
    }
function copyPilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(props.pilot as Pilot));
      newPilot.RenewID();
      newPilot.Callsign += '″';
      newPilot.Name += ' (COPY)';
      newPilot.Status = 'ACTIVE';
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      PilotStore().AddPilot(newPilot);
      hide();
      router.push({ name: 'pilot_sheet', params: { id: newPilot.ID } });
    }
</script>
