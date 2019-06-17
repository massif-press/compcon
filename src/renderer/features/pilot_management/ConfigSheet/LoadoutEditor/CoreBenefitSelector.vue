<template>
  <div>
    <v-card-title class="title">
      Add or Remove Core Bonus Improvements
    </v-card-title>
    <v-card-text class="text-xs-center">
      <v-layout justify-center wrap>
        <v-flex xs12 v-if="pilot.has('CoreBonus', 'hardpoints')">
          <v-btn
            large
            block
            v-if="appliedHardpoints()"
            @click="removeHardpoints()"
          >
            Uninstall Auto-Stabilizing Hardpoints
          </v-btn>
          <v-btn
            large
            block
            v-else-if="unappliedHardpoints()"
            @click="addHardpoints()"
          >
            Install Auto-Stabilizing Hardpoints
          </v-btn>
        </v-flex>
        <v-flex xs12 v-if="pilot.has('CoreBonus', 'burnout')">
          <v-btn large block v-if="appliedBurnout()" @click="removeBurnout()">
            Uninstall BURNOUT Insulation
          </v-btn>
          <v-btn
            large
            block
            v-else-if="unappliedBurnout()"
            @click="addBurnout()"
          >
            Install BURNOUT Insulation
          </v-btn>
        </v-flex>
        <v-flex xs12 v-if="pilot.has('CoreBonus', 'retrofit')">
          <v-btn large block v-if="appliedRetrofit()" @click="removeRetrofit()">
            Restore Original Mount
          </v-btn>
          <v-btn large block v-if="unappliedRetrofit()" @click="addRetrofit()">
            Retrofit Mount
          </v-btn>
        </v-flex>
      </v-layout>
      <v-divider class="ma-3" />
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click="close">Cancel</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { Pilot, MechLoadout, EquippableMount, CoreBonus } from '@/class'

export default Vue.extend({
  name: 'core-benefit-selector',
  props: {
    loadout: MechLoadout,
    mount: EquippableMount,
  },
  data: () => ({
    bonus_toggle: [],
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
  },
  methods: {
    unappliedHardpoints(): boolean {
      return !this.loadout
        .AllEquippableMounts(true)
        .flatMap(x => x.BonusEffects)
        .some(y => y.ID === 'hardpoints')
    },
    appliedHardpoints(): boolean {
      return this.mount.BonusEffects.some(x => x.ID === 'hardpoints')
    },
    addHardpoints() {
      this.mount.AddCoreBonus(
        this.$store.getters.getItemById('CoreBonuses', 'hardpoints')
      )
      this.$emit('close')
    },
    removeHardpoints() {
      this.mount.RemoveCoreBonus(
        this.$store.getters.getItemById('CoreBonuses', 'hardpoints')
      )
      this.$emit('close')
    },
    unappliedBurnout(): boolean {
      return !this.loadout
        .AllEquippableMounts(true)
        .flatMap(x => x.BonusEffects)
        .some(y => y.ID === 'burnout')
    },
    appliedBurnout(): boolean {
      return this.mount.BonusEffects.some(x => x.ID === 'burnout')
    },
    addBurnout() {
      this.mount.AddCoreBonus(
        this.$store.getters.getItemById('CoreBonuses', 'burnout')
      )
      this.$emit('close')
    },
    removeBurnout() {
      this.mount.RemoveCoreBonus(
        this.$store.getters.getItemById('CoreBonuses', 'burnout')
      )
      this.$emit('close')
    },
    unappliedRetrofit(): boolean {
      return (
        this.pilot.has('CoreBonus', 'retrofit') && !this.loadout.IsRetrofitted
      )
    },
    appliedRetrofit(): boolean {
      return (
        this.loadout.IsRetrofitted &&
        _.isEqual(this.mount, this.loadout.RetrofittedMount)
      )
    },
    addRetrofit() {
      this.loadout.RetrofitMount(
        this.loadout
          .AllEquippableMounts(true)
          .findIndex(x => _.isEqual(x, this.mount))
      )
      this.$emit('close')
    },
    removeRetrofit() {
      this.loadout.RemoveRetrofitting()
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    },
  },
})
</script>
