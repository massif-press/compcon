<template>
  <div>
    <h1 class="heading ml-5">ACTION ECONOMY</h1>
    <v-container>
      <h2 class="heading mech">Per Turn</h2>
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
            <v-col
              v-for="a in actionTypes"
              :key="`atc_${a.action}`"
              sm="6"
              lg="2"
              class="effect-text text-center text-capitalize"
            >
              {{ a.action }}
              <br />
              <v-card tile :color="`action--${a.action}`" class="pt-4 pb-4">
                <v-icon size="100" dark>{{ a.icon }}</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container fluid>
      <v-row class="mt-3">
        <v-divider class="mt-5" />
        <v-icon x-large color="panel-border">cci-frame</v-icon>
        <v-divider class="mt-5" />
      </v-row>
      <v-row fill-height justify="center">
        <action-card v-for="a in actions" :key="a.id" :action="a" />
      </v-row>
      <v-row class="mt-3">
        <v-divider class="mt-5" />
        <v-icon x-large color="panel-border">cci-pilot</v-icon>
        <v-divider class="mt-5" />
      </v-row>
      <v-row fill-height justify="center">
        <action-card v-for="a in pilotActions" :key="a.id" :action="a" />
      </v-row>
      <v-row class="mt-3">
        <v-divider class="mt-5" />
        <v-icon x-large color="panel-border">cci-downtime</v-icon>
        <v-divider class="mt-5" />
      </v-row>
      <v-row fill-height justify="center">
        <action-card v-for="a in downtimeActions" :key="a.id" :action="a" />
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionCard from '../components/ActionCard.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'action-economy',
  components: { ActionCard },
  data: () => ({
    actionTypes: [
      { action: 'move', icon: '$vuetify.icons.move' },
      { action: 'overcharge', icon: 'cci-overcharge' },
      { action: 'reaction', icon: 'cci-reaction' },
      { action: 'free', icon: 'cci-free' },
    ],
    actions: [],
    pilotActions: [],
    downtimeActions: [],
  }),
  async created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.actions = await compendium.Actions.filter(
      a => a && !a.IsDowntimeAction && !a.IsPilotAction
    )
    this.pilotActions = await compendium.Actions.filter(a => a && a.IsPilotAction)
    this.downtimeActions = await compendium.Actions.filter(a => a && a.IsDowntimeAction)
  },
})
</script>
