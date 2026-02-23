<template>
  <div :class="mobile ? 'px-2 pt-1' : 'py-5'">
    <v-row v-for="(t, idx) in event.Targets"
      no-gutters>
      <v-col cols="auto"
        class="mt-1 mr-1">
        <div v-if="idx === 0"
          class="d-inline"
          style="position: relative;">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <cc-button size="small"
                color="primary"
                :icon="event.AoeIcon"
                v-bind="props"
                @click="event.AoE = !event.AoE">
              </cc-button>
            </template>

            <div v-if="event.AoE">
              Area of Effect
              <span v-if="typeof event.AoE === 'string'">
                <cc-slashes />
                {{ event.AoE }}
              </span>
              <div>
                <i class="text-caption text-disabled">Click to Override</i>
              </div>
            </div>

            <div v-else
              class="text-center">
              Single Target
              <div>
                <i class="text-caption text-disabled">Click to Override</i>
              </div>
            </div>
          </v-tooltip>
        </div>
        <div v-else
          style="width: 28px"></div>
      </v-col>

      <v-col>
        <v-card :key="`targetSel_${idx}`"
          class="mb-1 px-3 pa-1 text-center"
          :class="!mobile ? 'heading h3' : 'font-weight-bold text-caption'"
          color="panel"
          flat
          tile>
          {{ event.AoE ? getOrdinal(Number(idx) + 1) : '' }} Target
          <v-btn v-if="event.Targets.length > 1"
            icon
            size="20"
            variant="text"
            class="mr-n2"
            flat
            tile>
            <v-icon size="20"
              icon="mdi-close"
              @click="event.Targets.splice(idx, 1)" />
          </v-btn>
        </v-card>
        <v-btn v-if="event.AoE && idx === event.Targets.length - 1"
          size="x-small"
          block
          flat
          tile
          color="primary"
          class="ma-1"
          @click="event.AddTarget()">
          Add Target
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import BaseAttackRoller from './BaseAttackRoller.vue';
import BaseSaveRoller from './BaseSaveRoller.vue';
import CheckRollInterface from './CheckRollInterface.vue';


export default {
  name: 'LocalTargetSelector',
  components: {
    BaseAttackRoller,
    BaseSaveRoller,
    CheckRollInterface,
  },
  props: {
    event: { type: Object, required: true },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown
    }
  },
  methods: {
    getOrdinal(n) {
      const s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return `${n + (s[(v - 20) % 10] || s[v] || s[0])} `;
    },
  }
};
</script>
