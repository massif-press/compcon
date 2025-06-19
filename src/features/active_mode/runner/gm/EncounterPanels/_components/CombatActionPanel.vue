<template>
  <div>
    <div class="text-cc-overline text-disabled mt-4">Actions</div>
    <v-row dense>
      <v-col>
        <v-card
          :color="actionStatus('protocol') ? 'grey' : 'action--protocol'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('protocol')"
        >
          <v-icon size="large" icon="cc:protocol" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="actionStatus('full') ? 'grey' : 'action--full'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('full')"
        >
          <v-icon size="large" icon="mdi-hexagon-slice-6" />
        </v-card>
      </v-col>
      <v-col cols="auto">
        <v-card flat tile class="text-center py-1 px-2">
          <v-icon size="large" class="text-disabled"
            >mdi-swap-horizontal</v-icon
          >
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="actionStatus('quick') ? 'grey' : 'action--quick'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('quick')"
        >
          <v-icon size="large" icon="mdi-hexagon-slice-3" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="actionStatus('quick') ? 'grey' : 'action--quick'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('quick')"
        >
          <v-icon size="large" icon="mdi-hexagon-slice-3" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="actionStatus('move') ? 'grey' : 'action--move'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('move')"
        >
          <v-icon size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="actionStatus('overcharge') ? 'grey' : 'overcharge'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('overcharge')"
        >
          <v-icon size="large" icon="cc:overcharge" />
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :color="actionStatus('reaction') ? 'grey' : 'action--reaction'"
          flat
          tile
          class="text-center py-1 px-2"
          @click="setAction('reaction')"
        >
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
  },
  data: () => ({
    usedActions: [],
    movement: 0,
  }),
  methods: {
    actionStatus(action) {
      if (action === 'full')
        return (
          this.usedActions.includes('full') ||
          this.usedActions.includes('quick')
        );
      if (action === 'quick')
        return (
          this.usedActions.includes('full') ||
          this.usedActions.filter((x) => x === 'quick').length === 2
        );
      if (action === 'protocol') return this.usedActions.length;
      if (action === 'move')
        return this.usedActions.includes('move') || this.movement === 0;
      return this.usedActions.includes(action);
    },
    setAction(action) {
      if (action === 'quick') {
        if (this.usedActions.filter((x) => x === 'quick').length === 2) {
          this.usedActions = this.usedActions.filter((x) => x !== 'quick');
        } else {
          this.usedActions.push('quick');
        }
      }
      if (this.usedActions.includes(action)) {
        const index = this.usedActions.indexOf(action);
        this.usedActions.splice(index, 1);
      } else {
        this.usedActions.push(action);
      }
    },
  },
};
</script>
