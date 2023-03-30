<template>
  <v-menu offset-y top :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn
        class="mx-1"
        :small="$vuetify.display.lgAndUp"
        :x-small="$vuetify.display.smAndDown"
        dark
        :fab="$vuetify.display.lgAndUp || $vuetify.display.smAndDown"
        elevation="0"
        :color="state.Move < 1 ? 'grey darken-1' : 'action--move'"
        v-bind="props"
      >
        <v-icon color="white" size="30"
          >mdi-arrow-right-bold-hexagon-outline</v-icon
        >
        <span v-if="$vuetify.display.md" class="pl-2" v-html="'MOVEMENT'" />
      </v-btn>
    </template>
    <div>
      <v-card class="px-4 py-2" density="compact" color="panel">
        <cc-tick-bar
          :current="state.Move"
          :max="state.MaxMove"
          large
          color="action--move"
          bg-color="panel lighten-1"
          full-icon="mdi-arrow-right-bold-hexagon-outline"
          empty-icon="mdi-hexagon-outline"
          @update="mech.Pilot.State.SetMove($event)"
        >
          <span class="heading h3">Movement</span>
        </cc-tick-bar>
        <v-fade-transition>
          <cc-tick-bar
            v-if="mech.Boost"
            :current="mech.Boost"
            :max="mech.MaxMove"
            large
            color="secondary"
            full-icon="mdi-arrow-right-bold-hexagon-outline"
            :number-only="$vuetify.display.mdAndDown"
            clearable
            no-input
            @update="state.SetBoost($event)"
          >
            <span class="heading h3">Boost</span>
          </cc-tick-bar>
        </v-fade-transition>
      </v-card>
    </div>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'action-menu-button',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    state() {
      return this.mech.Pilot.State;
    },
  },
};
</script>
