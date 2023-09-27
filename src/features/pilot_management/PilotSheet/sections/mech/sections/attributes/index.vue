<template>
  <v-row dense>
    <v-col cols="auto" class="mr-3">
      <hase-pips
        :mech="mech"
        attr="hull"
        :val="pilot.MechSkillsController.MechSkills.Hull"
        :color="color"
      />
      <hase-pips
        :mech="mech"
        attr="agility"
        :val="pilot.MechSkillsController.MechSkills.Agi"
        :color="color"
      />
      <hase-pips
        :mech="mech"
        attr="systems"
        :val="pilot.MechSkillsController.MechSkills.Sys"
        :color="color"
      />
      <hase-pips
        :mech="mech"
        attr="engineering"
        :val="pilot.MechSkillsController.MechSkills.Eng"
        :color="color"
      />
      <div>
        <v-divider class="mt-2" />
        <span class="text-overline no-height">System Points</span>
        <cc-tooltip
          :title="`${mech.MaxSP} System Points`"
          :content="mech.SPContributors.join('<br />')"
        >
          <span class="heading h3 no-height">&nbsp;{{ mech.MaxSP }}</span>
        </cc-tooltip>
      </div>
    </v-col>
    <v-col>
      <v-row align="center">
        <v-col>
          <v-row dense>
            <statblock-item
              attr="Structure"
              :val="mech.MaxStructure"
              :contributors="mech.StructureContributors"
              :color="color"
            />
            <statblock-item
              attr="HP"
              :val="mech.MaxHP"
              :contributors="mech.HPContributors"
              :color="color"
            />

            <statblock-item
              attr="Armor"
              :val="mech.Armor"
              :contributors="mech.ArmorContributors"
              :color="color"
            />
          </v-row>

          <v-row dense>
            <statblock-item
              attr="Stress"
              :val="mech.MaxStress"
              :contributors="mech.StressContributors"
              :color="color"
            />
            <statblock-item
              attr="Heat Capacity"
              :val="mech.HeatCapacity"
              :contributors="mech.HeatCapContributors"
              :color="color"
            />
            <statblock-item
              attr="Repair Capacity"
              :val="mech.RepairCapacity"
              :contributors="mech.RepCapContributors"
              :color="color"
            />
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-icon size="120" :color="color" :icon="mech.SizeIcon" />
        </v-col>
      </v-row>
      <v-row dense>
        <statblock-item
          attr="Attack Bonus"
          signed
          :val="mech.AttackBonus"
          :contributors="mech.AttackBonusContributors"
          :color="color"
        />
        <statblock-item
          attr="Tech Attack"
          signed
          :val="mech.TechAttack"
          :contributors="mech.TechAttackContributors"
          :color="color"
        />
        <statblock-item
          attr="Limited System Bonus"
          signed
          :val="mech.LimitedBonus"
          :contributors="mech.LimitedContributors"
          :color="color"
        />
      </v-row>
      <v-row dense>
        <statblock-item
          attr="Speed"
          :val="mech.Speed"
          :contributors="mech.SpeedContributors"
          :color="color"
        />
        <statblock-item
          attr="Evasion"
          :val="mech.Evasion"
          :contributors="mech.EvasionContributors"
          :color="color"
        />
        <statblock-item
          attr="E-Defense"
          :val="mech.EDefense"
          :contributors="mech.EDefenseContributors"
          :color="color"
        />
        <statblock-item
          attr="Sensors"
          :val="mech.SensorRange"
          :contributors="mech.SensorRangeContributors"
          :color="color"
        />
        <statblock-item
          attr="Save"
          :val="mech.SaveTarget"
          :contributors="mech.SaveTargetContributors"
          :color="color"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import StatblockItem from './StatblockItem.vue';
import HasePips from './HasePips.vue';

export default {
  name: 'attributes-block',
  components: { StatblockItem, HasePips },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
