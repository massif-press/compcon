<template>
  <div>
    <v-row justify="center" align="center">
      <v-col>
        <action-detail-expander :action="action" />
      </v-col>
    </v-row>

    <div class="text-center heading h3 pb-0 mt-4 mb-2">
      Overcharging will incur
      <span class="text-red text--darken-2">
        +{{ mech.OverchargeTrack[mech.CurrentOvercharge] }} Heat
      </span>
    </div>
    <v-row density="compact" justify="center">
      <v-col cols="auto">
        <cc-tooltip content="Roll Overcharge">
          <cc-dice-menu
            v-if="resetRoll"
            :preset="mech.OverchargeTrack[mech.CurrentOvercharge]"
            title="OVERCHARGE"
            autoroll
            @commit="registerOverchargeRoll($event.total)"
          />
        </cc-tooltip>
      </v-col>
      <v-col cols="8" lg="3">
        <v-text-field
          v-model="overcharge_heat"
          type="number"
          label="Heat Roll Result"
          variant="outlined"
          density="compact"
          hide-details
          :disabled="used"
          class="hide-spinners"
          append-outer-icon="mdi-plus-circle-outline"
          prepend-icon="mdi-minus-circle-outline"
          @click:append-outer="overcharge_heat++"
          @click:prepend="overcharge_heat > 0 ? overcharge_heat-- : ''"
        />
      </v-col>
    </v-row>
    <v-row density="compact" justify="center">
      <v-col cols="3">
        <v-btn
          large
          dark
          color="overcharge"
          block
          :disabled="used || !overcharge_heat"
          @click="select()"
        >
          <v-icon large left>cc:overcharge</v-icon>
          Confirm
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue';

export default {
  name: 'action-dialog-base',
  components: { ActionDetailExpander },
  props: {
    used: { type: Boolean },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    finished: false,
    overcharge_heat: null,
    resetRoll: true,
  }),
  methods: {
    registerOverchargeRoll(roll) {
      Vue.set(this, 'overcharge_heat', roll);
      Vue.nextTick().then(() => this.$forceUpdate());
    },
    select() {
      this.mech.Pilot.State.OverchargeHeat = parseInt(this.overcharge_heat);
      Vue.nextTick().then(() => this.$emit('use'));
    },
    reset() {
      Vue.nextTick()
        .then(() => this.$emit('undo'))
        .then(() => this.init());
    },
    init(): void {
      this.finished = false;
      this.overcharge_heat = null;
      this.resetRoll = false;
      this.$nextTick(function () {
        this.resetRoll = true;
      });
    },
  },
};
</script>
