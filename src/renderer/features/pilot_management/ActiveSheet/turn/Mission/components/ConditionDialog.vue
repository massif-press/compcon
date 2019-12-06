<template>
  <v-dialog v-model="dialog" width="50vw" persistent transition="dialog-transition">
    <v-card>
      <v-toolbar dark flat dense class="heading h2">Select Condiditon to End</v-toolbar>
      <v-card-text class="pa-6">
        <v-btn v-for="c in mech.Conditions" :key="c" block x-large text @click="endCondition(c)">
          {{ c }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'condition-dialog',
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
    endCondition(c: string) {
      const cidx = this.mech.Conditions.findIndex(x => x === c)
      if (cidx > -1) this.mech.Conditions.splice(cidx, 1)
      this.dialog = false
    },
  },
})
</script>
