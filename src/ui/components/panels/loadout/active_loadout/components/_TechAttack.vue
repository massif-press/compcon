<template>
  <div>
    <v-slide-x-reverse-transition>
      <v-row
        v-if="used"
        justify="center"
        align="center"
        :class="$vuetify.breakpoint.smAndDown ? 'mt-4' : ''"
      >
        <v-col lg="auto" cols="12" class="mt-n5">
          <v-row dense class="text-center mb-n3" justify="start" align="start">
            <v-col cols="auto" :class="$vuetify.breakpoint.smAndDown ? '' : 'mx-8'">
              <div class="overline">Tech Attack Roll</div>
              <div class="heading text--text" style="font-size: 24pt">
                <v-icon x-large class="mr-n1">mdi-dice-d20-outline</v-icon>
                {{ `${mech.TechAttack >= 0 ? '+' : ''}${mech.TechAttack}` }}
              </div>
            </v-col>
            <v-col cols="auto" :class="$vuetify.breakpoint.smAndDown ? '' : 'mx-8'">
              <div class="overline">vs. Target</div>
              <v-icon x-large v-html="'cci-edef'" />
              <div class="overline font-weight-bold mt-n2" v-html="'E-Defense'" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-row
            dense
            :justify="$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'"
            :class="$vuetify.breakpoint.smAndDown ? 'panel' : ''"
          >
            <v-col
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 mr-n10 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline pl-1">Accuracy</div>
              <v-text-field
                v-model="accuracy"
                type="number"
                append-outer-icon="mdi-plus-circle-outline"
                append-icon="cci-accuracy"
                prepend-icon="mdi-minus-circle-outline"
                style="width: 115px"
                class="hide-input-spinners"
                color="accent"
                dense
                hide-details
                @click:append-outer="accuracy += 1"
                @click:prepend="accuracy > 0 ? (accuracy -= 1) : ''"
                @change="accuracy = parseInt($event)"
              />
            </v-col>
            <v-col
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'px-12 mr-n10 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline pl-1">Difficulty</div>
              <v-text-field
                v-model="difficulty"
                type="number"
                append-outer-icon="mdi-plus-circle-outline"
                append-icon="cci-difficulty"
                prepend-icon="mdi-minus-circle-outline"
                style="width: 115px"
                class="hide-input-spinners"
                color="accent"
                dense
                hide-details
                @click:append-outer="difficulty += 1"
                @click:prepend="difficulty > 0 ? (difficulty -= 1) : ''"
                @change="difficulty = parseInt($event)"
              />
            </v-col>
            <v-col
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'px-12 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline mr-n6 pl-3">Tech Attack Roll</div>
              <v-row no-gutters>
                <v-col class="mr-n2 ml-n2">
                  <cc-dice-menu
                    v-if="resetAttackRoll"
                    :preset="`1d20+${mech.TechAttack}`"
                    :preset-accuracy="accuracy - difficulty"
                    title="Tech Attack"
                    autoroll=true
                    @commit="registerTechRoll($event.total)"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="attackRoll"
                    type="number"
                    class="hide-input-spinners ml-n3"
                    style="max-width: 60px; margin-top: -0.5px"
                    color="accent"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>

    <v-slide-x-reverse-transition>
      <v-row v-if="!!attackRoll" dense class="mt-n2">
        <v-col md="6" lg="3" xl="2" class="ml-auto">
          <v-btn
            tile
            block
            class="primary"
            :color="`primary ${succeeded ? 'lighten-1' : ''}`"
            :disabled="failed"
            @click="complete(true)"
          >
            SUCCESS
          </v-btn>
        </v-col>
        <v-col md="6" lg="3" xl="2">
          <v-btn
            tile
            block
            :disabled="succeeded"
            :color="failed ? 'error' : ''"
            @click="complete(false)"
          >
            FAILURE
          </v-btn>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DiceRoller } from '@/class'

export default Vue.extend({
  name: 'tech-attack',
  props: {
    used: { type: Boolean },
    mech: { type: Object, required: true },
    action: { type: Object, required: true },
  },
  data: () => ({
    accuracy: 0,
    difficulty: 0,
    attackRoll: '',
    succeeded: false,
    failed: false,
    resetAttackRoll: false,
  }),
  watch: {
    used: {
      immediate: true,
      deep: true,
      handler: function () {
        this.init()
      },
    },
  },
  methods: {
    init() {
      this.activated = false
      this.accuracy = 0
      this.difficulty = 0
      this.freeAction = false
      this.succeeded = false
      this.failed = false
      this.attackRoll = ''
      this.resetAttackRoll = false
      this.$nextTick(function () {
        this.resetAttackRoll = true
      })
    },
    registerTechRoll(roll) {
      Vue.set(this, 'attackRoll', roll)
      Vue.nextTick().then(() => this.$forceUpdate())
    },
    complete(success) {
      this.succeeded = success
      this.failed = !success
      this.$emit('techAttackComplete', this.succeeded)
    },
  },
})
</script>
