<template>
  <div class="bordered-primary px-2 pt-2 pb-6">
    <v-row dense>
      <v-col>
        <div class="heading h1 mt-n3">
          {{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }}
        </div>
        <div class="heading h4 mt-n3">&nbsp;({{ pilot.Name || 'ERR NAME NOT FOUND' }})</div>
        <div class="flavor-text">
          Union Administrative RM-4 Pilot Identification Protocol (IDENT) Record
          {{ pilot.ID }}
        </div>
      </v-col>
      <v-col v-if="!portrait" md="auto">
        <v-icon size="70" icon="cc:orbital" />
      </v-col>
    </v-row>

    <div class="px-4">
      <div>
        <span v-if="!pilot.Name" class="flavor-text">
          ERR NAME NOT FOUND UNABLE TO GENERATE UUID
        </span>
        <span v-else class="flavor-text">
          {{ flipName(pilot.Name) }}:{{ pilot.ID }}//NDL-C-{{ missionName() }}
        </span>
      </div>
      <v-row dense>
        <v-col cols="12" md="8">
          <v-row density="compact">
            <v-col cols="12" md="8">
              <span class="flavor-text">
                Callsign:
                <br v-if="portrait" />
                <b class="text-accent">{{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }}</b>
                <br />
                Name (or legal alias)
                <br v-if="portrait" />
                <b class="text-accent">{{ pilot.Name || 'ERR NAME NOT FOUND' }}</b>
                <br />
                Background
                <br v-if="portrait" />
                <b class="text-accent">
                  {{ pilot.Background || 'PILOT HISTORY NOT REGISTERED' }}
                </b>
              </span>
            </v-col>
            <v-col v-if="!$vuetify.display.mdAndDown">
              <span class="flavor-text text-disabled">
                {{ pilot.Callsign ? 'CALLSIGN AVAILABLE' : '--' }}
                <br />
                {{ pilot.Name ? 'IDENTITY VERIFIED' : '--' }}
                <br />
                {{ pilot.Background ? 'PH/HR DATA REGISTERED' : '--' }}
              </span>
            </v-col>
          </v-row>
          <div class="flavor-text mt-2">
            FRAME CONFIGURATION OPTIONS
            <span class="text-disabled">("H.A.S.E" OMNINET VAULT REMIT)</span>
          </div>
          <div class="my-1">
            <span class="flavor-text ml-3" style="font-size: 22px; line-height: 15px">
              [ HULL:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Hull }}&emsp;
              </span>
              AGI:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Agi }}&emsp;
              </span>
              SYS:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Sys }}&emsp;
              </span>
              ENG:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Eng }}
              </span>
              ]
            </span>
          </div>
          <v-row class="mt-2">
            <v-col cols="12" md="6">
              <span class="flavor-text">PILOT SKILL TRIGGER AUDIT</span>
              <br />
              <span v-if="!pilot.SkillsController.Skills.length" class="stat-text text-accent">
                &nbsp;ERR SKILL AUDIT INCOMPLETE
              </span>
              <v-chip
                v-for="s in pilot.SkillsController.Skills"
                v-else
                color="accent"
                class="ma-1"
                variant="outlined"
                label
                small>
                <v-icon start>cc:skill</v-icon>
                {{ s.Skill.Trigger }}
              </v-chip>
            </v-col>
            <v-col cols="12" md="6">
              <span class="flavor-text">PILOT TALENT AUDIT</span>
              <br />
              <span v-if="!pilot.TalentsController.Talents.length" class="stat-text text-accent">
                &nbsp;ERR TALENT AUDIT INCOMPLETE
              </span>
              <v-chip
                v-for="t in pilot.TalentsController.Talents"
                v-else
                color="accent"
                class="ma-1"
                variant="outlined"
                label
                small>
                <v-icon start>cc:talent</v-icon>
                {{ t.Talent.Name }} {{ 'I'.repeat(t.Rank) }}
              </v-chip>
            </v-col>
          </v-row>
          <v-row density="compact">
            <span v-if="pilotReady" class="flavor-text text-disabled">
              <v-icon large color="grey darken-2">mdi-fingerprint</v-icon>
              BIOMETRIC RECORD VALID [[{{ randomNumber(13, 22) }}PB]] :: OHM C//{{ futureDate() }}
            </span>
          </v-row>
        </v-col>
        <v-col>
          <div class="border ml-auto mr-auto text-center" style="width: 300px; height: 300px">
            <cc-avatar
              v-if="pilot.PortraitController.Avatar"
              :avatar="pilot.PortraitController.Avatar"
              :size="300" />
            <cc-img
              v-else-if="pilot.Portrait"
              :src="pilot.Portrait"
              aspect-ratio="1"
              position="top center" />
          </div>
        </v-col>
      </v-row>
      <v-divider class="ma-2" />
      <v-row dense>
        <span class="text-overline" style="line-height: 13px !important; opacity: 0.4">
          Improper use of this IDENT record and/or its constituent data by the record holder or any
          other persons is punishable under the DoJ/HR A-645-c. This record is the property of the
          Union Administrative Office and the information herein must be transmitted on request
          under NDL-C-DISCORDANT-BREATH encryption protocols. This RM-4 record must be updated every
          five (5) Cradle Standard Years of objective time to retain GMS licensing rights. Far-field
          operatives that anticipate deployments lasting longer than five Cradle Standard Years that
          have not been issued a man-portable Omninet Hook should apply for the RM-11-B IDENT
          Supplemental (b) Extension. Contact your local Union Administrative Officer for any other
          matters regarding this record.&emsp;&emsp;V-CDL//M-265-114-831 (A)
        </span>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { mission } from '@/io/Generators';

export default {
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
  computed: {
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
  },
  methods: {
    flipName(name: string): string {
      const suffixes = ['II', 'III', 'IV', 'V', 'VI', 'VII'];
      const nArr = name.split(' ');
      let last = nArr.pop() || '';

      if (suffixes.includes(last)) last = nArr.pop() || '';
      nArr.unshift(last);
      return nArr.join('.').replace('-', '.');
    },
    missionName(): string {
      return mission().replace(' ', '-');
    },
    futureDate(): string {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3000);
      return d.toISOString();
    },
    randomNumber(max, min): number {
      const rand = Math.random() * (max - min) + min;
      const power = Math.pow(10, 2);
      return Math.floor(rand * power) / power;
    },
  },
};
</script>
