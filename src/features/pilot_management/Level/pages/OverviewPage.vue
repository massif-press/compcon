<template>
  <stepper-content complete :exit="`/pilot/${pilot.ID}`" @complete="$emit('next')">
    <cc-title offset>{{ $t('pm.level.levelUpOverview') }}&emsp;</cc-title>
    <div class="heading h2">
      {{ $t('pm.level.mv2LicenseAcquisitionRequest') }}
      <cc-slashes />
      &nbsp;{{ $t('common.overview') }}
    </div>
    <i18n-t keypath="pm.level.theUADIDENTMV2License"
      tag="p"
      scope="global"
      class="flavor-text"
      style="font-size: 14px">
      <template #node><code>{{ $t('pm.level.unOmni18364AndesCerroboneteNode') }}</code></template>
    </i18n-t>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2">
      <p class="text-cc-overline">
        {{ $t('pm.level.submittingUnauthorizedLicensingUpdatesAndOr') }}
      </p>
    </v-alert>
    <div class="flavor-text my-4">
      <v-row justify="center">
        <v-col class="text-center text-stark">
          {{ $t('pm.level.theUADIDENTServiceHasDetermined') }}&nbsp;
          <div
            class="text-accent stat-text d-inline-block"
            style="position: relative; top: 10px; line-height: 10px">
            {{ pilot.Name }}
            <cc-slashes class="text-primary" />
            "{{ pilot.Callsign }}"
            <div
              class="text-cc-overline text-text pt-1"
              style="font-size: 10px !important; letter-spacing: 1px !important; opacity: 0.5">
              {{ pilot.ID }}
            </div>
          </div>
          &nbsp;{{ $t('pm.level.isEligibleForTheFollowingLicense') }}
        </v-col>
      </v-row>
    </div>

    <cc-panel color="primary" stark class="mx-auto" style="max-width: fit-content">
      <v-row dense>
        <v-col class="text-center" cols="12" md="auto">
          <div class="text-overline text-white">{{ $t('ui.fields.licenseLevel') }}</div>
          <v-avatar color="background" size="100" class="mx-auto">
            <div class="text-white heading h1 font-weight-black">{{ pilot.Level }}</div>
          </v-avatar>
        </v-col>
        <v-col cols="12" md="auto" class="flavor-text text-white px-4">
          <ul>
            <li>{{ $t('pm.level.pilotSKILLTRIGGERIMPROVEMENT') }}</li>
            <li>{{ $t('pm.level.pilotTALENTUPGRADE') }}</li>
            <li>{{ $t('pm.level.mechSKILLUPGRADE') }}</li>
            <li>{{ $t('pm.level.gritIMPROVEMENT') }}</li>
            <li>{{ $t('pm.level.newLICENSEUNLOCK') }}</li>
            <li v-if="cbEligible" class="font-weight-bolder">{{ $t('pm.level.coreBONUSINSTALLATION') }}</li>
            <li v-else class="text-disabled">{{ $t('pm.level.ineligibleFORCOREBONUS') }}</li>
          </ul>
        </v-col>
      </v-row>
    </cc-panel>
  </stepper-content>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import StepperContent from '../../_components/StepperContent.vue';

defineOptions({ name: 'overview-page' })

const props = defineProps<{
  pilot: Pilot
  cbEligible?: boolean
}>()
</script>

<style scoped>
.offset {
  padding-left: 600px !important;
  margin-left: -600px !important;
}
</style>
