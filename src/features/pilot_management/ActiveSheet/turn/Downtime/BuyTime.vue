<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'You try and stave off some reckoning, extend your window of opportunity, or merely buy more time and breathing room for you and your group to act. You might be trying to dodge some heat, survive stranded in the wilderness, or cause a distraction so another plan can go off. <br /> You can use that distraction or bought time as <strong>reserves</strong> for the next mission.'
        "
      />
      <v-divider class="mb-2" />
      <div class="pt-2 heading h3 text-center">
        Roll
        <v-icon large color="accent">mdi-dice-d20</v-icon>
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
            <p
              v-if="skillRoll < 10"
              class="font-weight-bold px-3"
              v-html="
                'You can buy only a little time, and only if drastic measures are taken <em>right now.</em> Otherwise, whatever you\'re trying to stave off catches up to you.'
              "
            />
            <p
              v-else-if="skillRoll < 20"
              class="font-weight-bold px-3"
              v-html="
                'You can buy enough time, but the situation becomes precarious or desperate. Next time you get this result with the same situation, treat it as a 9 or lower.'
              "
            />
            <p
              v-else
              class="font-weight-bold px-3"
              v-html="
                'You buy enough time as you need for now, until the next mission. If you\'ve already gotten this result, it becomes a 10-19 for the same situation next time.'
              "
            />
            <v-card color="panel" flat tile class="ml-5 mr-5">
              <v-toolbar dark dense color="action--downtime">
                <v-toolbar-title class="heading h2">Bought Time</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-textarea
                  v-model="details"
                  color="accent"
                  auto-grow
                  rows="1"
                  label="Details"
                  filled
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        tile
        color="primary"
        :disabled="skillRoll === '' || details === ''"
        @click="addReserve()"
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
    pilot: { type: Object, required: true },
  },
  data: () => ({
    skillRoll: '',
    details: '',
  }),
  methods: {
    addReserve() {
      const nr = new Reserve({
        id: 'reserve_boughttime',
        type: 'Resources',
        name: 'Bought Time',
        label: '',
        description: 'More time and breathing room for you and your group to act',
        resource_note: this.details,
        resource_cost: '',
        resource_name: '',
        used: false,
      })
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
