<template>
  <div>
    <v-card-text>
      <v-row wrap class="text-center">
        <v-col cols="12" class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            You try and stave off some reckoning, extend your window of opportunity, or merely buy
            more time and breathing room for you and your group to act. You might be trying to dodge
            some heat, survive stranded in the wilderness, or cause a distraction so another plan
            can go off.
            <br />
            You can use that distraction or bought time as
            <strong>reserves</strong>
            for the next mission.
          </p>
          <v-divider class="ma-2" />
          <p class="pt-2 pb-0 ma-0 minor-title">
            Roll
            <v-icon class="pa-0 ma-0" color="primary">mdi-dice-d20</v-icon>
            &nbsp;and add any relevant Skill Trigger bonuses, modifiers, or accuracy
          </p>
        </v-col>
        <v-col cols="12">
          <div style="margin-left: 40%; margin-right: 40%">
            <v-text-field
              v-model="skillRoll"
              type="number"
              label="Roll Result"
              outline
              append-outer-icon="add"
              @click:append-outer="skillRoll++"
              prepend-icon="remove"
              @click:prepend="skillRoll > 1 ? skillRoll-- : ''"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
      <v-slide-y-transition>
        <v-row v-show="skillRoll" wrap class="text-center">
          <v-col cols="12" v-if="skillRoll < 10">
            <p class="pt-2 pb-0 ma-0 minor-title">
              You can buy only a little time, and only if drastic measures are taken
              <em>right now.</em>
              Otherwise, whatever you're trying to stave off catches up to you.
            </p>
          </v-col>
          <v-col cols="12" v-else-if="skillRoll < 20">
            <p class="pt-2 pb-0 ma-0 minor-title">
              You can buy enough time, but the situation becomes precarious or desperate. Next time
              you get this result with the same situation, treat it as a 9 or lower.
            </p>
          </v-col>
          <v-col cols="12" v-else>
            <p class="pt-2 pb-0 ma-0 minor-title">
              You buy enough time as you need for now, until the next mission. If you've already
              gotten this result, it becomes a 10-19 for the same situation next time.
            </p>
          </v-col>
          <v-col cols="12">
            <v-card color="grey lighten-4" class="ml-5 mr-5">
              <v-toolbar dark dense color="#00695C">
                <v-toolbar-title>Bought Time</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn flat @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        color="primary"
        @click="addReserve"
        :disabled="skillRoll === '' || details === ''"
      >
        add reserve
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'buy-time',
  props: {
    pilot: Object,
  },
  data: () => ({
    skillRoll: '',
    details: '',
  }),
  methods: {
    addReserve() {
      let nr = new Reserve({
        id: 'reserve_boughttime',
        type: 'Narrative',
        name: 'Bought Time',
        label: '',
        description: 'More time and breathing room for you and your group to act',
        roll_min: 0,
        roll_max: 0,
      })
      nr.Note = this.details
      if (this.skillRoll < 10)
        nr.ResourceCost = 'Only a little time, and only if drastic measures are taken right now'
      else if (this.skillRoll < 20)
        nr.ResourceCost = 'The situation becomes precarious or desperate'
      this.pilot.Reserves.push(nr)
      this.close()
    },
    close() {
      this.skillRoll = ''
      this.details = ''
      this.$emit('close')
    },
  },
})
</script>
