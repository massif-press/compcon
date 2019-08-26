<template>
  <div>
    <h1 class="heading mb-3 ml-5">ACTION ECONOMY</h1>
    <v-card class="mt-3" flat color="grey lighten-4">
      <v-card-text class="body-text text--text">
        <p class="px-4 my-2">
          On a turn, players can perform a move, and either two quick actions or one full action,
          with no duplicate actions allowed. Players can overcharge their mechs to gain an extra
          quick action at the cost of heat, and all characters can also take any number of Free
          Actions on their turn, and any number of reactions per round, even outside their turn.
          <br />
          <br />
          Pilots on foot can take the following actions and reactions :
          <strong>
            BOOST, HIDE, SEARCH, ACTIVATE, SKILL CHECK, DISENGAGE, PREPARE, OVERWATCH, BRACE
          </strong>
          , as well as the two pilot-specific actions:
          <strong>FIGHT</strong>
          and
          <strong>JOCKEY</strong>
        </p>
      </v-card-text>
    </v-card>
    <v-container>
      <span class="heading mech">Per Turn</span>
      <v-card color="grey lighten-5" elevation-10>
        <v-card-text>
          <v-layout justify-center row>
            <action-type-card action="move" />
            <v-flex xs3 class="effect-text text-center ml-2 mr-2">
              Full Action
              <i class="grey--text">or</i>
              2 Quick Actions
              <br />
              <v-card tile color="action-full" width="100%" class="text-center pt-4 pb-4">
                <v-icon size="100" dark>$vuetify.icons.full</v-icon>
                <v-icon size="50" color="indigo lighten-3">mdi-swap-horizontal</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
              </v-card>
            </v-flex>
            <action-type-card action="overcharge" />
            <action-type-card action="reaction" />
            <action-type-card action="free" />
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container grid-list-md fluid>
      <v-layout wrap fill-height justify-center>
        <action-card v-for="a in actions" :key="a.id" :action="a" />
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionTypeCard from '../UI/ActionTypeCard.vue'
import ActionCard from '../UI/ActionCard.vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'reference',
  components: { ActionTypeCard, ActionCard },
  data: () => ({
    actions: [],
  }),
  created() {
    this.actions = actions.filter(x => x.action_type !== 'downtime' && !x.reserve)
  },
})
</script>
