<template>
  <v-container fluid style="background-color: white">
    <v-tabs dark color="primary" grow slider-color="yellow">
      <v-tab>
        <span class="minor-title">Narrative Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Tactical Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Mech Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Custom Reserve</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Project</span>
      </v-tab>
      <v-tab>
        <span class="minor-title">Organization</span>
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs3 v-for="r in reserves['Narrative']" :key="r.ID">
                <reserve-item :reserve="r" color="teal darken-3" @click="add(r)" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs3 v-for="r in reserves['Tactical']" :key="r.ID">
                <reserve-item :reserve="r" color="lime darken-4" @click="add(r)" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs3 v-for="r in reserves['Mech']" :key="r.ID">
                <reserve-item :reserve="r" color="deep-orange darken-3" @click="add(r)" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row justify-center>
              <v-flex xs6>
                <v-card class="ma-2">
                  <v-toolbar dark flat dense color="deep-purple">
                    <v-toolbar-title class="minor-title">New Custom Reserve</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text class="effect-text pa-2 ma-0">
                    <v-select
                      v-model="custom_type"
                      label="Reserve Type"
                      :items="['Narrative', 'Mech', 'Tactical']"
                      outline
                      hide-details
                    />
                    <v-text-field v-model="custom_name" label="Resource Name" />
                    <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
                    <v-btn
                      block
                      outline
                      style="bottom: 10px; width:95%"
                      :color="color"
                      @click="addCustom"
                      :disabled="!custom_type || !custom_name"
                    >
                      <v-icon left>add</v-icon>Add Reserve
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap>project wip</v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap>org wip</v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import ReserveItem from './ReserveItem.vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'downtime-selector',
  components: { ReserveItem },
  data: () => ({
    custom_type: 'Narrative',
    custom_name: '',
    details: '',
  }),
  props: {
    pilot: Object,
  },
  computed: {
    reserves() {
      return _.groupBy(this.$store.getters.getItemCollection('Reserves'), 'Type')
    },
  },
  methods: {
    add(reserve: Reserve) {
      this.pilot.Reserves.push(reserve)
      this.$emit('notify', `New ${reserve.Name} Reserve added`)
      this.$emit('close')
    },
    addCustom() {
      let nr = new Reserve({
        id: 'reserve_custom',
        type: this.custom_type,
        name: this.custom_name,
        label: this.custom_name,
        description: this.details,
      })
      this.pilot.Reserves.push(nr)
      this.$emit('notify', `New Custom Reserve added`)
      this.$emit('close')
    },
  },
})
</script>
