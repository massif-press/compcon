<template>
  <v-container>
    <h1 class="heading">Per Turn</h1>
    <v-card color="panel" elevation-10>
      <v-card-text>
        <v-row justify="center" density="compact">
          <v-col :cols="$vuetify.display.mdAndDown ? 12 : 4" class="effect-text text-center">
            Full Action
            <i class="text-disabled text--darken-1">or&nbsp</i>
            2 Quick Actions
            <br />
            <v-card tile color="action--full" class="text-center pt-4 pb-4">
              <v-icon size="100" dark>mdi-hexagon-slice-6</v-icon>
              <v-icon size="50" color="indigo lighten-3">mdi-swap-horizontal</v-icon>
              <v-icon size="65" dark>mdi-hexagon-slice-3</v-icon>
              <v-icon size="65" dark>mdi-hexagon-slice-3</v-icon>
            </v-card>
          </v-col>
          <v-col
            v-for="a in actionTypes"
            style="min-width: 12vw"
            class="effect-text text-center text-capitalize">
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
</template>

<script lang="ts">
import ActionCard from '../_components/ActionCard.vue';

export default {
  name: 'action-economy',
  components: { ActionCard },
  props: {
    isModal: {
      type: Boolean,
    },
  },
  data: () => ({
    actionTypes: [
      { action: 'move', icon: 'mdi-arrow-right-bold-hexagon-outline' },
      { action: 'overcharge', icon: 'cc:overcharge' },
      { action: 'reaction', icon: 'cc:reaction' },
      { action: 'free', icon: 'cc:free' },
    ],
  }),
};
</script>
