<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'You poke your nose around, perhaps where it doesn’t belong. You’re investigating something, doing research, following up on a mystery, tracking a target, or keeping an eye on something. You might be doing research in a library, or go undercover in an organization to learn what you can. Whatever you’re doing, you’re generally trying to gather information on a subject of your choosing.'
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
        <v-row v-show="skillRoll" dense justify="center" class="text-center flavor-text">
          <v-col cols="10">
            <p v-if="skillRoll < 10" class="font-weight-bold px-3">
              You can choose to get out now, or get what you are looking for. If you choose the
              latter, you get your information but it immediately gets you into trouble.
              <br />
              <v-slide-x-transition>
                <v-btn
                  v-show="!commit"
                  small
                  tile
                  class="mx-2"
                  color="success darken-1"
                  @click="close"
                >
                  Get out now
                </v-btn>
              </v-slide-x-transition>
              <v-slide-x-reverse-transition>
                <v-btn
                  v-show="!commit"
                  small
                  tile
                  class="mx-2"
                  color="primary"
                  @click="commit = true"
                >
                  Get what you are looking for
                </v-btn>
              </v-slide-x-reverse-transition>
            </p>
            <p v-else-if="skillRoll < 20" class="font-weight-bold px-3">
              you find the information you’ve looking for. However...
              <v-card class="pa-1 ma-0" color="panel">
                <v-card-text class="pa-1 ma-0">
                  <v-radio-group v-model="choice" mandatory>
                    <v-radio :label="choices[0]" :value="0"></v-radio>
                    <v-radio :label="choices[1]" :value="1"></v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-card>
            </p>
            <p v-else class="font-weight-bold px-3">
              You get your information cleanly, no complications
            </p>
          </v-col>
          <v-row dense>
            <v-col>
              <v-slide-y-transition>
                <v-card
                  v-if="skillRoll >= 10 || (skillRoll < 10 && commit)"
                  color="panel"
                  class="ml-5 mr-5 mt-2"
                >
                  <v-toolbar dark dense color="action--downtime">
                    <v-toolbar-title>Gathered Information</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-textarea v-model="details" auto-grow rows="1" label="Details" />
                  </v-card-text>
                </v-card>
              </v-slide-y-transition>
            </v-col>
          </v-row>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="!skillRoll || !details" @click="addReserve">
        add reserve
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'gather-information',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
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
      const nr = new Reserve({
        id: 'reserve_gatherinfo',
        type: 'Resources',
        name: 'Information',
        label: '',
        description: '',
        resource_note: this.details,
        resource_name: '',
        resource_cost: '',
        used: false,
      })
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
