<template>
  <fieldset
    class="pb-2 px-2"
    style="border-radius: 4px; border: 1px solid rgb(var(--v-theme-panel))">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined" size="small" style="border-color: rgb(var(--v-theme-panel))">
        <span class="text-disabled">ENVIRONMENT</span>
        <cc-slashes class="mx-1" />
        <b class="text-accent">{{ environment.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="environment.Description">
      <div class="text-caption"><b class="text-accent">Description</b></div>
      <v-divider style="width: 150px" />
      {{ environment.Description }}
    </div>
  </fieldset>
</template>

<script lang="ts">
export default {
  name: 'CCEnvironmentDisplay',
  props: {
    environment: { type: Object, required: true },
  },
};
</script>
