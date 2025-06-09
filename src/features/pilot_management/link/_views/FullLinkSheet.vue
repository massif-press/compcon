<template>
  <v-row dense align="center">
    <v-col cols="auto" class="pr-6 mt-n1">
      <div class="heading h2 ml-2" style="font-size: 52px; line-height: 50px">
        {{ pilot.Callsign }}
      </div>
      <div class="heading h3 ml-2" style="font-size: 22px; line-height: 22px">
        {{ pilot.Name }}
        <span v-if="pilot.Background" class="heading h3 text-accent">
          <cc-slashes class="pl-1" />
          {{ pilot.Background }}
        </span>
      </div>
    </v-col>

    <v-col cols="auto" class="ml-auto text-center mt-n2">
      <v-row class="border-sm">
        <v-col cols="auto" class="py-1">
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
      <v-row v-if="!mech" dense align="center" justify="space-around" class="text-center">
        <v-col cols="auto" class="py-1">
          <div class="text-cc-overline text-accent">Hull</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Hull }}
          </div>
        </v-col>
        <v-divider vertical class="my-4" />
        <v-col cols="auto" class="py-1">
          <div class="text-cc-overline text-accent">Agility</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Agi }}
          </div>
        </v-col>
        <v-divider vertical class="my-4" />
        <v-col cols="auto" class="py-1">
          <div class="text-cc-overline text-accent">Systems</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Sys }}
          </div>
        </v-col>
        <v-divider vertical class="my-4" />
        <v-col cols="auto" class="py-1">
          <div class="text-cc-overline text-accent">Engineering</div>
          <div class="heading h3 mt-n1">
            {{ pilot.MechSkillsController.MechSkills.Eng }}
          </div>
        </v-col>
      </v-row>

      <clone-block :pilot="pilot" readonly />

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

    <v-col v-if="pilot.Portrait" cols="auto">
      <v-img height="100%" min-width="300px" cover :src="pilot.Portrait" />
    </v-col>
  </v-row>

  <div v-if="pilot.BondController.Bond" id="bond">
    <cc-title class="my-2">Bond</cc-title>
    <v-row>
      <v-col cols="auto">
        <v-img :src="pilot.BondController.Bond.Image" height="100%" min-width="150px" cover />
      </v-col>
      <v-col>
        <div class="heading h2">
          {{ pilot.BondController.Bond.Name }}
        </div>

        <v-row>
          <v-col md="6" cols="12">
            <cc-heading line>Minor Ideal</cc-heading>
            <div class="text-cc-body">
              {{ pilot.BondController.MinorIdeal }}
            </div>
          </v-col>
          <v-col md="6" cols="12" v-for="(q, i) in pilot.BondController.Bond.Questions">
            <cc-heading line>{{ q.question }}</cc-heading>
            <div class="text-cc-body">
              {{ pilot.BondController.Answers[i] }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>

  <cc-title class="mt-4 mb-2" id="skills">Skills</cc-title>
  <cc-skill-item
    v-for="s in pilot.SkillsController.Skills"
    :bonus="s.Bonus"
    :skill="s.Skill"
    :key="s.ID" />

  <cc-title class="mt-4 mb-2" id="reserves">Reserves</cc-title>
  <div v-for="r in pilot.ReservesController.Reserves" class="mb-1">
    <cc-reserve-item :reserve="r" />
  </div>

  <cc-title class="mt-4 mb-2" id="loadout">Pilot Loadout</cc-title>
  <cc-pilot-loadout :pilot="pilot" readonly no-frame />

  <div v-if="pilot.LicenseController.Licenses.length" id="licenses">
    <cc-title class="mt-4 mb-2">Licenses</cc-title>
    <v-row>
      <v-col v-for="l in pilot.LicenseController.Licenses">
        <cc-pilot-license-stub :pilot-license="l" />
      </v-col>
    </v-row>
  </div>

  <div v-if="pilot.TalentsController.Talents.length" id="talents">
    <cc-title class="mt-4 mb-2">Talents</cc-title>
    <cc-talent
      v-for="t in pilot.TalentsController.Talents"
      hide-locked
      :talent="t.Talent"
      :rank="t.Rank"
      hide-change />
  </div>

  <div v-if="pilot.CoreBonusController.CoreBonuses.length" id="core-bonuses">
    <cc-title class="mt-4 mb-2">Core Bonuses</cc-title>
    <cc-core-bonus-item
      v-for="b in pilot.CoreBonusController.CoreBonuses"
      :bonus="b"
      readonly
      terse />
  </div>

  <div v-if="mech" id="mech">
    <cc-icon-divider icon="cc:frame" class="my-4" />
    <v-row dense align="center">
      <v-col cols="auto" class="pr-6 mt-n1">
        <div class="heading h2 ml-2" style="font-size: 52px; line-height: 50px">
          {{ mech.Name }}
        </div>
        <div class="heading h3 ml-2" style="font-size: 22px; line-height: 22px">
          <v-icon size="x-small" class="mb-1" :icon="mech.Frame.Manufacturer.Icon" />
          {{ mech.Frame.Source }} {{ mech.Frame.Name }}
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-if="mech.Portrait" cols="auto">
        <v-img height="100%" width="250px" cover :src="mech.Portrait" />
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col>
        <v-row dense>
          <v-col cols="auto">
            <v-icon :icon="mech.SizeIcon" size="100" />
            <v-divider class="mb-2" />
            <div class="text-center">
              <div class="text-cc-overline text-accent">Hull</div>
              <div class="heading mt-n3" style="font-size: 41px">
                {{ pilot.MechSkillsController.MechSkills.Hull }}
              </div>

              <div class="text-cc-overline text-accent">Agi</div>
              <div class="heading mt-n3" style="font-size: 41px">
                {{ pilot.MechSkillsController.MechSkills.Agi }}
              </div>

              <div class="text-cc-overline text-accent">Sys</div>
              <div class="heading mt-n3" style="font-size: 41px">
                {{ pilot.MechSkillsController.MechSkills.Sys }}
              </div>

              <div class="text-cc-overline text-accent">Eng</div>
              <div class="heading mt-n3" style="font-size: 41px">
                {{ pilot.MechSkillsController.MechSkills.Eng }}
              </div>
            </div>
          </v-col>
          <v-col class="pt-3">
            <v-row dense>
              <mech-stat-item attr="Structure" :val="mech.MaxStructure" icon="cc:structure" />
              <mech-stat-item attr="HP" :val="mech.MaxHP" icon="mdi-heart" />
              <mech-stat-item attr="Armor" :val="mech.Armor" icon="mdi-shield" />

              <mech-stat-item attr="Stress" :val="mech.MaxStress" icon="cc:reactor" />
              <mech-stat-item attr="Heat Capacity" :val="mech.HeatCapacity" icon="cc:heat" />
              <mech-stat-item attr="Repair Capacity" :val="mech.RepairCapacity" icon="cc:repair" />

              <mech-stat-item attr="Attack Bonus" :val="mech.MaxStress" icon="cc:weapon" />
              <mech-stat-item attr="Tech Attack" :val="mech.HeatCapacity" icon="cc:full_tech" />
              <mech-stat-item attr="Limited Bonus" :val="mech.RepairCapacity" icon="cc:ammo" />

              <mech-stat-item
                attr="Speed"
                :val="mech.MaxStress"
                icon="mdi-arrow-right-bold-hexagon-outline" />
              <mech-stat-item attr="Evasion" :val="mech.HeatCapacity" icon="cc:evasion" />
              <mech-stat-item attr="E-Defense" :val="mech.RepairCapacity" icon="cc:e_def" />
              <mech-stat-item
                cols="6"
                attr="Sensor Range"
                :val="mech.RepairCapacity"
                icon="cc:sensor" />
              <mech-stat-item cols="6" attr="Save" :val="mech.RepairCapacity" icon="cc:save" />
            </v-row>
          </v-col>
        </v-row>
        <v-row dense class="mb-2">
          <v-col v-for="t in mech.Frame.Traits">
            <cc-trait-item :trait="t" />
          </v-col>
        </v-row>

        <v-card class="px-3" flat tile>
          <cc-core-system-panel :frame="mech.Frame" terse />
        </v-card>
      </v-col>
    </v-row>
    <div class="px-2 pb-4 pt-2">
      <cc-core-bonus-item
        v-for="b in pilot.CoreBonusController.CoreBonuses"
        :bonus="b"
        readonly
        terse />
    </div>

    <cc-mech-loadout :mech="mech" readonly no-frame />
  </div>
</template>

<script lang="ts">
import CcPilotLicenseStub from '@/ui/components/items/CCPilotLicenseStub.vue';
import MechStatItem from '../_components/MechStatItem.vue';

export default {
  name: 'pilot-link-full',
  components: {
    CcPilotLicenseStub,
    MechStatItem,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: false,
    },
  },
};
</script>
