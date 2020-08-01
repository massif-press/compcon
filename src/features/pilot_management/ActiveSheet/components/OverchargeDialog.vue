<template>
  <v-dialog v-model="dialog" scrollable width="70vw" transition="dialog-transition">
    <v-card>
      <v-toolbar flat dense dark color="overcharge" class="heading h2">Overcharge</v-toolbar>
      <v-card-text class="flavor-text pb-0">
        <p class="pt-2 text--text">
          Overcharging immediately allows you to make any quick action of your choice as a free
          action, even one you already made this turn.
        </p>
        <div class="text-center heading h3 pb-0">
          Overcharging will incur
          <span class="red--text text--darken-2">
            {{ overcharge_levels[mech.CurrentOvercharge] }} Heat
          </span>
          <br />
          <span class="overline">INPUT HEAT COST TO CONFIRM OVERCHARGE</span>
        </div>
        <v-row justify="center">
          <v-col cols="3">
            <v-text-field
              v-model="overcharge_heat"
              type="number"
              label="Heat Roll Result"
              outlined
              dense
              append-outer-icon="mdi-plus-circle-outline"
              prepend-icon="mdi-minus-circle-outline"
              @click:append-outer="overcharge_heat < 10 ? overcharge_heat++ : ''"
              @click:prepend="overcharge_heat > 0 ? overcharge_heat-- : ''"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          large
          dense
          dark
          tile
          color="overcharge"
          :disabled="!overcharge_heat"
          @click="overcharge()"
        >
          Overcharge
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'overcharge-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    overcharge_levels: ['+1', '+1d3', '+1d6', '+1d6+4'],
    overcharge_heat: 0,
  }),
  methods: {
    show() {
      this.dialog = true
    },
    overcharge() {
      this.$emit('overcharge', parseInt(this.overcharge_heat))
      this.dialog = false
    },
  },
})
</script>
