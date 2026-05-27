<template>
  <v-row dense>
    <v-col cols="auto">
      <v-icon :icon="mech.SizeIcon"
        size="100" />
      <v-divider class="mb-2" />
      <div class="text-center">
        <div class="text-cc-overline text-accent">Hull</div>
        <div class="heading mt-n3"
          style="font-size: 41px">
          {{ pilot.MechSkillsController.MechSkills.Hull }}
        </div>

        <div class="text-cc-overline text-accent">Agi</div>
        <div class="heading mt-n3"
          style="font-size: 41px">
          {{ pilot.MechSkillsController.MechSkills.Agi }}
        </div>

        <div class="text-cc-overline text-accent">Sys</div>
        <div class="heading mt-n3"
          style="font-size: 41px">
          {{ pilot.MechSkillsController.MechSkills.Sys }}
        </div>

        <div class="text-cc-overline text-accent">Eng</div>
        <div class="heading mt-n3"
          style="font-size: 41px">
          {{ pilot.MechSkillsController.MechSkills.Eng }}
        </div>
      </div>
    </v-col>
    <v-col class="pt-3">
      <v-row dense>
        <mech-stat-item attr="Structure"
          :val="mech.MaxStructure"
          icon="cc:structure" />
        <mech-stat-item attr="HP"
          :val="mech.MaxHP"
          icon="mdi-heart" />
        <mech-stat-item attr="Armor"
          :val="mech.Armor"
          icon="mdi-shield" />

        <mech-stat-item attr="Stress"
          :val="mech.MaxStress"
          icon="cc:reactor" />
        <mech-stat-item attr="Heat Capacity"
          :val="mech.HeatCapacity"
          icon="cc:heat" />
        <mech-stat-item attr="Repair Capacity"
          :val="mech.RepairCapacity"
          icon="cc:repair" />

        <mech-stat-item attr="Attack Bonus"
          :val="mech.AttackBonus"
          icon="cc:weapon" />
        <mech-stat-item attr="Tech Attack"
          :val="mech.TechAttack"
          icon="cc:full_tech" />
        <mech-stat-item attr="Limited Bonus"
          :val="mech.LimitedBonus"
          icon="cc:ammo" />

        <mech-stat-item attr="Speed"
          :val="mech.Speed"
          icon="mdi-arrow-right-bold-hexagon-outline" />
        <mech-stat-item attr="Evasion"
          :val="mech.Evasion"
          icon="cc:evasion" />
        <mech-stat-item attr="E-Defense"
          :val="mech.EDefense"
          icon="cc:edef" />
        <mech-stat-item cols="6"
          attr="Sensor Range"
          :val="mech.SensorRange"
          icon="cc:sensor" />
        <mech-stat-item cols="6"
          attr="Save"
          :val="mech.SaveTarget"
          icon="cc:save" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import MechStatItem from './MechStatItem.vue';

export default {
  name: 'LinkSheetHaseBlock',
  components: { MechStatItem },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
};
</script>
