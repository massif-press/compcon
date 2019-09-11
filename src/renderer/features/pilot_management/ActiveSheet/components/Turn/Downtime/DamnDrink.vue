<template>
  <div>
    <v-card-text>
      <v-row wrap class="text-center">
        <v-col cols="12" class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            You can only make this action where there’s a drink to actually get (in town, a station,
            a city, or some other populated area). It doesn’t have to be an actual drink, but you
            blow off some steam, carouse, and generally get into trouble. You could be doing this to
            make connections, collect gossip, forge a reputation, or maybe just to forget what
            happened on the last mission. There’s usually trouble.
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
              You can decide whether you had good time or not. However, you wake up in a gutter
              somewhere with only one of the following:
            </p>
            <v-select
              class="ml-5 mr-5"
              outline
              v-model="kept"
              :items="losses"
              label="You retain..."
            />
          </v-col>
          <v-col cols="12" v-else-if="skillRoll < 20">
            <p class="pt-2 pb-0 ma-0 minor-title">
              You gain one of the following choices as
              <strong>reserves</strong>
              , and lose one:
            </p>
            <v-row>
              <v-col cols="6">
                <div class="ma-2">
                  <v-select
                    hide-details
                    outline
                    v-model="reserve1"
                    :items="choices"
                    label="You gain..."
                  />
                  <v-textarea v-model="details1" auto-grow rows="1" label="Details" box />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="ma-2">
                  <v-select outline v-model="loss" :items="choices" label="But lose..." />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" v-else>
            <p class="pt-2 pb-0 ma-0 minor-title">Gain two reserves:</p>
            <v-row>
              <v-col cols="6">
                <div class="ma-2">
                  <v-select
                    hide-details
                    outline
                    v-model="reserve1"
                    :items="choices"
                    label="You gain..."
                  />
                  <v-textarea v-model="details1" auto-grow rows="1" label="Details" box />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="ma-2">
                  <v-select
                    hide-details
                    outline
                    v-model="reserve2"
                    :items="choices"
                    label="...as well as..."
                  />
                  <v-textarea v-model="details2" auto-grow rows="1" label="Details" box />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn flat @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn large color="primary" @click="addReserve" :disabled="addDisabled">add reserve</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'damn-drink',
  props: {
    pilot: Object,
  },
  data: () => ({
    skillRoll: '',
    details: '',
    losses: ['Your dignity', 'All of your possessions', 'Your memory'],
    kept: '',
    reserve1: '',
    details1: '',
    reserve2: '',
    details2: '',
    loss: '',
    choices: [
      'A good reputation',
      'A friend or connection',
      'A useful item or piece of information',
      'A convenient opportunity',
    ],
  }),
  computed: {
    addDisabled() {
      if (!this.skillRoll) return true
      return (
        (this.skillRoll < 10 && !this.kept) ||
        (this.skillRoll > 10 && this.skillRoll < 20 && (!this.reserve1 || !this.loss)) ||
        (this.skillRoll >= 20 && (!this.reserve1 || !this.reserve2))
      )
    },
  },
  methods: {
    addReserve() {
      if (this.skillRoll < 10) {
        let nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Narrative',
          name: 'A Damn Drink',
          label: '',
          description: '',
          roll_min: 0,
          roll_max: 0,
        })
        // nr.Note = this.details
        const lossArr = [...this.losses]
        lossArr.splice(lossArr.findIndex(x => x === this.kept), 1)
        nr.ResourceCost = `You've lost ${lossArr[0].toLowerCase()}, as well as ${lossArr[1].toLowerCase()}`
        this.pilot.Reserves.push(nr)
      } else if (this.skillRoll < 20) {
        let nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Narrative',
          name: this.reserve1,
          label: '',
          description: '',
          roll_min: 0,
          roll_max: 0,
        })
        nr.Note = this.details1
        nr.ResourceCost = `You've lost ${this.loss.toLowerCase()}`
        this.pilot.Reserves.push(nr)
      } else {
        let nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Narrative',
          name: this.reserve1,
          label: '',
          description: '',
          roll_min: 0,
          roll_max: 0,
        })
        nr.Note = this.details1
        this.pilot.Reserves.push(nr)

        let nr2 = new Reserve({
          id: 'reserve_damndrink',
          type: 'Narrative',
          name: this.reserve2,
          label: '',
          description: '',
          roll_min: 0,
          roll_max: 0,
        })
        nr2.Note = this.details2
        this.pilot.Reserves.push(nr2)
      }
      this.close()
    },
    close() {
      this.skillRoll = ''
      this.details = ''
      this.kept = ''
      this.reserve1 = ''
      this.details1 = ''
      this.reserve2 = ''
      this.details2 = ''
      this.loss = ''
      this.$emit('close')
    },
  },
})
</script>
