<template>
  <cc-stepper-content complete :exit="`/pilot/${pilot.ID}`" @complete="$emit('next')">
    <cc-title large>Level Up (Overview)&emsp;</cc-title>
    <h2 class="heading">
      MV-2 License Acquisition Request
      <cc-slashes />
      &nbsp;Overview
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Feature In Development">
        <v-btn small outlined disabled>Suggest Level Upgrades</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        The UAD IDENT MV-2 License Acquisition Request has been designed to allow active Union
        personnel to register license updates while field-deployed and receive immediate UN and GMS
        field support resources. Union personnel should confirm the correctness of their submitted
        form with their local Union officer, or, in the event an officer is unavailable, request an
        NHP-directed review at secure Omninet address
        <code>un_omni-18364.andes.cerrobonete.node:9</code>
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <span class="overline">
          Submitting unauthorized licensing updates and/or submitting applications for unauthorized
          or previously-witheld license rights without prior MV-8a/j authorization by a Union
          Administrator will result in the automatic rejection of the licensing application and may
          result in a licensing audit under DoJ/HR AR 716-J
        </span>
      </v-alert>
    </v-container>
    <v-container class="flavor-text">
      <v-row justify="center">
        <v-col class="text-center">
          The UAD IDENT Service has determined that&nbsp;
          <div
            class="accent--text stat-text d-inline-block"
            style="position: relative; top: 10px; line-height: 10px;"
          >
            {{ pilot.Name }}
            <cc-slashes />
            "{{ pilot.Callsign }}"
            <br />
            <span class="overline subtle--text">{{ pilot.ID }}</span>
          </div>
          &nbsp;is eligible for the following license update:
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-card color="primary" outlined>
          <v-card-text>
            <v-row class="px-3">
              <v-col class="text-center" cols="auto">
                <span class="overline white--text">LICENSE LEVEL</span>
                <br />
                <span class="white--text display-4 font-weight-black">{{ pilot.Level }}</span>
              </v-col>
              <v-col cols="auto" class="flavor-text white--text px-4">
                <ul>
                  <li>PILOT SKILL TRIGGER IMPROVEMENT</li>
                  <li>PILOT TALENT UPGRADE</li>
                  <li>MECH SKILL UPGRADE</li>
                  <li>GRIT IMPROVEMENT</li>
                  <li>NEW LICENSE UNLOCK</li>
                  <li v-if="cbEligible" class="font-weight-bolder">
                    CORE BONUS INSTALLATION
                  </li>
                  <li v-else class="subtle--text">INELIGIBLE FOR CORE BONUS</li>
                </ul>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'overview-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    cbEligible: {
      type: Boolean,
    },
  },
})
</script>
