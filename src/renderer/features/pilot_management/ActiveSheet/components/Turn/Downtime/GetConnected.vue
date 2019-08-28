<template>
  <div>
    <v-card-text>
      <v-row wrap class="text-center">
        <v-col xs12 class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            You try and make connections, call upon favors, ask for help, or drum up support for a
            particular course of action. You need access to communications or just good old
            fashioned face to face conversation to take this action.
            <br />
            You can use your connection’s resources or aid as
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
        <v-col xs12>
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
          <v-col xs12 v-if="skillRoll < 10">
            <p class="pt-2 pb-0 ma-0 minor-title">
              You’ve got to do a favor or make good on a promise for your connection
              <em>right now</em>
              . Otherwise, they won’t help you at all.
              <br />
              If you take action right away, however, they’ll go along with what you want.
            </p>
          </v-col>
          <v-col xs12 v-else-if="skillRoll < 20">
            <p class="pt-2 pb-0 ma-0 minor-title">
              Your connection will help you, but you’ve got to do a favor or make good on a promise
              <em>after</em>
              they help you.
              <br />
              If you don’t, treat any result as a 9 or lower next time with the same organization.
            </p>
          </v-col>
          <v-col xs12 v-else>
            <p class="pt-2 pb-0 ma-0 minor-title">
              Your connection will help you out, no strings attached.
              <br />
              Treat this result as a 10-19 if you make it again with the same organization.
            </p>
          </v-col>
          <v-col xs12>
            <v-card color="grey lighten-4" class="ml-5 mr-5">
              <v-toolbar dark dense color="#00695C">
                <v-toolbar-title>Connection</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-text-field
                  v-model="custom_name"
                  label="Contact or Organization Name"
                  style="width: 500px"
                />
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
        :disabled="skillRoll === '' || custom_name === ''"
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
  name: 'get-connected',
  props: {
    pilot: Object,
  },
  data: () => ({
    skillRoll: '',
    custom_name: '',
    details: '',
  }),
  methods: {
    addReserve() {
      let nr = new Reserve({
        id: 'reserve_boughttime',
        type: 'Narrative',
        name: 'Connection',
        label: '',
        description: '',
        roll_min: 0,
        roll_max: 0,
      })
      nr.ResourceName = this.custom_name
      nr.Note = this.details
      if (this.skillRoll < 10)
        nr.ResourceCost =
          'You’ve got to do a favor or make good on a promise for your connection right away'
      else if (this.skillRoll < 20)
        nr.ResourceCost = 'You’ve got to do a favor or make good on a promise after they help you'
      this.pilot.Reserves.push(nr)
      this.close()
    },
    close() {
      this.skillRoll = ''
      this.custom_name = ''
      this.details = ''
      this.$emit('close')
    },
  },
})
</script>
