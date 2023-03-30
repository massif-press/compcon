<template>
  <div>
    <h1 class="heading ml-5">ACTION ECONOMY</h1>
    <v-container>
      <h2 class="heading mech">Per Turn</h2>
      <v-card color="panel" elevation-10>
        <v-card-text>
          <v-row justify="center" density="compact">
            <v-col
              :cols="$vuetify.display.smAndDown ? 12 : 4"
              class="effect-text text-center"
            >
              Full Action
              <i class="text-subtle text--darken-1">or</i>
              2 Quick Actions
              <br />
              <v-card
                tile
                color="action--full"
                width="100%"
                class="text-center pt-4 pb-4"
              >
                <v-icon size="100" dark>$vuetify.icons.full</v-icon>
                <v-icon size="50" color="indigo lighten-3"
                  >mdi-swap-horizontal</v-icon
                >
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
                <v-icon size="65" dark>$vuetify.icons.quick</v-icon>
              </v-card>
            </v-col>
            <v-col
              v-for="a in actionTypes"
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
        <v-icon size="x-large" color="panel-border">cc:frame</v-icon>
        <v-divider class="mt-5" />
      </v-row>
      <v-row fill-height justify="center">
        <action-card v-for="a in actions" />
      </v-row>
      <v-row class="mt-3">
        <v-divider class="mt-5" />
        <v-icon size="x-large" color="panel-border">cc:pilot</v-icon>
        <v-divider class="mt-5" />
      </v-row>
      <v-row fill-height justify="center">
        <action-card v-for="a in pilotActions" />
      </v-row>
      <v-row class="mt-3">
        <v-divider class="mt-5" />
        <v-icon size="x-large" color="panel-border">cc:downtime</v-icon>
        <v-divider class="mt-5" />
      </v-row>
      <v-row fill-height justify="center">
        <action-card v-for="a in downtimeActions" />
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ActionCard from '../components/ActionCard.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'action-economy',
  components: { ActionCard },
  data: () => ({
    actionTypes: [
      { action: 'move', icon: '$vuetify.icons.move' },
      { action: 'overcharge', icon: 'cc:overcharge' },
      { action: 'reaction', icon: 'cc:reaction' },
      { action: 'free', icon: 'cc:free' },
    ],
    actions: [],
    pilotActions: [],
    downtimeActions: [],
  }),
  async created() {
    const compendium = CompendiumStore();
    this.actions = await compendium.Actions.filter(
      (a) => a && !a.IsDowntimeAction && !a.IsPilotAction
    );
    this.pilotActions = await compendium.Actions.filter(
      (a) => a && a.IsPilotAction
    );
    this.downtimeActions = await compendium.Actions.filter(
      (a) => a && a.IsDowntimeAction
    );
  },
};
</script>
