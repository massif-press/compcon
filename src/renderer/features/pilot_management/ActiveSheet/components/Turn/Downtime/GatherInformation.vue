<template>
  <div>
    <v-card-text>
      <v-layout row wrap class="text-xs-center">
        <v-flex xs12 class="effect-text">
          <p
            class="pt-2 pb-0 ma-0"
          >You poke your nose around, perhaps where it doesn’t belong. You’re investigating something, doing research, following up on a mystery, tracking a target, or keeping an eye on something. You might be doing research in a library, or go undercover in an organization to learn what you can. Whatever you’re doing, you’re generally trying to gather information on a subject of your choosing.</p>
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
            <p
              class="pt-2 pb-0 ma-0 minor-title"
            >You can choose to get out now, or get what you are looking for. If you choose the latter, you get your information but it immediately gets you into trouble.</p>
            <v-slide-x-transition>
              <v-btn v-show="!commit" large color="success" @click="close">Get out now</v-btn>
            </v-slide-x-transition>
            <v-slide-x-reverse-transition>
              <v-btn
                v-show="!commit"
                large
                color="warning"
                @click="commit = true"
              >Get what you are looking for</v-btn>
            </v-slide-x-reverse-transition>
          </v-flex>
          <v-flex xs12 v-else-if="skillRoll < 20">
            <p
              class="pt-2 pb-0 ma-0 minor-title"
            >you find the information you’ve looking for. However...</p>
            <v-card class="pa-1 ma-0" color="grey lighten-4">
              <v-card-text class="pa-1 ma-0">
                <v-radio-group v-model="choice" mandatory>
                  <v-radio :label="choices[0]" :value="0"></v-radio>
                  <v-radio :label="choices[1]" :value="1"></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-else>
            <p class="pt-2 pb-0 ma-0 minor-title">You get your information cleanly, no complications</p>
          </v-flex>
          <v-flex xs12>
            <v-slide-y-transition>
              <v-card
                v-show="skillRoll >= 10 || skillRoll < 10 && commit"
                color="grey lighten-4"
                class="ml-5 mr-5 mt-2"
              >
                <v-toolbar dark dense color="#00695C">
                  <v-toolbar-title>Gathered Information</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
                </v-card-text>
              </v-card>
            </v-slide-y-transition>
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
        :disabled="skillRoll === '' || details === ''"
      >add reserve</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'gather-information',
  props: {
    pilot: Object,
  },
  data: () => ({
    commit: false,
    skillRoll: '',
    details: '',
    choices: [
      'You leave clear evidence of your rummaging',
      'You have to dispatch someone along the way, or implicate someone innocent',
    ],
    choice: 0,
  }),
  methods: {
    addReserve() {
      let nr = new Reserve({
        id: 'reserve_gatherinfo',
        type: 'Narrative',
        name: 'Information',
        label: '',
        description: '',
        roll_min: 0,
        roll_max: 0,
      })
      nr.Note = this.details
      if (this.skillRoll < 10)
        nr.ResourceCost = 'Gathering this information has gotten you into immediate trouble'
      else if (this.skillRoll < 20) nr.ResourceCost = this.choices[this.choice]
      this.pilot.Reserves.push(nr)
      this.close()
    },
    close() {
      this.commit = false
      this.skillRoll = ''
      this.details = ''
      this.choice = 0
      this.$emit('close')
    },
  },
})
</script>
