<template>
  <v-dialog v-model="dialog" scrollable width="70vw" transition="dialog-transition">
    <v-card>
      <v-toolbar flat dark color="overcharge" class="heading h2">Overcharge</v-toolbar>
      <v-card-text class="effect-text pb-0">
        <p>
          Overcharging immediately allows you to make any quick action of your choice as a free
          action, even one you already made this turn.
        </p>
        <p class="text-center heading h3 pb-0">
          Overcharging will incur
          <span class="red--text text--darken-2">
            {{ overcharge[mech.CurrentOvercharge] }} Heat
          </span>
          <br />
          <span class="caption">INPUT HEAT COST TO CONFIRM OVERCHARGE</span>
        </p>
        <div class="ml-5 mr-5">
          <v-text-field
            v-model="overcharge_heat"
            type="number"
            label="Heat Roll Result"
            outline
            append-outer-icon="add"
            prepend-icon="remove"
            @click:append-outer="overcharge_heat < 10 ? overcharge_heat++ : ''"
            @click:prepend="overcharge_heat > 0 ? overcharge_heat-- : ''"
          ></v-text-field>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn large dark color="overcharge" :disabled="!overcharge_heat" @click="commitOvercharge">
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
