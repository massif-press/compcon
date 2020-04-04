<template>
  <v-col>
    <div class="ml-n3">
      <cc-title small :color="color" class="pl-3">
        Mech Attributes
      </cc-title>
    </div>
    <v-row no-gutters>
      <v-col cols="1" class="mr-3">
        <hase-pips attr="hull" :val="pilot.MechSkills.Hull" :color="color" />
        <hase-pips attr="agility" :val="pilot.MechSkills.Agi" :color="color" />
        <hase-pips attr="systems" :val="pilot.MechSkills.Sys" :color="color" />
        <hase-pips attr="engineering" :val="pilot.MechSkills.Eng" :color="color" />
        <v-divider class="mt-2" />
        <span v-if="$vuetify.breakpoint.lgAndUp" class="overline no-height">System Points</span>
        <span v-else class="overline no-height">SP</span>
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
                :attr="$vuetify.breakpoint.lgAndUp ? 'Heat Capacity' : 'Heat Cap'"
                :val="mech.HeatCapacity"
                :contributors="mech.HeatCapContributors"
                :color="color"
              />
              <statblock-item
                :attr="$vuetify.breakpoint.lgAndUp ? 'Repair Capacity' : 'Repair Cap'"
                :val="mech.RepairCapacity"
                :contributors="mech.RepCapContributors"
                :color="color"
              />
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-icon size="120" :color="color" class="px-4 mt-n2">
              {{ mech.SizeIcon }}
            </v-icon>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Attack Bonus' : 'Atk Bonus'"
            signed
            :val="mech.AttackBonus"
            :contributors="mech.AttackBonusContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Tech Attack' : 'Tech Atk'"
            signed
            :val="mech.TechAttack"
            :contributors="mech.TechAttackContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Limited System Bonus' : 'Limited Bonus'"
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
            :attr="$vuetify.breakpoint.lgAndUp ? 'E-Defense' : 'E-Def'"
            :val="mech.EDefense"
            :contributors="mech.EDefenseContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Sensor Range' : 'Sensors'"
            :val="mech.SensorRange"
            :contributors="mech.SensorRangeContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Save Target' : 'Save'"
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
