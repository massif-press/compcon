<template>
  <v-dialog v-model="dialog" width="75vw">
    <v-card>
      <v-card-text class="text-center flavor-text">
        <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
        <br />
        //[COMP/CON:
        <b class="black--text">
          Lancer, please confirm intention to create a duplicate of Mech Configuration:
          <span class="primary--text">
            {{ mech.Name }} ({{ mech.Frame.Source }} {{ mech.Frame.Name }})
          </span>
        </b>
        ]
        <v-divider class="my-2" />
        <v-row dense>
          <v-btn small text @click="dupeDialog = false">DENY</v-btn>
          <cc-btn small color="error" class="ml-auto" @click="dupe()">CONFIRM</cc-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'copy-mech-dialog',
  props: {
    mech: {
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
    dupe() {
      this.$emit('copy')
      this.hide()
    },
  },
})
</script>
