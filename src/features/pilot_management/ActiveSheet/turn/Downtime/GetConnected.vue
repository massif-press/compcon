<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'You try and make connections, call upon favors, ask for help, or drum up support for a particular course of action. You need access to communications or just good old fashioned face to face conversation to take this action. <br /> You can use your connection’s resources or aid as <strong>reserves</strong> for the next mission.'
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
            <p
              v-if="skillRoll < 10"
              class="font-weight-bold px-3"
              v-html="
                'You’ve got to do a favor or make good on a promise for your connection <em>right now</em> . Otherwise, they won’t help you at all. <br /> If you take action right away, however, they’ll go along with what you want.'
              "
            />

            <p
              v-else-if="skillRoll < 20"
              class="font-weight-bold px-3"
              v-html="
                'Your connection will help you, but you’ve got to do a favor or make good on a promise <em>after</em> they help you. <br /> If you don’t, treat any result as a 9 or lower next time with the same organization.'
              "
            />

            <p
              v-else
              class="font-weight-bold px-3"
              v-html="
                'Your connection will help you out, no strings attached. <br /> Treat this result as a 10-19 if you make it again with the same organization.'
              "
            />
          </v-col>
          <v-row dense>
            <v-col>
              <v-card color="panel" class="ml-5 mr-5 mt-2">
                <v-toolbar dark dense color="action--downtime">
                  <v-toolbar-title>Connection</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    v-model="custom_name"
                    label="Contact or Organization Name"
                    outlined
                    dense
                    hide-details
                  />
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" />
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
  name: 'get-connected',
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
  }),
  methods: {
    addReserve() {
      const nr = new Reserve({
        id: 'reserve_boughttime',
        type: 'Resources',
        name: 'Connection',
        label: '',
        description: '',
        resource_note: this.details,
        resource_name: this.custom_name,
        resource_cost: '',
        used: false,
      })
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
