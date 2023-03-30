<template>
  <v-container>
    <v-alert
      v-for="(alert, i) in item.NpcTemplateController.TemplateFeatureAlerts"
      density="compact"
      prominent
      variant="outlined"
      :color="alert.severity"
      icon="mdi-alert"
      class="heading h3"
    >
      {{ alert.message }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'npc-feature-alerts',
  props: {
    item: { type: Object, required: true },
  },
};
</script>
