<template>
  <v-container>
    <v-alert
      v-for="(alert, i) in item.TemplateFeatureAlerts"
      :key="`${alert}_${i}`"
      dense
      prominent
      outlined
      :color="alert.severity"
      icon="mdi-alert"
      class="heading h3"
    >
      {{ alert.message }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-feature-alerts',
  props: {
    item: { type: Object, required: true },
  },
})
</script>
