<template>
  <div v-if="item.Detail" v-html-safe="item.Detail" class="body-text" />
  <div v-else v-html-safe="item.Description" class="body-text" />
  <div v-if="item.SuggestedSkills.length">
    <v-divider class="my-1" />
    <div class="text-cc-overline text-accent">Suggested Skills</div>
    <v-tooltip
      v-for="s in item.SuggestedSkills"
      location="top"
      :open-on-click="mobile"
      max-width="400px">
      <template #activator="{ props }">
        <cc-chip
          v-bind="props"
          icon="cc:skill"
          :label="s.Name"
          bg-color="primary"
          class="mr-2"
          variant="elevated" />
      </template>
      <div class="body-text">{{ s.Description }}</div>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-background-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
