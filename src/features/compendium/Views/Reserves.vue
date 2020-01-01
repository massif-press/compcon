<template>
  <div>
    <h1 class="heading mb-3 ml-5">RESERVES & DOWNTIME</h1>
    <span class="heading mech">Reserves</span>
    <v-container grid-list-md fluid>
      <v-row wrap fill-height justify="center">
        <reserve-card v-for="r in reserves" :key="r.id" :reserve="r" />
      </v-row>
    </v-container>
    <span class="heading mech">Downtime Actions</span>
    <v-container grid-list-md fluid>
      <v-row wrap fill-height justify="center">
        <action-card v-for="a in downtimeActions" :key="a.id" :action="a" downtime />
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionCard from '../UI/ActionCard.vue'
import ReserveCard from '../UI/ReserveCard.vue'
import { actions, reserves } from 'lancer-data'

export default Vue.extend({
  name: 'reference',
  components: { ActionCard, ReserveCard },
  data: () => ({
    downtimeActions: [],
    reserves: [],
  }),
  created() {
    this.downtimeActions = actions.filter(x => x.action_type === 'downtime')
    this.reserves = reserves
  },
})
</script>
