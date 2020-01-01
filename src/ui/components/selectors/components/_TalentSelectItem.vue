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
          step="I"
          :complete="pilotRank >= 1"
          complete-icon="cci-rank-1"
          edit-icon="cci-rank-1"
          editable
        >{{ talent.Ranks[0].name }}</v-stepper-step>
        <v-stepper-step
          step="II"
          :complete="pilotRank >= 2"
          complete-icon="cci-rank-2"
          edit-icon="cci-rank-2"
          editable
        >{{ talent.Ranks[1].name }}</v-stepper-step>
        <v-stepper-step
          step="III"
          :complete="pilotRank === 3"
          complete-icon="cci-rank-3"
          edit-icon="cci-rank-3"
          editable
        >{{ talent.Ranks[2].name }}</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="I" class="py-0 mt-n4">
          <cc-talent-rank-item
            :lock="pilotRank < 1"
            :rank="1"
            :description="talent.Ranks[0].description"
          />
          <v-btn v-if="!pilotRank" block outlined color="secondary" @click="add()">
            <v-icon left>cci-accuracy</v-icon>
            Unlock {{ talent.Name }}: {{ talent.Ranks[0].name }}
          </v-btn>
          <v-btn v-else-if="pilotRank >= 1" block outlined color="error" @click="$emit('remove')">
            <v-icon left>cci-difficulty</v-icon>
            Unlearn {{ talent.Name }}: {{ talent.Ranks[0].name }}
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="II" class="py-0 mt-n4">
          <cc-talent-rank-item
            :lock="pilotRank < 2"
            :rank="2"
            :description="talent.Ranks[1].description"
          />
          <div v-if="pilotRank >= 1">
            <v-btn v-if="pilotRank === 1" block outlined color="secondary" @click="add()">
              <v-icon left>cci-accuracy</v-icon>
              Unlock {{ talent.Name }}: {{ talent.Ranks[1].name }}
            </v-btn>
            <v-btn v-else-if="pilotRank >= 2" block outlined color="error" @click="$emit('remove')">
              <v-icon left>cci-difficulty</v-icon>
              Unlearn {{ talent.Name }}: {{ talent.Ranks[1].name }}
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="III" class="py-0 mt-n4">
          <cc-talent-rank-item
            :lock="pilotRank < 3"
            :rank="3"
            :description="talent.Ranks[2].description"
          />
          <div v-if="pilotRank >= 2">
            <v-btn v-if="pilotRank === 2" block outlined color="secondary" @click="add()">
              <v-icon left>cci-accuracy</v-icon>
              Unlock {{ talent.Name }}: {{ talent.Ranks[2].name }}
            </v-btn>
            <v-btn
              v-else-if="pilotRank === 3"
              block
              outlined
              color="error"
              @click="$emit('remove')"
            >
              <v-icon left>cci-difficulty</v-icon>
              Unlearn {{ talent.Name }}: {{ talent.Ranks[1].name }}
            </v-btn>
          </div>
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
