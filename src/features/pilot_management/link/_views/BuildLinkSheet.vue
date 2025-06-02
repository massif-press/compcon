<template>
  <v-row>
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
    <v-col cols="auto" class="py-1 mt-2">
      <div class="text-cc-overline text-accent">License Level</div>
      <div class="heading h2 mt-n1">
        {{ pilot.Level }}
      </div>
    </v-col>
  </v-row>

  <v-row dense>
    <v-col v-if="pilot.Portrait" cols="auto">
      <v-img height="100%" width="300px" cover :src="pilot.Portrait" />
    </v-col>
    <v-col class="ml-4">
      <v-row class="border-sm text-center my-1" justify="space-around"></v-row>

      <v-chip-group column class="mt-4">
        <v-chip
          v-for="s in pilot.SkillsController.Skills"
          :key="s.Skill.ID"
          flat
          tile
          prepend-icon="cc:skill">
          <div>
            <span class="font-weight-bold text-accent pr-1">+{{ s.Bonus }}</span>
            {{ s.Skill.Trigger }} &nbsp;
          </div>
        </v-chip>
      </v-chip-group>

      <v-chip-group column>
        <v-chip
          v-for="t in pilot.TalentsController.Talents"
          :key="t.Talent.ID"
          flat
          tile
          :prepend-icon="`cc:rank_${t.Rank}`">
          <div>
            {{ t.Talent.Name }}
            {{ 'I'.repeat(t.Rank) }}
          </div>
        </v-chip>
      </v-chip-group>

      <v-chip-group column>
        <v-chip
          v-for="l in pilot.LicenseController.Licenses"
          :key="l.Stub.ID"
          flat
          tile
          prepend-icon="cc:license">
          <div>
            {{ l.Stub.Source }} {{ l.Stub.Name }}
            {{ 'I'.repeat(l.Rank) }}
          </div>
        </v-chip>
      </v-chip-group>

      <cc-icon-divider icon="cc:pilot" class="mt-n4" />
      <div class="d-flex flex-wrap justify-center">
        <cc-item-modal
          v-for="s in pilot.PilotLoadoutController.ActiveLoadout.Items"
          :item="s"
          hide-link />
      </div>
    </v-col>
  </v-row>

  <div v-if="mech">
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
        <div class="px-2 pb-4 pt-2">
          <cc-core-bonus-item
            v-for="b in pilot.CoreBonusController.CoreBonuses"
            :bonus="b"
            readonly
            terse />
        </div>

        <cc-icon-divider icon="cc:weapon" class="mt-n4" />
        <div class="d-flex flex-wrap justify-center">
          <cc-item-modal v-for="w in mech.MechLoadoutController.ActiveLoadout.Weapons" :item="w" />
        </div>
        <cc-icon-divider icon="cc:system" class="mt-1" />
        <div class="d-flex flex-wrap justify-center">
          <cc-item-modal v-for="s in mech.MechLoadoutController.ActiveLoadout.Systems" :item="s" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import MechStatItem from '../_components/MechStatItem.vue';

export default {
  name: 'pilot-link-build',
  components: {
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
      default: null,
    },
  },
};
</script>
