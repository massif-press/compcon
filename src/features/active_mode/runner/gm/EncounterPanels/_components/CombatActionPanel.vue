<template>
  <div>
    <div class="text-cc-overline text-disabled">Actions</div>
    <v-row dense>
      <v-col>
        <v-card
          :color="!controller.CanActivate('protocol') ? 'grey' : 'action--protocol'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="controller.toggleCombatAction('protocol')">
          <v-icon size="large" icon="cc:protocol" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="!controller.CanActivate('full') ? 'grey' : 'action--full'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="controller.toggleCombatAction('full')">
          <v-icon size="large" icon="mdi-hexagon-slice-6" />
        </v-card>
      </v-col>
      <v-col cols="auto">
        <v-card flat tile class="text-center py-1 px-2">
          <v-icon size="large" class="text-disabled">mdi-swap-horizontal</v-icon>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="!controller.CombatActions.Quick1 ? 'grey' : 'action--quick'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="controller.CombatActions.Quick1 = !controller.CombatActions.Quick1">
          <v-icon size="large" icon="mdi-hexagon-slice-3" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="!controller.CombatActions.Quick2 ? 'grey' : 'action--quick'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="controller.CombatActions.Quick2 = !controller.CombatActions.Quick2">
          <v-icon size="large" icon="mdi-hexagon-slice-3" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="!controller.CanActivate('move') ? 'grey' : 'action--move'"
          flat
          tile
          class="text-center py-1 px-2">
          <v-icon size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
        </v-card>
      </v-col>
      <v-col v-if="!hideOvercharge">
        <v-card
          :color="!controller.CanActivate('overcharge') ? 'grey' : 'overcharge'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="controller.toggleCombatAction('overcharge')">
          <v-icon size="large" icon="cc:overcharge" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="!controller.CanActivate('reaction') ? 'grey' : 'action--reaction'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="controller.toggleCombatAction('reaction')">
          <v-icon size="large" icon="cc:reaction" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'CombatActionPanel',
  props: {
    controller: {
      type: Object,
      required: true,
    },
    hideOvercharge: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    usedActions: [],
  }),
  computed: {
    movement() {
      return this.controller.StatController.CurrentStats['speed'] || 0;
    },
  },
};
</script>
