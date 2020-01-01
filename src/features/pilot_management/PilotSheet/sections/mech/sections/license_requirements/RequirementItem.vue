<template>
  <v-menu open-on-hover offset-y>
    <template v-slot:activator="{ on }">
      <v-chip
        slot="activator"
        label
        :outlined="!license.missing"
        :dark="license.missing"
        :color="license.missing ? 'deep-orange darken-4' : 'success darken-2'"
        class="ma-1"
        v-on="on"
      >
        <v-icon left>cci-rank-{{ license.rank }}</v-icon>
        {{ license.source }} {{ license.name }} {{ 'I'.repeat(license.rank) }}
      </v-chip>
    </template>

    <v-card tile>
      <v-card-title v-if="license.missing" class="warning white--text font-weight-bolder py-1 my-0">
        WARNING: LICENSE MISSING&emsp;
      </v-card-title>
      <v-card-text class="pa-2 text--text">
        <b>{{ license.name }} RANK {{ license.rank }}</b>
        <br />
        <i>Required for:&nbsp;</i>
        {{ license.items.join(', ') }}
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'requirement-item',
  props: {
    license: {
      type: Object,
      required: true,
    },
  },
})
</script>
