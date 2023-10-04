<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.mdAndDown" width="60vw" persistent>
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">OVERHEATING</v-toolbar-title>
      </v-toolbar>
      <v-window v-model="window">
        <v-window-item>
          <v-card-text class="text-center">
            <span class="flavor-text">
              <v-alert prominent dark density="compact" icon="cc:reactor" color="error" tile>
                <b class="heading h2">REACTOR STRESS CRITICAL</b>
              </v-alert>
              Roll 1d6 per point of reactor stress
            </span>
            <br />
            <span class="text-overline">
              <b>{{ totalRolls - rolls.length }}</b>
              rolls remaining
            </span>
            <br />
            <div v-for="n in rolls.length">
              <cc-tooltip simple inline content="Click to re-roll">
                <v-btn icon @click="rolls.splice(n - 1, 1)">
                  <v-icon
                    x-large
                    :color="rolls[n - 1] === 1 ? 'error' : 'stark'"
                    v-html="`mdi-dice-${rolls[n - 1]}`"
                  />
                </v-btn>
              </cc-tooltip>
            </div>
            <div v-for="n in totalRolls - rolls.length" class="d-inline">
              <v-btn icon size="x-large" disabled>
                <v-icon size="x-large" v-html="'mdi-checkbox-blank-outline'" />
              </v-btn>
            </div>
            <br />
            <v-scroll-y-transition group leave-absolute>
              <div v-if="rolls.length < totalRolls" key="tr01" class="d-inline">
                <cc-tooltip inline content="Roll Die">
                  <v-btn
                    icon
                    color="accent"
                    class="mt-n1 mb-1"
                    :disabled="rolls.length === totalRolls"
                    @click="rolls.push(rollRandom())"
                  >
                    <v-icon large>mdi-dice-multiple</v-icon>
                  </v-btn>
                </cc-tooltip>
                <v-divider vertical class="mr-3" />
                <v-btn
                  v-for="n in 6"
                  class="mt-0 mb-4"
                  :ripple="false"
                  x-large
                  color="primary"
                  icon
                  @click="rolls.push(n)"
                >
                  <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
                </v-btn>
              </div>
              <div v-else key="tr02">
                <v-scroll-y-transition group>
                  <span
                    v-if="rolls.filter((x) => x === 1).length > 1"
                    key="t01"
                    class="heading h3 text-error"
                  >
                    // REACTOR INTEGRITY FAILING //
                  </span>
                  <span v-else-if="rolls.length" key="t02" class="heading h3">
                    <b>{{ results[Math.min(...rolls) - 1] }}</b>
                    <i class="text-overline">({{ Math.min(...rolls) }})</i>
                  </span>
                </v-scroll-y-transition>
              </div>
              <div v-if="rolls.length === totalRolls" class="text-right">
                <v-btn
                  x-small
                  color="primary"
                  variant="plain"
                  @click="rolls.splice(0, rolls.length)"
                >
                  <v-icon small left>mdi-reload</v-icon>
                  UNDO
                </v-btn>
              </div>
            </v-scroll-y-transition>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="warning" text @click="dialog = false">dismiss</v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              large
              :disabled="totalRolls - rolls.length > 0"
              @click="window = resultWindow"
            >
              continue
            </v-btn>
          </v-card-actions>
        </v-window-item>

        <table-window-item
          :title="resultData[0].name"
          :content="resultData[0].description"
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyES()"
        >
          <cascade-check :mech="mech" />
        </table-window-item>

        <table-window-item
          :title="resultData[1].name"
          :content="resultData[1].description"
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyPPD()"
        >
          <cascade-check :mech="mech" />
        </table-window-item>

        <table-window-item
          :title="resultData[2].name"
          other-btn
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyPPD()"
        >
          <p
            v-html="
              mech.CurrentStress >= 3
                ? 'Your mech is <b>exposed</b> until you take action to remove the condition.'
                : 'Your mech must pass a engineering check or suffer a reactor meltdown at the end of 1d6 turns after this one (rolled by the GM). You can reverse it by taking a full action and repeating this check. Even on a successful check, your mech suffers from the <b>exposed</b> condition until you take action to remove it.'
            "
          />
          <div slot="confirm-button">
            <div v-if="mech.CurrentStress >= 3">
              <v-btn color="success" large @click="applyPPD()">confirm</v-btn>
            </div>
            <div v-else>
              <v-btn color="error" large @click="window = 4">fail check</v-btn>
              <v-btn color="success" large @click="applyPPD">succeed check</v-btn>
            </div>
          </div>
          <cascade-check :mech="mech" />
        </table-window-item>

        <table-window-item
          :title="resultData[3].name"
          :content="resultData[3].description"
          :hide-previous="mech.CurrentStress <= 1"
          @dismiss="close()"
          @previous="window = 0"
          @confirm="applyMeltdown()"
        >
          <cascade-check :mech="mech" />
        </table-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import TableWindowItem from './_TableWindowItem.vue';
import ResultData from './_stress_results.json';
import CascadeCheck from './_CascadeCheck.vue';

export default {
  name: 'StressTable',
  components: { TableWindowItem, CascadeCheck },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    window: 0,
    rolls: [],
    resultData: ResultData,
    results: [
      'Meltdown',
      'Power Plant Destabilize',
      'Power Plant Destabilize',
      'Power Plant Destabilize',
      'Emergency Shunt',
      'Emergency Shunt',
    ],
  }),
  computed: {
    totalRolls(): number {
      return (
        (this.mech.ActiveStatController.CurrentStress - this.mech.StatController.MaxStress) * -1
      );
    },
    resultWindow(): number {
      if (this.rolls.filter((x) => x === 1).length > 1) return 4;
      switch (Math.min(...this.rolls)) {
        case 6:
        case 5:
          return 1;
        case 4:
        case 3:
        case 2:
          return 2;
        case 1:
          return this.mech.ActiveStatController.CurrentStress <= 1 ? 4 : 3;
      }
      return 4;
    },
  },
  methods: {
    show(): void {
      this.dialog = true;
    },
    close(): void {
      this.window = 0;
      this.rolls = [];
      this.dialog = false;
    },
    rollRandom(): number {
      return Math.floor(Math.random() * 6) + 1;
    },

    applyES(): void {
      if (!this.mech.ActiveStatController.Conditions.includes('IMPAIRED'))
        this.mech.ActiveStatController.Conditions.push('IMPAIRED');
      this.close();
    },
    applyPPD(): void {
      if (!this.mech.ActiveStatController.Conditions.includes('EXPOSED'))
        this.mech.ActiveStatController.Conditions.push('EXPOSED');
      this.close();
    },
    applyMeltdown(): void {
      // this.mech.Pilot.State.ReactorCriticalDestruct()
      this.close();
    },
  },
};
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(124, 0, 0),
    rgba(124, 0, 0) 20px,
    rgba(30, 30, 30) 20px,
    rgba(30, 30, 30) 40px
  );
}

.die-hover {
  opacity: 0.75;
  transform: all 0.3s;
}

.die-hover:hover {
  opacity: 1;
  background-color: #e3f2fd;
}
</style>
