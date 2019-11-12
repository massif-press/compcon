<template>
  <div>
    <v-menu offset-y top absolute>
      <template v-slot:activator="{ on }">
        <cc-tooltip simple inline content="Delete Mech">
          <v-btn small icon class="fadeSelect" color="error" v-on="on">
            <v-icon>delete</v-icon>
          </v-btn>
        </cc-tooltip>
      </template>
      <v-card>
        <v-card-text class="text-center flavor-text">
          <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
          <br />//[COMP/CON:
          <b class="black--text">
            Lancer, please confirm deletion of Mech Configuration:
            <span
              class="primary--text"
            >{{ mech.Name }} ({{ mech.Frame.Source }} {{ mech.Frame.Name }})</span>
          </b>]
          <v-divider class="my-2" />
          <v-row dense>
            <v-btn small text>DENY</v-btn>
            <cc-btn small color="error" class="ml-auto" @click="$emit('delete')">CONFIRM</cc-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-menu offset-y top absolute>
      <template v-slot:activator="{ on }">
        <cc-tooltip simple inline content="Duplicate Mech">
          <v-btn small icon class="fadeSelect" v-on="on">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </cc-tooltip>
      </template>
      <v-card>
        <v-card-text class="text-center flavor-text">
          <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
          <br />//[COMP/CON:
          <b class="black--text">
            Lancer, please confirm intention to create a duplicate of Mech Configuration:
            <span
              class="primary--text"
            >{{ mech.Name }} ({{ mech.Frame.Source }} {{ mech.Frame.Name }})</span>
          </b>]
          <v-divider class="my-2" />
          <v-row dense>
            <v-btn small text>DENY</v-btn>
            <cc-btn small color="error" class="ml-auto" @click="$emit('dupe')">CONFIRM</cc-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
    <cc-tooltip simple inline content="Print Mech Sheet">
      <v-btn icon>
        <v-icon>mdi-printer</v-icon>
      </v-btn>
    </cc-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'mech-ops',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
})
</script>