<template>
  <cc-titled-panel :title="talent.Name" icon="cci-trait">
    <v-btn slot="items" icon @click="$refs.dialog.show()">
      <v-icon large>mdi-information-outline</v-icon>
    </v-btn>
    <cc-solo-dialog ref="dialog" large icon="cci-trait" no-confirm :title="talent.Name">
      <cc-talent-info :talent="talent" />
    </cc-solo-dialog>
    <v-stepper v-model="step" non-linear class="elevation-0 mt-n1">
      <v-stepper-header style="height: 50px" class="elevation-0">
        <v-stepper-step
          v-for="i in 3"
          :key="i"
          :step="'I'.repeat(i)"
          :complete="pilotRank >= i"
          :complete-icon="`cci-rank-${i}`"
          :edit-icon="`cci-rank-${i}`"
          editable
        >
          {{ talent.Ranks[i - 1].name }}
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="i in 3" :key="i" :step="'I'.repeat(i)" class="py-0 mt-n4">
          <cc-talent-rank-item
            :lock="pilotRank < i"
            :rank="i"
            :description="talent.Ranks[i - 1].description"
          />
          <v-btn
            v-if="pilotRank < i"
            block
            :disabled="!available || (newPilot && i > 1)"
            outlined
            color="secondary"
            @click="add()"
          >
            <v-icon left>cci-accuracy</v-icon>
            Unlock {{ talent.Name }}: {{ talent.Ranks[i - 1].name }}
          </v-btn>
          <v-btn v-else block outlined color="error" @click="remove()">
            <v-icon left>cci-difficulty</v-icon>
            Unlearn {{ talent.Name }}: {{ talent.Ranks[i - 1].name }}
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talent-item',
  props: {
    talent: {
      type: Object,
      required: true,
    },
    pilotRank: {
      type: Number,
      required: true,
    },
    newPilot: {
      type: Boolean,
      required: false,
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    step: 'I',
  }),
  created() {
    if (this.pilotRank === 1) this.step = 'II'
    else if (this.pilotRank > 1) this.step = 'III'
  },
  methods: {
    add(): void {
      this.$emit('add')
      if (!this.newPilot && this.step !== 'III') this.step += 'I'
    },
    remove(): void {
      this.$emit('remove')
      if (!this.newPilot && this.step !== 'I') this.step = this.step.substring(1)
    },
  },
})
</script>
