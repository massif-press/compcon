<template>
  <v-row v-if="profile[`On${capitalizeAction}`]" align="center" dense>
    <v-col cols="auto">
      <v-icon size="25" icon="cc:weapon" />
    </v-col>
    <v-col class="text-overline text-stark text-uppercase" style="margin-bottom: -2px">
      <b>ON {{ namedAction }}</b>
    </v-col>
    <v-col cols="12">
      <div v-html-safe="profile[`On${capitalizeAction}`]" class="text-text body-text mt-n2 pl-3" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'ProfileOnElement',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  computed: {
    capitalizeAction() {
      return this.action.charAt(0).toUpperCase() + this.action.slice(1);
    },
    namedAction() {
      return this.action === 'crit' ? 'critical hit' : this.action;
    },
  },
};
</script>
