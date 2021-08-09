<template>
  <div class="pt-2">
    <v-row justify="center" align="center">
      <v-col cols="12" md="">
        <action-detail-expander :action="action" />
      </v-col>
      <v-col cols="auto">
        <v-btn
          large
          tile
          dark
          block
          :disabled="actionFree"
          :color="`${action.Color} ${actionCost ? 'lighten-1' : ''}`"
          @click="actionCost = !actionCost"
        >
          <v-icon left>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </v-btn>
        <v-btn
          v-if="action.Activation !== 'Free'"
          small
          tile
          dark
          block
          :disabled="actionCost"
          :color="`action--free ${actionFree ? 'lighten-1' : ''}`"
          @click="actionFree = !actionFree"
        >
          <v-icon left small>cci-free-action</v-icon>
          Free Action
          <cc-tooltip
            inline
            :content="`Special rules or equipment may allow you to ${action.Name} as a Free Action. Using this button will commit the action without spending a ${action.Activation} Action this turn`"
          >
            <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
          </cc-tooltip>
        </v-btn>
      </v-col>
    </v-row>

    <v-slide-x-reverse-transition>
      <v-row v-if="actionFree || actionCost" justify="center" align="center">
        <v-col cols="12" md="auto" class="mt-n5">
          <v-row
            dense
            class="text-center mb-n3"
            :justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'space-around'"
            align="start"
            :class="$vuetify.breakpoint.mdAndUp ? '' : 'panel'"
          >
            <v-col
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline pl-4 mr-n4">Contested AGI</div>
              <v-text-field
                v-model="sys"
                type="number"
                style="width: 60px"
                :class="`hide-input-spinners mt-n1 ${
                  $vuetify.breakpoint.mdAndUp ? 'ml-10' : 'ml-n8'
                }`"
                color="accent"
                dense
                hide-details
                @change="sys = parseInt($event)"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-row
            dense
            :justify="$vuetify.breakpoint.mdAndUp ? 'end' : 'space-around'"
            :class="$vuetify.breakpoint.mdAndUp ? '' : 'panel'"
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
                @click:prepend="accuracy -= 1"
                @change="accuracy = parseInt($event)"
              />
            </v-col>
            <v-col
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 mr-n10 panel dual-sliced' : ''"
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
                @click:prepend="difficulty -= 1"
                @change="difficulty = parseInt($event)"
              />
            </v-col>
            <v-col
              cols="auto"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto px-12 panel dual-sliced' : ''"
              style="height: 70px"
            >
              <div class="overline pl-1">SYS Roll</div>
              <v-row dense>
                <v-col class="ml-n2">
                  <cc-dice-menu
                    :preset="`1d20+${mech.Sys}`"
                    :preset-accuracy="accuracy - difficulty"
                    title="SKILL CHECK"
                    autoroll=true
                    @commit="registerSysRoll($event.total)"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="sysRoll"
                    :key="`input_${sysRoll}`"
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
            <v-col cols="auto" class="text-center mt-3 mr-6">
              <div class="heading h1" v-html="`+${mech.Sys}`" />
              <div class="mt-2">SYSTEMS</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>

    <v-slide-x-reverse-transition>
      <v-row v-if="sysRoll && sys" no-gutters class="mt-2">
        <v-col cols="auto" class="ml-auto" align="end">
          <v-btn
            large
            tile
            :color="sysRoll > sys ? 'success' : 'error'"
            :disabled="used"
            @click="complete()"
          >
            CONFIRM
          </v-btn>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import { ActivationType } from '@/class'
import Vue from 'vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'search-dialog',
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
    dialog: false,
    sys: '',
    accuracy: 0,
    difficulty: 0,
    sysRoll: '',
    actionCost: false,
    actionFree: false,
    timer: 0,
    finished: false,
  }),
  methods: {
    complete() {
      this.$emit('use', this.actionFree ? ActivationType.Free : ActivationType.Quick)
    },
    registerSysRoll(roll) {
      Vue.set(this, 'sysRoll', roll)
      Vue.nextTick().then(() => this.$forceUpdate())
    },
    reset() {
      this.mech.Pilot.State.UndoAction(
        this.action,
        this.actionFree ? ActivationType.Free : ActivationType.Quick
      )
      this.init()
    },
    init() {
      this.accuracy = 0
      this.difficulty = 0
      this.sys = ''
      this.roll = ''
      this.rollString = ''
      this.rollResultString = ''
      this.rollAccuracyResults = '[]'
      this.actionCost = false
      this.actionFree = false
      this.timer = 0
      this.finished = false
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
    },
  },
})
</script>
