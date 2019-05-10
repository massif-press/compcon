<template>
  <div>
    <v-card-title class="title">Add or Remove Core Bonus Improvements</v-card-title>
    <v-card-text class="text-xs-center">
      <v-btn-toggle v-model="bonus_toggle" multiple class="mb-2">
        <v-btn v-for="b in pendingBonuses" :key="b" :value="b">&nbsp;{{getCoreBonus(b).name}}&nbsp;</v-btn>
        <v-btn v-for="b in appliedBonuses" :key="b" :value="b">&nbsp;{{getCoreBonus(b).name}}&nbsp;</v-btn>
      </v-btn-toggle>
      <v-divider class="ma-3"/>
      <i>Applied Bonuses:</i>
      <v-card v-for="b in bonus_toggle" :key="'bt_' + b" 
        class="mb-2 mt-1 ml-5 mr-5" color="blue-grey darken-4">
        <v-card-text>{{getCoreBonus(b).effect}}</v-card-text>
      </v-card>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click="cancel" > Cancel </v-btn>
      <v-spacer />
      <v-btn color="primary" @click="confirm" > Confirm </v-btn>
    </v-card-actions>
  </div> 
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'core-benefit-selector',
    props: {
      loadout: Object,
      mount: Object
    },
    data: () => ({
      bonus_toggle: [],
      appliedBonuses: [],
      pendingBonuses: []
    }),
    computed: {
      pilot (): Pilot {
        return this.$store.getters['getPilot']
      },
      allAppliedCbs () {
        var applied = [] as any[]
        for (var i = 0; i < this.loadout.mounts.length; i++) {
          if (this.loadout.mounts[i].bonuses) applied = applied.concat(this.loadout.mounts[i].bonuses)
        }
        return applied
      }
    },
    methods: {
      cancel () {
        this.$emit('cancel')
      },
      confirm () {
        this.$emit('confirm', this.bonus_toggle)
      }
    },
    created () {
      var vm = this as any
      vm.appliedBonuses = vm.mount.bonuses || []
      vm.pendingBonuses = ['hardpoints', 'burnout', 'intweapon', 'retrofit'].filter(x => vm.pilot.core_bonuses.includes(x) && !vm.allAppliedCbs.includes(x))
      vm.bonus_toggle = this.appliedBonuses
    }
  })
</script>
