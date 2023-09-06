<template>
  <v-container>
    <h1 class="heading text-center">ACTION ECONOMY</h1>
    <h2 id="overview" class="heading h1 text-accent">Per Turn</h2>
    <v-card color="panel" elevation-10>
      <v-card-text>
        <v-row justify="center" density="compact">
          <v-col :cols="$vuetify.display.smAndDown ? 12 : 4" class="effect-text text-center">
            Full Action
            <i class="text-subtle text--darken-1">or&nbsp</i>
            2 Quick Actions
            <br />
            <v-card tile color="action--full" width="100%" class="text-center pt-4 pb-4">
              <v-icon size="100" dark>mdi-hexagon-slice-6</v-icon>
              <v-icon size="50" color="indigo lighten-3">mdi-swap-horizontal</v-icon>
              <v-icon size="65" dark>mdi-hexagon-slice-3</v-icon>
              <v-icon size="65" dark>mdi-hexagon-slice-3</v-icon>
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
    <cc-icon-divider id="mechactions" icon="cc:frame" />
    <v-row justify="center">
      <action-card v-for="a in actions" :action="a" />
    </v-row>

    <cc-icon-divider id="pilotactions" icon="cc:pilot" />
    <v-row justify="center">
      <action-card v-for="a in pilotActions" :action="a" />
    </v-row>

    <cc-icon-divider id="downtimeactions" icon="cc:downtime" />
    <v-row justify="center">
      <action-card v-for="a in downtimeActions" :action="a" downtime />
    </v-row>
  </v-container>
  <v-footer border app class="py-0 bg-primary">
    <v-tabs density="compact" center-active grow>
      <v-tab v-for="item in content" v-text="item" @click="scrollTo(item)" />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    variant="tonal"
    icon
    color="primary"
    class="fade-select"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import ActionCard from '../_components/ActionCard.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'action-economy',
  components: { ActionCard },
  data: () => ({
    content: ['overview', 'mech actions', 'pilot actions', 'downtime actions'],
    actionTypes: [
      { action: 'move', icon: 'mdi-arrow-right-bold-hexagon-outline' },
      { action: 'overcharge', icon: 'cc:overcharge' },
      { action: 'reaction', icon: 'cc:reaction' },
      { action: 'free', icon: 'cc:free' },
    ],
  }),
  computed: {
    actions() {
      return CompendiumStore().Actions.filter((a) => a && !a.IsDowntimeAction && !a.IsPilotAction);
    },
    pilotActions() {
      return CompendiumStore().Actions.filter((a) => a && a.IsPilotAction);
    },
    downtimeActions() {
      return CompendiumStore().Actions.filter((a) => a && a.IsDowntimeAction);
    },
  },
  methods: {
    scrollTo(item: any): void {
      const el = document.getElementById(`${item.replace(/\W/g, '')}`);
      if (el) {
        console.log(el);
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>
