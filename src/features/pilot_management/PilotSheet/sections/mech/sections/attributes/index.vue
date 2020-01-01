<template>
  <v-col>
    <cc-title small :color="color">Mech Attributes</cc-title>
    <v-row no-gutters>
      <v-col cols="1" class="mr-3">
        <hase-pips attr="hull" :val="pilot.MechSkills.Hull" :color="color" />
        <hase-pips attr="agility" :val="pilot.MechSkills.Agi" :color="color" />
        <hase-pips attr="systems" :val="pilot.MechSkills.Sys" :color="color" />
        <hase-pips attr="engineering" :val="pilot.MechSkills.Eng" :color="color" />
        <v-divider class="mt-2" />
        <span class="overline no-height">System Points</span>
        <cc-tooltip
          :title="`${mech.MaxSP} System Points`"
          :content="mech.SPContributors.join('<br />')"
        >
          <span class="heading h3 no-height">&nbsp;{{ mech.MaxSP }}</span>
        </cc-tooltip>
      </v-col>
      <v-col>
        <v-row no-gutters align="center">
          <v-col>
            <v-row no-gutters>
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

            <v-row no-gutters>
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
            <v-icon size="120" :color="color" class="px-4 mt-n2">
              cci-size-{{ mech.size === 0.5 ? 'half' : mech.Size }}
            </v-icon>
          </v-col>
        </v-row>
        <v-row no-gutters>
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
        <v-row no-gutters>
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
            attr="Sensor Range"
            :val="mech.SensorRange"
            :contributors="mech.SensorRangeContributors"
            :color="color"
          />
          <statblock-item
            attr="Save Target"
            :val="mech.SaveTarget"
            :contributors="mech.SaveTargetContributors"
            :color="color"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import StatblockItem from './StatblockItem.vue'
import HasePips from './HasePips.vue'

export default Vue.extend({
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
})
</script>

<style scoped>
.no-height {
  line-height: 0;
}
</style>
