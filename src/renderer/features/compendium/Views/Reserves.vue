<template>
  <div>
    <h1 class="heading mb-3 ml-5">RESERVES & DOWNTIME</h1>
    <span class="heading mech">Downtime Actions</span>
    <v-card class="mt-3" flat color="grey lighten-4">
      <v-card-text class="body-text text--text">
        <p class="px-4 my-2">
          These story actions represent what pilots gets up to during a stretch of downtime.
          <br />
          Unlike a regular skill check, these downtime actions have specific outcomes depending on
          whether you hit, miss, or roll a 20+, and usually ask you to choose from a list.
          <strong>Like regular skill checks, triggers can activate on downtime actions.</strong>
          The actual trigger that activates is dependent on context.
          <br />
          As a good rule, a pilot can do only
          <strong>one</strong>
          of these during downtime, and
          <strong>one or two</strong>
          if the downtime is especially long. You can always keep the outcomes of these actions as
          reserves for the next mission.
        </p>
      </v-card-text>
    </v-card>

    <v-container grid-list-md fluid>
      <v-layout wrap fill-height justify-center>
        <action-card v-for="a in downtimeActions" :key="a.id" :action="a" downtime />
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionCard from '../UI/ActionCard.vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'reference',
  components: { ActionCard },
  data: () => ({
    downtimeActions: [],
  }),
  created() {
    this.downtimeActions = actions.filter(x => x.action_type === 'downtime')
  },
})
</script>
