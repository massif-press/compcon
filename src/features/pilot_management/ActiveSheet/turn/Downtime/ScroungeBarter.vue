<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'You try and get your hands on some gear or asset for your group by dredging the scrapyard, chasing down rumors, bartering in the local market, hunting around, or through good old fashioned force of will. You could try and get some better pilot gear that could help you, a vehicle, narcotics, goods, or other sundries. It’s got to be something physical that you can acquire, but doesn’t necessarily have to be on the gear list. If you get it, you can take it on the next mission as <strong>reserves.</strong>'
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
              You can get what you’re looking for, but...
              <v-radio-group v-model="choice" mandatory>
                <v-radio v-for="(c, i) in choices" :key="c" :label="c" :value="i"></v-radio>
              </v-radio-group>
            </p>
            <p v-else-if="skillRoll < 20" class="font-weight-bold px-3">
              You can get what you’re looking for, as long as you trade in a little...
              <v-radio-group v-model="trade" mandatory>
                <v-radio v-for="(t, i) in trades" :key="t" :label="t" :value="i"></v-radio>
              </v-radio-group>
            </p>
            <p v-else class="font-weight-bold px-3">
              You get what you’re looking for, no problems at all.
            </p>
          </v-col>
          <v-row dense>
            <v-col>
              <v-card color="panel" class="ml-5 mr-5 mt-2">
                <v-toolbar dark dense color="action--downtime">
                  <v-toolbar-title>New Asset</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    v-model="custom_name"
                    label="Asset or Gear"
                    style="width: 500px"
                    dense
                    outlined
                  />
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" filled />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="!skillRoll || !custom_name" @click="addReserve">
        add reserve
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'scrounge-barter',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
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
      const nr = new Reserve({
        id: 'reserve_scroungebarter',
        type: 'Resources',
        name: 'Asset',
        label: '',
        description: '',
        resource_note: this.details,
        resource_name: this.custom_name,
        resource_cost: '',
        used: false,
      })
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
