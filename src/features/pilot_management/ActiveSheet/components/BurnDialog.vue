<template>
  <v-dialog v-model="dialog" scrollable width="50vw" transition="dialog-transition">
    <v-card>
      <v-toolbar flat dense dark color="damage--burn" class="heading h2">Burn</v-toolbar>
      <v-card-text class="pb-0 text-center">
        <div class="heading h3 font-weight-bold stark--text mt-2">
          <cc-slashes />
          Your mech has been inflicted with
          <span class="damage--burn--text">{{ mech.Burn }} Burn</span>
          <cc-slashes />
        </div>
        <p class="my-2 body-text text--text">
          Make an
          <b>ENGINEERING</b>
          check to clear the current
          <span class="damage--burn--text">Burn</span>
          , or suffer
          <span class="damage--burn--text">{{ mech.Burn }} Damage</span>
        </p>
        <v-row dense justify="center">
          <v-col cols="6">
            <v-text-field
              v-model="roll"
              type="number"
              label="Engineering Check Result"
              outlined
              dense
              hide-details
              class="flavor-text"
              append-outer-icon="mdi-plus-circle-outline"
              prepend-icon="mdi-minus-circle-outline"
              @click:append-outer="roll++"
              @click:prepend="roll > 0 ? roll-- : ''"
            />
          </v-col>
        </v-row>
        <v-row v-if="roll" dense justify="center">
          <v-col cols="6">
            <v-btn
              v-if="roll < 10"
              large
              dark
              tile
              block
              color="damage--burn"
              :disabled="!roll"
              @click="complete()"
            >
              FAILURE
            </v-btn>
            <v-btn
              v-else
              large
              dark
              tile
              block
              color="success"
              :disabled="!roll"
              @click="complete(true)"
            >
              SUCCESS
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'burn-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    roll: null,
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
    complete(success) {
      if (success) this.mech.Burn = 0
      this.$emit('complete')
      this.dialog = false
    },
  },
})
</script>
