<template>
  <div>
    <v-card-text>
      <v-layout row wrap class="text-xs-center">
        <v-flex xs12 class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            You try and get your hands on some gear or asset for your group by dredging the scrapyard, chasing down rumors, bartering in the local market, hunting around, or through good old fashioned force of will. You could try and get some better pilot gear that could help you, a vehicle, narcotics, goods, or other sundries. It’s got to be something physical that you can acquire, but doesn’t necessarily have to be on the gear list. If you get it, you can take it on the next mission as
            <strong>reserves.</strong>
          </p>
          <v-divider class="ma-2" />
          <p class="pt-2 pb-0 ma-0 minor-title">
            Roll
            <v-icon class="pa-0 ma-0" color="primary">mdi-dice-d20</v-icon>&nbsp;and add any relevant Skill Trigger bonuses, modifiers, or accuracy
          </p>
        </v-flex>
        <v-flex xs12>
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
        </v-flex>
      </v-layout>
      <v-slide-y-transition>
        <v-layout v-show="skillRoll" row wrap class="text-xs-center">
          <v-flex xs12 v-if="skillRoll < 10">
            <p class="pt-2 pb-0 ma-0 minor-title">You can get what you’re looking for, but...</p>
            <v-radio-group v-model="choice" mandatory>
              <v-radio v-for="(c, i) in choices" :key="c" :label="c" :value="i"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 v-else-if="skillRoll < 20">
            <p
              class="pt-2 pb-0 ma-0 minor-title"
            >You can get what you’re looking for, as long as you trade in a little...</p>
            <v-card class="pa-1 ma-0" color="grey lighten-4">
              <v-card-text class="pa-1 ma-0">
                <v-radio-group v-model="trade" mandatory>
                  <v-radio v-for="(t, i) in trades" :key="t" :label="t" :value="i"></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-else>
            <p
              class="pt-2 pb-0 ma-0 minor-title"
            >You get what you’re looking for, no problems at all.</p>
          </v-flex>
          <v-flex xs12>
            <v-card color="grey lighten-4" class="ml-5 mr-5 mt-2">
              <v-toolbar dark dense color="#00695C">
                <v-toolbar-title>New Asset</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-text-field v-model="custom_name" label="Asset or Gear" style="width: 500px" />
                <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
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
        :disabled="skillRoll === '' || custom_name === ''"
      >add reserve</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'scrounge-barter',
  props: {
    pilot: Object,
  },
  data: () => ({
    skillRoll: '',
    custom_name: '',
    details: '',
    choices: [
      'It was stolen, probably from someone who’s looking for it',
      'It’s degraded, old, filthy, or malfunctioning',
      'Someone else has it right now and won’t give it up without force or convincing',
    ],
    choice: 0,
    trades: ['Time', 'Dignity', 'Reputation', 'Health, comfort and wellness'],
    trade: 0,
  }),
  methods: {
    addReserve() {
      let nr = new Reserve({
        id: 'reserve_scroungebarter',
        type: 'Narrative',
        name: 'Asset',
        label: '',
        description: '',
        roll_min: 0,
        roll_max: 0,
      })
      nr.ResourceName = this.custom_name
      nr.Note = this.details
      if (this.skillRoll < 10) nr.ResourceCost = this.choices[this.choice]
      else if (this.skillRoll < 20)
        nr.ResourceCost = `Aquiring this has cost you your ${this.trades[this.trade].toLowerCase()}`
      this.pilot.Reserves.push(nr)
      this.close()
    },
    close() {
      this.choice = 0
      this.trade = 0
      this.skillRoll = ''
      this.custom_name = ''
      this.details = ''
      this.$emit('close')
    },
  },
})
</script>
