<template>
  <div v-show="AiSystems.length">
    <cc-synergy-display location="cascade" :mech="mech" />
    <v-card tile elevation="0" outlined>
      <v-toolbar dense elevation="0" color="error" class="text-center white--text heading h3">
        CASCADE ALERT
        <v-spacer />
        <cc-tooltip
          title="CASCADE"
          content="<p>Except for some limited systems &ndash; like comp/cons &ndash; any time a mech with the AI tag makes a structure damage or overheating check, roll 1d20. On a 1, the NHP&rsquo;s casket has suffered a traumatic impact or code incursion and the NHP enters cascade.&nbsp;</p>
<p>When an NHP begins to cascade, they immediately take over the mech and become an NPC under the control of the GM. They plan their own agenda, and adopt one of several behavioral patterns &ndash; ignoring their pilot, overruling their pilot, trying to get their pilot out of the way, or simply acting outside the constraints of human logic and desire. In cascade, NHPs&rsquo; actions do not always conform to human logic &ndash; though they are not yet unshackled, their actions may seem odd, contrapositive, or threatening to humans.&nbsp;</p>
<p>NHPs in cascade can be stabilized by a pilot choosing to <strong>SHUT DOWN</strong> their mech, returning them to their base state. This is the only action a pilot in a cascading mech can take. </p>"
        >
          <v-icon>mdi-information-outline</v-icon>
        </cc-tooltip>
      </v-toolbar>
      <v-row
        v-for="(a, i) in AiSystems"
        :key="`${a.ID}_${i}`"
        class="heading h3 py-2"
        align="center"
      >
        <v-col>
          {{ a.Name }}
        </v-col>
        <v-col>
          STATUS:
          <span v-if="!checked.includes(i)" style="opacity: 0.4">PENDING</span>
          <span v-else :class="a.IsCascading ? 'red--text' : 'success--text'">
            {{ a.IsCascading ? 'IN CASCADE' : 'NOMINAL' }}
          </span>
        </v-col>
        <v-col cols="auto" class="mr-3">
          <cc-dice-menu preset="1d20" @commit="checkCascade($event.total, i)" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cascade-check',
  props: {
    mech: { type: Object, required: true },
  },
  data: () => ({
    checked: [],
  }),
  computed: {
    AiSystems() {
      return this.mech.ActiveLoadout.Equipment.filter(x => x.IsAI && !x.NoCascade && !x.Destroyed)
    },
  },
  methods: {
    checkCascade(roll, index) {
      this.checked.push(index)
      if (roll === 1) this.AiSystems[index].IsCascading = true
      else this.AiSystems[index].IsCascading = false
    },
  },
})
</script>