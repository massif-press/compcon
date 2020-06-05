<template>
  <div class="bordered-primary">
    <v-row class="primary white--text mt-n3 px-2" dense>
      <v-col>
        <span class="heading h1">{{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }}</span>
        <span class="heading h2 mt-7">&nbsp;({{ pilot.Name || 'ERR NAME NOT FOUND' }})</span>
      </v-col>
      <v-col cols="auto" class="ml-auto mt-4">
        <v-icon size="70" dark>cci-orbital</v-icon>
      </v-col>
    </v-row>

    <v-row class="primary mt-n6" dense>
      <span class="flavor-text white--text ml-6">
        Union Administrative RM-4 Pilot Identification Protocol (IDENT) Record {{ pilot.ID }}
      </span>
    </v-row>

    <div class="ml-2 py-1 px-2">
      <v-row dense>
        <span v-if="!pilot.Name" class="flavor-text">
          ERR NAME NOT FOUND UNABLE TO GENERATE UUID
        </span>
        <span v-else class="flavor-text">
          {{ flipName(pilot.Name) }}:{{ pilot.ID }}//NDL-C-{{ missionName() }}
        </span>
      </v-row>
      <v-row dense>
        <v-col cols="8">
          <v-row dense>
            <v-col cols="8">
              <span class="flavor-text">
                Callsign:
                <b class="accent--text">{{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }}</b>
                <br />
                Name (or legal alias):
                <b class="accent--text">{{ pilot.Name || 'ERR NAME NOT FOUND' }}</b>
                <br />
                Background:
                <b class="accent--text">
                  {{ pilot.Background || 'PILOT HISTORY NOT REGISTERED' }}
                </b>
              </span>
            </v-col>
            <v-col>
              <span class="flavor-text subtle--text">
                {{ pilot.Callsign ? 'CALLSIGN AVAILABLE' : '--' }}
                <br />
                {{ pilot.Name ? 'IDENTITY VERIFIED' : '--' }}
                <br />
                {{ pilot.Background ? 'PH/HR DATA REGISTERED' : '--' }}
              </span>
            </v-col>
          </v-row>
          <v-row dense>
            <span class="flavor-text">
              FRAME CONFIGURATION OPTIONS
              <span class="subtle--text">("H.A.S.E" OMNINET VAULT REMIT)</span>
            </span>
          </v-row>
          <v-row>
            <span class="flavor-text ml-3" style="font-size: 22px; line-height: 15px">
              [ HULL:
              <span class="stat-text accent--text" style="font-size: 24px">
                {{ pilot.MechSkills.Hull }}&emsp;
              </span>
              AGI:
              <span class="stat-text accent--text" style="font-size: 24px">
                {{ pilot.MechSkills.Agi }}&emsp;
              </span>
              SYS:
              <span class="stat-text accent--text" style="font-size: 24px">
                {{ pilot.MechSkills.Sys }}&emsp;
              </span>
              ENG:
              <span class="stat-text accent--text" style="font-size: 24px">
                {{ pilot.MechSkills.Eng }}
              </span>
              ]
            </span>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6">
              <span class="flavor-text">PILOT SKILL TRIGGER AUDIT</span>
              <br />
              <span v-if="!pilot.Skills.length" class="stat-text accent--text">
                &nbsp;ERR SKILL AUDIT INCOMPLETE
              </span>
              <v-chip
                v-for="s in pilot.Skills"
                v-else
                :key="s.Skill.ID"
                color="accent"
                class="ma-2"
                outlined
                label
              >
                <v-icon left>cci-skill</v-icon>
                {{ s.Skill.Trigger }}
              </v-chip>
            </v-col>
            <v-col cols="6">
              <span class="flavor-text">PILOT TALENT AUDIT</span>
              <br />
              <span v-if="!pilot.Talents.length" class="stat-text accent--text">
                &nbsp;ERR TALENT AUDIT INCOMPLETE
              </span>
              <v-chip
                v-for="t in pilot.Talents"
                v-else
                :key="t.Talent.ID"
                color="accent"
                class="ma-2"
                outlined
                label
              >
                <v-icon left>cci-talent</v-icon>
                {{ t.Talent.Name }} {{ 'I'.repeat(t.Rank) }}
              </v-chip>
            </v-col>
          </v-row>
          <v-row dense>
            <span v-if="pilotReady" class="flavor-text subtle--text">
              <v-icon large color="grey darken-2">mdi-fingerprint</v-icon>
              BIOMETRIC RECORD VALID [[{{ randomNumber(13, 22) }}PB]] :: OHM C//{{ futuredate() }}
            </span>
          </v-row>
        </v-col>
        <v-col>
          <div class="border ml-auto mr-auto" style="width: 300px; height: 300px">
            <v-img
              v-if="pilot.Portrait"
              :src="pilot.Portrait"
              aspect-ratio="1"
              position="top center"
            />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <span class="overline subtle--text text--darken-1" style="line-height: 10px">
          Improper use of this IDENT record and/or its constituent data by the record holder or any
          other persons in punishable under the DoJ/HR A-645-c. This record is the property of the
          Union Administrative Office and the information herein must be transmitted on request
          under NDL-C-DISCORDANT-BREATH encryption protocols. This RM-4 record must be updated every
          five (5) Cradle Standard Years of objective time to retain GMS licensing rights. Far-field
          operatives that anticipate deployments lasting longer than five Cradle Standard Years that
          have not been issued a man-portable Omninet Hook should apply for the RM-11-B IDENT
          Supplemental (b) Extension. Contact your local Union Adminstrative Officer for any other
          matters regarding this record.&emsp;&emsp;V-CDL//M-265-114-831 (A)
        </span>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { mission } from '@/io/Generators'

import Vue from 'vue'
export default Vue.extend({
  name: 'pilot-registration-card',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    pilotReady: {
      type: Boolean,
    },
  },
  methods: {
    flipName(name: string): string {
      const suffixes = ['II', 'III', 'IV', 'V', 'VI', 'VII']
      const nArr = name.split(' ')
      let last = nArr.pop()
      if (suffixes.includes(last)) last = nArr.pop()
      nArr.unshift(last)
      return nArr.join('.').replace('-', '.')
    },
    missionName(): string {
      return mission().replace(' ', '-')
    },
    futuredate(): string {
      const d = new Date()
      d.setFullYear(d.getFullYear() + 3000)
      return d.toISOString()
    },
    randomNumber(max, min): number {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, 2)
      return Math.floor(rand * power) / power
    },
  },
})
</script>
