<template>
  <stepper-content complete :exit="`/pilot/${pilot.ID}`" @complete="$emit('next')">
    <cc-title offset>Level Up (Overview)&emsp;</cc-title>
    <div class="heading h2">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;Overview
    </div>
    <p class="flavor-text" style="font-size: 14px">
      The UAD IDENT MV-2 License Acquisition Request has been designed to allow active Union
      personnel to register license updates while field-deployed and receive immediate UN and GMS
      field support resources. Union personnel should confirm the correctness of their submitted
      form with their local Union officer, or, in the event an officer is unavailable, request an
      NHP-directed review at secure Omninet address
      <code>un_omni-18364.andes.cerrobonete.node:9</code>
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2">
      <p class="text-cc-overline">
        Submitting unauthorized licensing updates and/or submitting applications for unauthorized or
        previously-witheld license rights without prior MV-8a/j authorization by a Union
        Administrator will result in the automatic rejection of the licensing application and may
        result in a licensing audit under DoJ/HR AR 716-J
      </p>
    </v-alert>
    <div class="flavor-text my-4">
      <v-row justify="center">
        <v-col class="text-center text-stark">
          The UAD IDENT Service has determined that&nbsp;
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
          &nbsp;is eligible for the following license update:
        </v-col>
      </v-row>
    </div>

    <cc-panel color="primary" stark class="mx-auto" style="max-width: fit-content">
      <v-row dense>
        <v-col class="text-center" cols="12" md="auto">
          <div class="text-overline text-white">LICENSE LEVEL</div>
          <v-avatar color="background" size="100" class="mx-auto">
            <div class="text-white heading h1 font-weight-black">{{ pilot.Level }}</div>
          </v-avatar>
        </v-col>
        <v-col cols="12" md="auto" class="flavor-text text-white px-4">
          <ul>
            <li>PILOT SKILL TRIGGER IMPROVEMENT</li>
            <li>PILOT TALENT UPGRADE</li>
            <li>MECH SKILL UPGRADE</li>
            <li>GRIT IMPROVEMENT</li>
            <li>NEW LICENSE UNLOCK</li>
            <li v-if="cbEligible" class="font-weight-bolder">CORE BONUS INSTALLATION</li>
            <li v-else class="text-disabled">INELIGIBLE FOR CORE BONUS</li>
          </ul>
        </v-col>
      </v-row>
    </cc-panel>
  </stepper-content>
</template>

<script lang="ts">
import StepperContent from '../../_components/StepperContent.vue';

export default {
  name: 'overview-page',
  components: { StepperContent },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    cbEligible: {
      type: Boolean,
    },
  },
};
</script>

<style scoped>
.offset {
  padding-left: 600px !important;
  margin-left: -600px !important;
}
</style>
