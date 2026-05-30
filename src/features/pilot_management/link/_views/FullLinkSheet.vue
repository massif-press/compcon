<template>
  <v-row dense
    align="center">
    <link-sheet-pilot-name :pilot="pilot" />

    <v-col cols="auto"
      class="ml-auto text-center mt-n2">
      <v-row class="border-sm">
        <v-col cols="auto"
          class="py-1">
          <div class="text-cc-overline text-accent">License Level</div>
          <div class="heading h2 mt-n1">
            {{ pilot.Level }}
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row id="biography">
    <v-col>
      <v-row v-if="!mech"
        dense
        align="center"
        justify="space-around"
        class="text-center">
        <v-col cols="auto"
          class="py-1">
          <div class="text-cc-overline text-accent">Hull</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Hull }}
          </div>
        </v-col>
        <v-divider vertical
          class="my-4" />
        <v-col cols="auto"
          class="py-1">
          <div class="text-cc-overline text-accent">Agility</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Agi }}
          </div>
        </v-col>
        <v-divider vertical
          class="my-4" />
        <v-col cols="auto"
          class="py-1">
          <div class="text-cc-overline text-accent">Systems</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Sys }}
          </div>
        </v-col>
        <v-divider vertical
          class="my-4" />
        <v-col cols="auto"
          class="py-1">
          <div class="text-cc-overline text-accent">Engineering</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Eng }}
          </div>
        </v-col>
      </v-row>

      <clone-block :pilot="pilot"
        readonly />

      <div v-if="pilot.History">
        <cc-title class="mt-2">Pilot Biography</cc-title>
        <p v-html-safe="pilot.History" />
      </div>

      <div v-if="pilot.TextAppearance">
        <cc-title class="mt-2">Pilot Appearance</cc-title>
        <p v-html-safe="pilot.TextAppearance" />
      </div>

      <div v-if="pilot.Notes">
        <cc-title class="mt-2">Notes</cc-title>
        <p v-html-safe="pilot.Notes" />
      </div>
    </v-col>

    <v-col v-if="pilot.Portrait"
      cols="auto">
      <v-img height="100%"
        min-width="300px"
        cover
        :src="pilot.Portrait" />
    </v-col>
  </v-row>

  <div v-if="pilot.BondController.Bond"
    id="bond">
    <cc-title class="my-2">Bond</cc-title>
    <v-row>
      <v-col cols="auto">
        <v-img :src="pilot.BondController.Bond.Image"
          height="100%"
          min-width="150px"
          cover />
      </v-col>
      <v-col>
        <div class="heading h2">
          {{ pilot.BondController.Bond.Name }}
        </div>

        <v-row>
          <v-col md="6"
            cols="12">
            <cc-heading line>Minor Ideal</cc-heading>
            <div class="text-cc-body">
              {{ pilot.BondController.MinorIdeal }}
            </div>
          </v-col>
          <v-col v-for="(q, i) in pilot.BondController.Bond.Questions"
            :key="`question-${i}`"
            md="6"
            cols="12">
            <cc-heading line>{{ q.question }}</cc-heading>
            <div class="text-cc-body">
              {{ pilot.BondController.Answers[i] }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>

  <cc-title id="skills"
    class="mt-4 mb-2">Skills</cc-title>
  <cc-skill-item v-for="s in pilot.SkillsController.Skills"
    :key="s.ID"
    :bonus="s.Bonus"
    :skill="s.Skill" />

  <cc-title id="reserves"
    class="mt-4 mb-2">Reserves</cc-title>
  <div v-for="(r, index) in pilot.ReservesController.Reserves"
    :key="`reserve-${index}`"
    class="mb-1">
    <cc-reserve-item :reserve="r" />
  </div>

  <cc-title id="loadout"
    class="mt-4 mb-2">Pilot Loadout</cc-title>
  <cc-pilot-loadout :pilot="pilot"
    readonly
    no-frame />

  <div v-if="pilot.LicenseController.Licenses.length"
    id="licenses">
    <cc-title class="mt-4 mb-2">Licenses</cc-title>
    <v-row>
      <v-col v-for="l in pilot.LicenseController.Licenses"
        :key="l.Stub.ID">
        <cc-pilot-license-stub :pilot-license="l" />
      </v-col>
    </v-row>
  </div>

  <div v-if="pilot.TalentsController.Talents.length"
    id="talents">
    <cc-title class="mt-4 mb-2">Talents</cc-title>
    <cc-talent v-for="t in pilot.TalentsController.Talents"
      :key="t.Talent.ID"
      hide-locked
      :talent="t.Talent"
      :rank="t.Rank"
      hide-change />
  </div>

  <div v-if="pilot.CoreBonusController.CoreBonuses.length"
    id="core-bonuses">
    <cc-title class="mt-4 mb-2">Core Bonuses</cc-title>
    <cc-core-bonus-item v-for="b in pilot.CoreBonusController.CoreBonuses"
      :key="b.ID"
      :bonus="b"
      readonly
      terse />
  </div>

  <div v-if="mech"
    id="mech">
    <link-sheet-mech-header :mech="mech" />

    <v-row dense>
      <v-col v-if="mech.Portrait"
        cols="auto">
        <v-img height="100%"
          width="250px"
          cover
          :src="mech.Portrait" />
      </v-col>
      <v-divider vertical
        class="mx-2" />
      <v-col>
        <link-sheet-hase-block :pilot="pilot"
          :mech="mech" />
        <v-row dense
          class="mb-2">
          <v-col v-for="t in mech.Frame.Traits"
            :key="t.Name"
            style="min-width: 22vw;">
            <cc-trait-item :trait="t" />
          </v-col>
        </v-row>

        <v-card class="px-3"
          flat
          tile>
          <cc-core-system-panel :frame="mech.Frame"
            terse />
        </v-card>
      </v-col>
    </v-row>
    <div class="px-2 pb-4 pt-2">
      <cc-core-bonus-item v-for="b in pilot.CoreBonusController.CoreBonuses"
        :key="b.ID"
        :bonus="b"
        readonly
        terse />
    </div>

    <cc-mech-loadout :mech="mech"
      readonly
      no-frame />
  </div>
</template>

<script setup lang="ts">
import CcPilotLicenseStub from '@/ui/components/items/CCPilotLicenseStub.vue';
import CCPilotLoadout from '@/features/pilot_management/_components/loadout/pilot_loadout/CCPilotLoadout.vue'
import CCMechLoadout from '@/features/pilot_management/_components/loadout/mech_loadout/CCMechLoadout.vue'
import LinkSheetHaseBlock from '../_components/LinkSheetHaseBlock.vue';
import CloneBlock from '../../PilotSheet/sections/narrative/components/CloneBlock.vue';
import LinkSheetPilotName from '../_components/LinkSheetPilotName.vue';
import LinkSheetMechHeader from '../_components/LinkSheetMechHeader.vue';

defineOptions({ name: 'PilotLinkFull' })

const props = defineProps<{
  pilot: object
  mech?: object
}>()
</script>
