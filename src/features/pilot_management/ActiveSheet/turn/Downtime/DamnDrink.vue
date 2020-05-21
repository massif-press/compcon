<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'You can only make this action where there’s a drink to actually get (in town, a station, a city, or some other populated area). It doesn’t have to be an actual drink, but you blow off some steam, carouse, and generally get into trouble. You could be doing this to make connections, collect gossip, forge a reputation, or maybe just to forget what happened on the last mission. There’s usually trouble.'
        "
      />
      <v-divider class="mb-2" />
      <div class="pt-2 heading h3 text-center">
        Roll
        <v-icon large color="primary">mdi-dice-d20</v-icon>
        &nbsp;and add any relevant Skill Trigger bonuses, modifiers, or accuracy
      </div>
      <v-row justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="skillRoll"
            type="number"
            label="Roll Result"
            outlined
            dense
            hide-details
            append-outer-icon="mdi-plus-circle-outline"
            prepend-icon="mdi-minus-circle-outline"
            @click:append-outer="skillRoll++"
            @click:prepend="skillRoll > 1 ? skillRoll-- : ''"
          />
        </v-col>
      </v-row>
      <v-slide-y-transition>
        <v-row v-show="skillRoll" justify="center" class="text-center flavor-text">
          <v-col cols="10">
            <p v-if="skillRoll < 10" class="font-weight-bold px-3">
              You can decide whether you had good time or not. However, you wake up in a gutter
              somewhere with only one of the following:
              <v-select
                v-model="kept"
                class="ml-5 mr-5"
                outlined
                :items="losses"
                label="You retain..."
              />
            </p>
            <p v-else-if="skillRoll < 20" class="font-weight-bold px-3">
              <span
                v-html="
                  'You gain one of the following choices as <strong>reserves</strong> , and lose one:'
                "
              />
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="reserve1"
                    hide-details
                    dense
                    outlined
                    :items="choices"
                    label="You gain..."
                  />
                  <v-textarea
                    v-if="reserve1"
                    v-model="details1"
                    auto-grow
                    rows="1"
                    label="Details"
                    filled
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="loss"
                    outlined
                    dense
                    hide-details
                    :items="choices"
                    label="But lose..."
                  />
                </v-col>
              </v-row>
            </p>
            <p v-else class="font-weight-bold px-3">
              Gain two reserves:
              <v-row>
                <v-col cols="6">
                  <div class="ma-2">
                    <v-select
                      v-model="reserve1"
                      hide-details
                      outlined
                      dense
                      :items="choices"
                      label="You gain..."
                    />
                    <v-textarea
                      v-if="reserve1"
                      v-model="details1"
                      auto-grow
                      rows="1"
                      label="Details"
                      filled
                    />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="ma-2">
                    <v-select
                      v-model="reserve2"
                      hide-details
                      outlined
                      dense
                      :items="choices"
                      label="...as well as..."
                    />
                    <v-textarea
                      v-if="reserve2"
                      v-model="details2"
                      auto-grow
                      rows="1"
                      label="Details"
                      filled
                    />
                  </div>
                </v-col>
              </v-row>
            </p>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="addDisabled" @click="addReserve">
        add reserve
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'damn-drink',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
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
        const nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Resources',
          name: 'A Damn Drink',
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          used: false,
        })
        const lossArr = [...this.losses]
        lossArr.splice(
          lossArr.findIndex(x => x === this.kept),
          1
        )
        nr.ResourceCost = `You've lost ${lossArr[0].toLowerCase()}, as well as ${lossArr[1].toLowerCase()}`
        this.pilot.Reserves.push(nr)
      } else if (this.skillRoll < 20) {
        const nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Resources',
          name: this.reserve1,
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          used: false,
        })
        nr.Note = this.details1
        nr.ResourceCost = `You've lost ${this.loss.toLowerCase()}`
        this.pilot.Reserves.push(nr)
      } else {
        const nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Resources',
          name: this.reserve1,
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          used: false,
        })
        nr.Note = this.details1
        this.pilot.Reserves.push(nr)

        const nr2 = new Reserve({
          id: 'reserve_damndrink',
          type: 'Resources',
          name: this.reserve2,
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          used: false,
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
