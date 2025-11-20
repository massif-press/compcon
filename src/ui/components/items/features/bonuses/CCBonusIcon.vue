<template>
  <v-menu open-on-hover>
    <template #activator="{ props }">
      <v-icon
        v-bind="props"
        :icon="bonus.Icon"
        color="exotic"
        style="position: absolute; right: 2px; bottom: 0" />
    </template>
    <v-card>
      <v-toolbar density="compact" color="exotic" height="46">
        <div class="heading h4 px-2">
          <v-icon start :icon="bonus.Icon" />
          {{ bonus.Title }}
        </div>
      </v-toolbar>
      <v-card-text class="pt-1 pb-3">
        <div>
          {{ bonus.Detail }}
        </div>
        <div class="text-right text-disabled">
          <i>From {{ bonus.Source }}</i>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'bonus-icon',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
};
</script>
