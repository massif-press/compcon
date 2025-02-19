<template>
  <v-window-item>
    <v-container>
      <h1 class="heading">Per Turn</h1>
      <v-card color="panel" elevation-10>
        <v-card-text>
          <v-row justify="center" dense>
            <v-col cols="12" md="4" class="effect-text text-center">
              Full Action
              <i class="text-disabled text--darken-1">or&nbsp</i>
              2 Quick Actions
              <br />
              <v-card tile flat color="action--full" class="text-center py-3">
                <v-icon :size="mobile ? 50 : 100" dark>mdi-hexagon-slice-6</v-icon>
                <v-icon :size="mobile ? 50 : 50" color="indigo lighten-3">
                  mdi-swap-horizontal
                </v-icon>
                <v-icon :size="mobile ? 50 : 65" dark>mdi-hexagon-slice-3</v-icon>
                <v-icon :size="mobile ? 50 : 65" dark>mdi-hexagon-slice-3</v-icon>
              </v-card>
            </v-col>
            <v-col
              v-for="a in actionTypes"
              cols="12"
              sm=""
              style="min-width: 12vw"
              class="effect-text text-center text-capitalize">
              {{ a.action }}
              <br />
              <v-card tile flat :color="`action--${a.action}`" class="py-3">
                <v-icon :size="mobile ? 50 : 100" dark>{{ a.icon }}</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-window-item>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
