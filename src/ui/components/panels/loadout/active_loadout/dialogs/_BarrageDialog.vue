<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
  >
    <v-card tile class="background">
      <cc-titlebar large>
        Skirmish
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.breakpoint.mdAndDown" class="titlebar-margin" />

      <v-card-text>
        {{ extraAux }}
      </v-card-text>
      <div>
        <v-divider />

        <v-card-actions>
          <v-btn text @click="hide">cancel</v-btn>
          <v-spacer />
          <cc-btn @click="confirm">confirm</cc-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'skirmish-dialog',
  data: () => ({
    dialog: false,
  }),
  methods: {
    confirm(): void {
      this.dialog = false
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
    },
  },
})
</script>
