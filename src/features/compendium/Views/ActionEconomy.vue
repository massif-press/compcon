<template>
  <div>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading ml-5">ACTION ECONOMY</h1>
    <v-container>
      <h2 v-resize-text="{ maxFontSize: '36pt' }" class="heading mech">Per Turn</h2>
      <v-card color="panel" elevation-10>
        <v-card-text>
          <v-row justify="center" dense>
            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 4" class="effect-text text-center">
              Full Action
              <i class="subtle--text text--darken-1">or</i>
              2 Quick Actions
              <br />
              <v-card tile color="action--full" width="100%" class="text-center pt-4 pb-4">
                <v-icon size="100" dark>$vuetify.icons.full</v-icon>
                <v-icon size="50" color="indigo lighten-3">mdi-swap-horizontal</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
              </v-card>
            </v-col>
            <action-type-card icon="$vuetify.icons.move" action="move" />
            <action-type-card icon="cci-overcharge" action="overcharge" />
            <action-type-card icon="cci-reaction" action="reaction" />
            <action-type-card icon="cci-free-action" action="free" />
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container grid-list-md fluid>
      <v-row fill-height justify="center">
        <action-card v-for="a in actions" :key="a.id" :action="a" />
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionTypeCard from '../components/ActionTypeCard.vue'
import ActionCard from '../components/ActionCard.vue'
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
