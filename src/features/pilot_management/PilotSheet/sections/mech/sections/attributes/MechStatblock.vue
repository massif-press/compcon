<template>
  <v-row dense>
    <v-col v-if="!!$slots.prepend"
      cols="12"
      md="auto"
      class="mr-3">
      <slot name="prepend" />
    </v-col>
    <v-col>
      <v-row align="center"
        no-gutters>
        <v-col>
          <v-row justify="space-between"
            no-gutters>
            <statblock-item v-if="mobile"
              cols="3"
              sm="3"
              :attr="$t('ui.titles.size')"
              :icon="mech.SizeIcon"
              :val="mech.Size"
              :contributors="mech.SizeContributors"
              :bonuses="getBonuses('size')"
              :color="color" />
            <statblock-item cols="3"
              sm=""
              md="4"
              :attr="$t('stats.structure')"
              icon="cc:structure"
              :val="mech.MaxStructure"
              :contributors="mech.StructureContributors"
              :bonuses="getBonuses('structure')"
              :color="color" />
            <statblock-item cols="3"
              sm=""
              md=""
              :attr="$t('stats.hp')"
              icon="mdi-heart"
              :val="mech.MaxHP"
              :contributors="mech.HPContributors"
              :bonuses="getBonuses('hp')"
              :color="color" />
            <statblock-item cols="3"
              sm=""
              md="4"
              :attr="$t('stats.armor')"
              :val="mech.Armor"
              icon="mdi-shield"
              :contributors="mech.ArmorContributors"
              :bonuses="getBonuses('armor')"
              :color="color" />
            <statblock-item cols="4"
              sm="4"
              md="4"
              :attr="$t('stats.stress')"
              :val="mech.MaxStress"
              icon="cc:reactor"
              :contributors="mech.StressContributors"
              :bonuses="getBonuses('stress')"
              :color="color" />
            <statblock-item cols="4"
              sm=""
              md=""
              :attr="mobile ? $t('compendium.titles.heatcap') : $t('ui.titles.heatCapacity')"
              icon="cc:heat"
              :val="mech.HeatCapacity"
              :contributors="mech.HeatCapContributors"
              :bonuses="getBonuses('heatcap')"
              :color="color" />
            <statblock-item cols="4"
              sm="4"
              md="4"
              :attr="mobile ? $t('compendium.titles.repcap') : $t('ui.titles.repairCapacity')"
              icon="cc:repair"
              :val="mech.RepairCapacity"
              :contributors="mech.RepCapContributors"
              :bonuses="getBonuses('repcap')"
              :color="color" />
          </v-row>
        </v-col>
        <v-col v-if="!mobile"
          cols="auto">
          <div style="position: relative">
            <v-icon size="120"
              :color="color"
              :icon="mech.SizeIcon" />
            <v-icon size="110"
              style="
                position: absolute;
                top: 50%;
                bottom: 50%;
                left: 50%;
                right: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
              "
              icon="mdi-hexagon" />
          </div>
        </v-col>
      </v-row>
      <v-row align="center"
        no-gutters
        justify="space-between">
        <statblock-item cols="3"
          sm="4"
          md="3"
          :attr="$t('common.limitedBonus')"
          signed
          icon="cc:ammo"
          :val="mech.LimitedBonus"
          :contributors="mech.LimitedContributors"
          :bonuses="getBonuses('limited_bonus')"
          :color="color" />
        <statblock-item cols="4"
          sm="3"
          :attr="$t('common.attackBonus')"
          signed
          icon="cc:weapon"
          :val="mech.AttackBonus"
          :contributors="mech.AttackBonusContributors"
          :bonuses="getBonuses('attack')"
          :color="color" />
        <statblock-item :attr="$t('stats.speed')"
          sm=""
          :val="mech.Speed"
          icon="mdi-arrow-right-bold-hexagon-outline"
          :contributors="mech.SpeedContributors"
          :bonuses="getBonuses('speed')"
          :color="color" />
        <statblock-item cols="4"
          sm="2"
          md="3"
          :attr="$t('stats.evasion')"
          icon="cc:evasion"
          :val="mech.Evasion"
          :contributors="mech.EvasionContributors"
          :bonuses="getBonuses('evasion')"
          :color="color" />
        <statblock-item cols="4"
          sm="3"
          md="3"
          :attr="mobile ? $t('compendium.titles.techatk') : $t('common.techAttack')"
          icon="cc:full_tech"
          signed
          :val="mech.TechAttack"
          :contributors="mech.TechAttackContributors"
          :bonuses="getBonuses('tech_attack')"
          :color="color" />
        <statblock-item cols="4"
          sm="3"
          md=""
          icon="cc:edef"
          :attr="mobile ? $t('compendium.titles.edef') : $t('common.electronicDefense')"
          :val="mech.EDefense"
          :contributors="mech.EDefenseContributors"
          :bonuses="getBonuses('edef')"
          :color="color" />
        <statblock-item cols="6"
          sm="3"
          :attr="$t('stats.sensors')"
          icon="cc:sensor"
          :val="mech.SensorRange"
          :contributors="mech.SensorRangeContributors"
          :bonuses="getBonuses('sensor')"
          :color="color" />
        <statblock-item cols="6"
          sm=""
          md="3"
          :attr="$t('common.save')"
          icon="cc:save"
          :val="mech.SaveTarget"
          :contributors="mech.SaveTargetContributors"
          :bonuses="getBonuses('save')"
          :color="color" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import StatblockItem from './StatblockItem.vue';
import { Mech } from '@/classes/mech/Mech'

const props = defineProps({
  mech: {
    type: Mech,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
})

const { smAndDown: mobile } = useDisplay()

function getBonuses(key: string): any[] {
  return (props.mech as Mech).FeatureController.Bonuses.filter((x) => x.ID === key)
}
</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
