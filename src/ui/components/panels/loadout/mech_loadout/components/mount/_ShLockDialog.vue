<template>
  <v-dialog v-model="dialog" width="50vw">
    <v-card tile>
      <cc-titlebar large icon="cci-role-striker" color="primary">
        Select Bracing Mount
        <v-btn slot="items" dark icon @click="dialog = false">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>
      <v-card-text class="text-center flavor-text mt-2">
        <span class="overline">// PROCESS INTERRUPT: PILOT INPUT REQUIRED //</span>
        <br />
        //[COMP/CON:
        <b class="stark--text">
          Lancer, Superheavy-class armament requires two mounts. Please select a
          <span class="accent--text">bracing mount.</span>
          This bracing mount will be not be able to field armament until the Superheavy weapon is
          removed.
        </b>
        ]
        <br />
        <v-btn
          v-for="m in availableMounts"
          :key="m.Name"
          x-large
          block
          outlined
          color="primary"
          class="my-2"
          @click="$emit('select', m)"
        >
          {{ m.Name }}
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { EquippableMount } from '@/class'

export default Vue.extend({
  name: 'sh-lock-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    availableMounts: [],
  }),
  mounted() {
    const candidates = this.mech.ActiveLoadout.AllEquippableMounts(
      this.mech.Pilot.has('corebonus', 'cb_improved_armament'),
      false
    ) as EquippableMount[]

    this.availableMounts = candidates.filter(x => x.Name !== this.mount.Name)
  },
  methods: {
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
  },
})
</script>
