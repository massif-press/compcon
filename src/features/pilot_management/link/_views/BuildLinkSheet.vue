<template>
  <v-row>
    <link-sheet-pilot-name :pilot="pilot" />
    <v-col cols="auto"
      class="py-1 mt-2 ml-auto text-center">
      <div class="text-cc-overline text-accent">{{ $t('pm.roster.licenseLevel') }}</div>
      <div class="heading h2 mt-n1">
        {{ pilot.Level }}
      </div>
    </v-col>
  </v-row>

  <v-row dense>
    <v-col v-if="pilot.Portrait"
      cols="auto">
      <v-img height="100%"
        width="300px"
        cover
        :src="pilot.Portrait" />
    </v-col>
    <v-col class="ml-4">
      <v-row class="border-sm text-center my-1"
        justify="space-around"></v-row>

      <v-chip-group column
        class="mt-4">
        <v-chip v-for="s in pilot.SkillsController.Skills"
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
        <v-chip v-for="t in pilot.TalentsController.Talents"
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
        <v-chip v-for="l in pilot.LicenseController.Licenses"
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

      <cc-icon-divider icon="cc:pilot"
        class="mt-n4" />
      <div class="d-flex flex-wrap justify-center">
        <cc-item-modal v-for="(s, index) in pilot.PilotLoadoutController.ActiveLoadout.Items"
          :key="`loadout-${index}`"
          :item="s"
          hide-link />
      </div>
    </v-col>
  </v-row>

  <div v-if="mech">
    <link-sheet-mech-header :mech="mech" />

    <v-row dense>
      <v-col v-if="mech.Portrait"
        cols="auto">
        <v-img height="100%"
          width="250px"
          cover
          :src="mech.Portrait" />
      </v-col>
      <v-col>
        <link-sheet-hase-block :pilot="pilot"
          :mech="mech" />
        <div class="px-2 pb-4 pt-2">
          <cc-core-bonus-item v-for="b in pilot.CoreBonusController.CoreBonuses"
            :key="b.ID"
            :bonus="b"
            readonly
            terse />
        </div>

        <cc-icon-divider icon="cc:weapon"
          class="mt-n4" />
        <div class="d-flex flex-wrap justify-center">
          <cc-item-modal v-for="(w, index) in mech.MechLoadoutController.ActiveLoadout.Weapons"
            :key="`weapon-${index}`"
            :item="w" />
        </div>
        <cc-icon-divider icon="cc:system"
          class="mt-1" />
        <div class="d-flex flex-wrap justify-center">
          <cc-item-modal v-for="(s, index) in mech.MechLoadoutController.ActiveLoadout.Systems"
            :key="`system-${index}`"
            :item="s" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'
import LinkSheetHaseBlock from '../_components/LinkSheetHaseBlock.vue';
import LinkSheetPilotName from '../_components/LinkSheetPilotName.vue';
import LinkSheetMechHeader from '../_components/LinkSheetMechHeader.vue';

defineOptions({ name: 'pilot-link-build' })

const props = withDefaults(defineProps<{
  pilot: Pilot
  mech?: Mech
}>(), {
  mech: null
})
</script>
