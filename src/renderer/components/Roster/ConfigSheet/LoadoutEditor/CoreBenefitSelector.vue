<template>
<div>
  <v-card-title class="title">Add or Remove Core Bonus Improvements</v-card-title>
  <v-card-text class="text-xs-center">
    <v-btn-toggle v-model="bonus_toggle" multiple class="mb-2">
      <v-btn v-for="b in pendingBonuses" :key="b" :value="b">&nbsp;{{item(b).name}}&nbsp;</v-btn>
      <v-btn v-for="b in appliedBonuses" :key="b" :value="b">&nbsp;{{item(b).name}}&nbsp;</v-btn>
    </v-btn-toggle>
    <v-divider class="ma-3"/>
    <i>Applied Bonuses:</i>
    <v-card v-for="b in bonus_toggle" :key="'bt_' + b" class="mb-2 mt-1 ml-5 mr-5" color="blue-grey darken-4">
      <v-card-text>{{item(b).effect}}</v-card-text>
    </v-card>
  </v-card-text>
  <v-card-actions>
    <v-btn flat @click="cancel" > Cancel </v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="confirm" > Confirm </v-btn>
  </v-card-actions>
</div> 
</template>

<script>
  export default {
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
      pilot: function () {
        return this.$store.getters.getPilot
      },
      allAppliedCbs: function () {
        var applied = []
        for (var i = 0; i < this.loadout.mounts.length; i++) {
          if (this.loadout.mounts[i].bonuses) applied = applied.concat(this.loadout.mounts[i].bonuses)
        }
        return applied
      }
    },
    methods: {
      item: function (id) {
        return this.$store.getters.getItemById('CoreBonuses', id)
      },
      cancel: function () {
        this.$emit('cancel')
      },
      confirm: function () {
        this.$emit('confirm', this.bonus_toggle)
      }
    },
    mounted: function () {
      this.appliedBonuses = this.mount.bonuses || []
      this.pendingBonuses = ['hardpoints', 'burnout', 'intweapon', 'retrofit'].filter(x => this.pilot.core_bonuses.includes(x) && !this.allAppliedCbs.includes(x))
      this.bonus_toggle = this.appliedBonuses
    }
  }
</script>