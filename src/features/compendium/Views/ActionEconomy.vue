<template>
  <div>
    <h1 class="heading mb-3 ml-5">ACTION ECONOMY</h1>
    <v-container>
      <span class="heading mech">Per Turn</span>
      <v-card color="panel" elevation-10>
        <v-card-text>
          <v-row justify="center" dense>
            <action-type-card action="move" />
            <v-col cols="3" class="effect-text text-center">
              Full Action
              <i class="grey--text text--darken-1">or</i>
              2 Quick Actions
              <br />
              <v-card tile color="action--full" width="100%" class="text-center pt-4 pb-4">
                <v-icon size="100" dark>$vuetify.icons.full</v-icon>
                <v-icon size="50" color="indigo lighten-3">mdi-swap-horizontal</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
              </v-card>
            </v-col>
            <action-type-card action="overcharge" />
            <action-type-card action="reaction" />
            <action-type-card action="free" />
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container grid-list-md fluid>
      <v-row wrap fill-height justify="center">
        <action-card v-for="a in actions" :key="a.id" :action="a" />
      </v-row>
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
