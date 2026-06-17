<template>
  <div class="bordered-primary px-2 pt-2 pb-6">
    <v-row dense>
      <v-col>
        <div class="heading h1 mt-n3">
          {{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }}
        </div>
        <div class="heading h4 mt-n3">&nbsp;({{ pilot.Name || 'ERR NAME NOT FOUND' }})</div>
        <div class="flavor-text">
          {{ $t('pm.sheet.unionAdministrativeIdentRecord') }}
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
          {{ $t('pm.sheet.errNAMENOTFOUNDUNABLETO') }}
        </span>
        <span v-else class="flavor-text">
          {{ flipName(pilot.Name) }}:{{ pilot.ID }}{{ $t('pm.sheet.ndlC') }}{{ missionName() }}
        </span>
      </div>
      <v-row dense>
        <v-col cols="12" md="8">
          <v-row density="compact">
            <v-col cols="12" md="8">
              <span class="flavor-text">
                {{ $t('common.callsign') }}:
                <br v-if="portrait" />
                <b class="text-accent">{{ pilot.Callsign || 'ERR CALLSIGN NOT FOUND' }}</b>
                <br />
                {{ $t('pm.sheet.nameOrLegalAlias') }}
                <br v-if="portrait" />
                <b class="text-accent">{{ pilot.Name || 'ERR NAME NOT FOUND' }}</b>
                <br />
                {{ $t('pm.sheet.background2') }}
                <br v-if="portrait" />
                <b class="text-accent">
                  {{ pilot.Background || 'PILOT HISTORY NOT REGISTERED' }}
                </b>
              </span>
            </v-col>
            <v-col v-if="!$vuetify.display.mdAndDown">
              <span class="flavor-text text-disabled">
                {{ pilot.Callsign ? $t('pm.sheet.callsignAVAILABLE') : '--' }}
                <br />
                {{ pilot.Name ? $t('pm.sheet.identityVERIFIED') : '--' }}
                <br />
                {{ pilot.Background ? $t('pm.sheet.phHRDATAREGISTERED') : '--' }}
              </span>
            </v-col>
          </v-row>
          <i18n-t keypath="pm.sheet.frameCONFIGURATIONOPTIONS"
            tag="div"
            scope="global"
            class="flavor-text mt-2">
            <template #remit><span class="text-disabled">{{ $t('pm.sheet.hASEOMNINETVAULT') }}</span></template>
          </i18n-t>
          <div class="my-1">
            <span class="flavor-text ml-3" style="font-size: 22px; line-height: 15px">
              [ {{ $t('stats.hull') }}:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Hull }}&emsp;
              </span>
              {{ $t('stats.agi') }}:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Agi }}&emsp;
              </span>
              {{ $t('stats.sys') }}:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Sys }}&emsp;
              </span>
              {{ $t('stats.eng') }}:
              <span class="stat-text text-accent" style="font-size: 24px">
                {{ pilot.MechSkillsController.MechSkills.Eng }}
              </span>
              ]
            </span>
          </div>
          <v-row class="mt-2">
            <v-col cols="12" md="6">
              <span class="flavor-text">{{ $t('pm.sheet.pilotSKILLTRIGGERAUDIT') }}</span>
              <br />
              <span v-if="!pilot.SkillsController.Skills.length" class="stat-text text-accent">
                &nbsp;{{ $t('pm.sheet.errSKILLAUDITINCOMPLETE') }}
              </span>
              <v-chip
                v-for="s in pilot.SkillsController.Skills"
                :key="s.Skill.ID"
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
              <span class="flavor-text">{{ $t('pm.sheet.pilotTALENTAUDIT') }}</span>
              <br />
              <span v-if="!pilot.TalentsController.Talents.length" class="stat-text text-accent">
                &nbsp;{{ $t('pm.sheet.errTALENTAUDITINCOMPLETE') }}
              </span>
              <v-chip
                v-for="t in pilot.TalentsController.Talents"
                :key="t.Talent.ID"
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
              {{ $t('pm.sheet.biometricRecordValid') }}{{ randomNumber(13, 22) }}{{ $t('pm.sheet.pbOhmC') }}{{ futureDate() }}
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
          {{ $t('pm.sheet.identRecordNotice') }}
        </span>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mission } from '@/io/Generators';

const _display = useDisplay()

defineOptions({ name: 'pilot-registration-card' })

const props = defineProps<{
  pilot: Pilot
  pilotReady?: boolean
}>()

const portrait = computed(() => {
      return _display.xs.value;
    })

function flipName(name: string) {
      const suffixes = ['II', 'III', 'IV', 'V', 'VI', 'VII'];
      const nArr = name.split(' ');
      let last = nArr.pop() || '';

      if (suffixes.includes(last)) last = nArr.pop() || '';
      nArr.unshift(last);
      return nArr.join('.').replace('-', '.');
    }
function missionName() {
      return mission().replace(' ', '-');
    }
function futureDate() {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3000);
      return d.toISOString();
    }
function randomNumber(max, min) {
      const rand = Math.random() * (max - min) + min;
      const power = Math.pow(10, 2);
      return Math.floor(rand * power) / power;
    }
</script>
