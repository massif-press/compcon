<template>
  <v-card>
    <v-toolbar color="title-bg" dark flat>
      <v-toolbar-title class="display-2 font-weight-bold">OVERHEATING</v-toolbar-title>
    </v-toolbar>
    <v-window v-model="window">
      <v-window-item>
        <v-card-text class="text-xs-center">
          <span class="fluff-text">
            <b class="minor-title red--text">REACTOR LEVELS CRITICAL</b>
            <br />Roll 1d6 per point of reactor stress
          </span>
          <br />
          <span class="display-2">{{totalRolls}}d6</span>
          <br />
          <span class="caption capitalize-text">
            <b>{{totalRolls - rolls.length}}</b> rolls remaining
          </span>
          <br />
          <div v-for="n in rolls.length" :key="`rr${n}`" class="d-inline">
            <v-tooltip top>
              <v-btn slot="activator" flat icon @click="rolls.splice(n - 1, 1)">
                <v-icon
                  x-large
                  v-html="`mdi-dice-${rolls[n - 1]}`"
                  :color="rolls[n - 1] === 1 ? 'red accent-4' : 'black'"
                />
              </v-btn>
              <span>Click to re-roll</span>
            </v-tooltip>
          </div>
          <div v-for="n in (totalRolls - rolls.length)" :key="`er${n}`" class="d-inline">
            <v-btn flat icon x-large disabled>
              <v-icon x-large v-html="'mdi-checkbox-blank-outline'" />
            </v-btn>
          </div>
          <div v-if="rolls.length < totalRolls" class="d-inline">
            <br />
            <v-btn
              class="mt-0 mb-4"
              :ripple="false"
              x-large
              v-for="n in 6"
              :key="`rb${n}`"
              color="primary"
              flat
              icon
              @click="rolls.push(n)"
            >
              <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
            </v-btn>
          </div>
          <br />
          <span
            v-if="rolls.filter(x => x === 1).length > 1"
            class="major-title font-weight-bold capitalize-text red--text"
          >// REACTOR INTEGRITY FAILING //</span>
          <span v-else-if="rolls.length" class="minor-title capitalize-text">
            Result:
            <b>{{Math.min(...rolls)}}</b>
            <i>({{results[Math.min(...rolls) - 1]}})</i>
          </span>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            large
            :disabled="(totalRolls - rolls.length) > 0"
            @click="window = resultWindow"
          >continue</v-btn>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">Emergency Shunt</v-card-title>
        <v-card-text class="text-xs-center">
          <p class="fluff-text">
            Cooling systems have recovered and managed to contain the peaking heat levels. However, your mech is
            <strong>impaired</strong>
            until the end of your next turn.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <v-btn color="success" large @click="applyES()">confirm</v-btn>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">Power Plant Destabilization</v-card-title>
        <v-card-text class="text-xs-center">
          <p class="fluff-text">
            Your mech’s power plant has become unstable, ejecting jets of plasma. Your mech is
            <strong>exposed</strong> until you take action to remove the condition.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <v-btn color="success" large @click="applyPPD()">confirm</v-btn>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">MELTDOWN</v-card-title>
        <v-card-text class="text-xs-center">
          <div class="fluff-text">
            <p v-if="mech.CurrentStructure >= 3">
              Your mech is
              <b>exposed</b> until you take action to remove the condition.
            </p>
            <p v-else>
              Your mech must pass a engineering check or suffer a reactor meltdown at the end of 1d6 turns after this one (rolled by the GM). You can reverse it by taking a full action and repeating this check. Even on a successful check, your mech suffers from the
              <b>exposed</b>
              condition until you take action to remove it.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <div v-if="mech.CurrentStructure >= 3">
            <v-btn color="success" large @click="applyPPD()">confirm</v-btn>
          </div>
          <div v-else>
            <v-btn color="error" large @click="window = 4">fail hull save</v-btn>
            <v-btn color="success" large @click="applyPPD">succeed hull save</v-btn>
          </div>
        </v-card-actions>
      </v-window-item>
      <v-window-item>
        <v-card-title primary-title class="major-title">Irreversible Meltdown</v-card-title>
        <v-card-text class="text-xs-center title-bg">
          <p
            class="major-title red--text pa-3 ma-5"
            style="background-color:black;"
          >REACTOR CRITICAL // MELTDOWN IMMINENT</p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="warning" @click="$emit('dismiss')">dismiss</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="window = 0">previous</v-btn>
          <v-btn color="success" large @click="applyMeltdown()">confirm</v-btn>
        </v-card-actions>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'stress-table',
  props: {
    mech: Object,
    loadout: Object,
    pilot: Object,
  },
  data: () => ({
    window: 0,
    rolls: [],
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
    totalRolls() {
      return (this.mech.CurrentStress - this.mech.MaxStress) * -1
    },
    resultWindow(): number {
      if (this.rolls.filter(x => x === 1).length > 1) return 4
      switch (Math.min(...this.rolls)) {
        case 6:
        case 5:
          return 1
        case 4:
        case 3:
        case 2:
          return 2
        case 1:
          return 3
      }
      return 4
    },
  },
  methods: {
    close() {
      this.window = 0
      this.rolls = []
      this.$emit('dismiss')
    },
    applyES() {
      if (!this.mech.Conditions.includes('Impaired')) this.mech.Conditions.push('Impaired')
      this.close()
    },
    applyPPD() {
      if (!this.mech.Statuses.includes('Exposed')) this.mech.Statuses.push('Exposed')
      this.close()
    },
    applyMeltdown() {
      this.mech.MeltdownImminent = true
      this.close()
    },
  },
})
</script>


<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(124, 0, 0),
    rgba(124, 0, 0) 20px,
    rgba(0, 0, 0) 20px,
    rgba(0, 0, 0) 40px
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
