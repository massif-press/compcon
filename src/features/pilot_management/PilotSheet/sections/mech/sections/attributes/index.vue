<template>
  <v-row dense>
    <v-col cols="12" md="auto" class="mr-3">
      <hase-pips
        :mech="mech"
        attr="hull"
        :val="pilot.MechSkillsController.MechSkills.Hull"
        :color="color" />
      <hase-pips
        :mech="mech"
        attr="agility"
        :val="pilot.MechSkillsController.MechSkills.Agi"
        :color="color" />
      <hase-pips
        :mech="mech"
        attr="systems"
        :val="pilot.MechSkillsController.MechSkills.Sys"
        :color="color" />
      <hase-pips
        :mech="mech"
        attr="engineering"
        :val="pilot.MechSkillsController.MechSkills.Eng"
        :color="color" />
      <div>
        <v-divider class="mt-2" />
        <span class="text-overline no-height">System Points</span>
        <v-tooltip>
          <template #activator="{ props }">
            <span v-bind="props" class="heading h3 no-height text-accent">
              &nbsp;{{ mech.MaxSP }}
            </span>
          </template>
          <div class="heading h4" v-text="`${mech.MaxSP} System Points`" />
          <v-divider />
          <p class="py-2" v-html="mech.SPContributors.join('<br />')" />
        </v-tooltip>
      </div>
    </v-col>
    <v-col>
      <v-row align="center" no-gutters>
        <v-col>
          <v-row justify="space-between" no-gutters>
            <statblock-item
              v-if="mobile"
              cols="3"
              sm="3"
              attr="Size"
              :icon="mech.SizeIcon"
              :val="mech.Size"
              :contributors="mech.SizeContributors"
              :color="color" />
            <statblock-item
              cols="3"
              sm=""
              md="4"
              :attr="portrait ? 'Struct' : 'Structure'"
              icon="cc:structure"
              :val="mech.MaxStructure"
              :contributors="mech.StructureContributors"
              :color="color" />
            <statblock-item
              cols="3"
              sm=""
              md=""
              attr="HP"
              icon="mdi-heart"
              :val="mech.MaxHP"
              :contributors="mech.HPContributors"
              :color="color" />
            <statblock-item
              cols="3"
              sm=""
              md="4"
              attr="Armor"
              :val="mech.Armor"
              icon="mdi-shield"
              :contributors="mech.ArmorContributors"
              :color="color" />
            <statblock-item
              cols="4"
              sm="4"
              md="4"
              attr="Stress"
              :val="mech.MaxStress"
              icon="cc:reactor"
              :contributors="mech.StressContributors"
              :color="color" />
            <statblock-item
              cols="4"
              sm=""
              md=""
              :attr="portrait ? 'Heatcap' : 'Heat Capacity'"
              icon="cc:heat"
              :val="mech.HeatCapacity"
              :contributors="mech.HeatCapContributors"
              :color="color" />
            <statblock-item
              cols="4"
              sm="4"
              md="4"
              :attr="portrait ? 'Repcap' : 'Repair Capacity'"
              icon="cc:repair"
              :val="mech.RepairCapacity"
              :contributors="mech.RepCapContributors"
              :color="color" />
          </v-row>
        </v-col>
        <v-col cols="auto" v-if="!mobile">
          <v-icon size="120" :color="color" :icon="mech.SizeIcon" />
        </v-col>
      </v-row>
      <v-row align="center" no-gutters justify="space-between">
        <statblock-item
          cols="3"
          sm="4"
          md="3"
          :attr="portrait ? '+ LTD SYS' : widescreen ? 'Limited System Bonus' : 'Limited Sys Bonus'"
          signed
          :val="mech.LimitedBonus"
          :contributors="mech.LimitedContributors"
          :color="color" />
        <statblock-item
          cols="4"
          sm="3"
          :attr="portrait ? 'ATK Bonus' : 'Attack Bonus'"
          signed
          :val="mech.AttackBonus"
          :contributors="mech.AttackBonusContributors"
          :color="color" />
        <statblock-item
          attr="Speed"
          sm=""
          :val="mech.Speed"
          :contributors="mech.SpeedContributors"
          :color="color" />
        <statblock-item
          cols="4"
          sm="2"
          md="3"
          attr="Evasion"
          :val="mech.Evasion"
          :contributors="mech.EvasionContributors"
          :color="color" />
        <statblock-item
          cols="4"
          sm="3"
          md="3"
          :attr="portrait ? 'Tech ATK' : 'Tech Attack'"
          signed
          :val="mech.TechAttack"
          :contributors="mech.TechAttackContributors"
          :color="color" />
        <statblock-item
          cols="4"
          sm="3"
          md=""
          :attr="portrait ? 'EDEF' : 'E-Defense'"
          :val="mech.EDefense"
          :contributors="mech.EDefenseContributors"
          :color="color" />
        <statblock-item
          cols="6"
          sm="3"
          attr="Sensors"
          :val="mech.SensorRange"
          :contributors="mech.SensorRangeContributors"
          :color="color" />
        <statblock-item
          cols="6"
          sm=""
          md="3"
          attr="Save"
          :val="mech.SaveTarget"
          :contributors="mech.SaveTargetContributors"
          :color="color" />
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
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
    widescreen(): boolean {
      return this.$vuetify.display.lgAndUp;
    },
  },
};
</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
