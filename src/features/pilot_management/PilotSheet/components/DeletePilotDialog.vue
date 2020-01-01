<template>
  <v-dialog v-model="dialog" width="75vw">
    <v-card>
      <v-card-text class="text-center flavor-text">
        <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
        <br />
        //[COMP/CON:
        <b class="black--text">
          Lancer, please confirm deletion of Pilot Registration Information for:
          <span class="primary--text">
            {{ pilot.Callsign }} ({{ pilot.Name }}, LL{{ pilot.Level }})
          </span>
        </b>
        ]
        <v-divider class="my-2" />
        <v-row dense>
          <v-btn small text @click="dialog = false">DENY</v-btn>
          <cc-btn small color="error" class="ml-auto" @click="remove()">
            CONFIRM
          </cc-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'delete-pilot-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
    remove() {
      this.$emit('delete')
      this.hide()
    },
  },
})
</script>
