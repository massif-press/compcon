<template>
  <fieldset
    class="pb-2 px-2"
    style="border-radius: 4px; border: 1px solid rgb(var(--v-theme-panel))">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined" size="small" style="border-color: rgb(var(--v-theme-panel))">
        <span class="text-disabled">SITREP</span>
        <cc-slashes class="mx-1" />
        <b class="text-accent">{{ sitrep.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="sitrep.Description">
      <div class="text-caption"><b class="text-accent">Description</b></div>
      <v-divider style="width: 150px" />
      {{ sitrep.Description }}
    </div>
    <div v-if="sitrep.Deployment" class="mt-1">
      <div class="text-caption"><b class="text-accent">Deployment</b></div>
      <v-divider style="width: 150px" />
      {{ sitrep.Deployment }}
    </div>
    <div v-if="sitrep.ControlZone" class="mt-1">
      <div class="text-caption"><b class="text-accent">Control Zone</b></div>
      <v-divider style="width: 150px" />
      {{ sitrep.ControlZone }}
    </div>
    <div v-if="sitrep.Extraction" class="mt-1">
      <div class="text-caption"><b class="text-accent">Extraction</b></div>
      <v-divider style="width: 150px" />
      {{ sitrep.Extraction }}
    </div>
    <div v-if="sitrep.Objective" class="mt-1">
      <div class="text-caption"><b class="text-accent">Objective</b></div>
      <v-divider style="width: 150px" />
      {{ sitrep.Objective }}
    </div>
    <div v-for="c in sitrep.Conditions" class="mt-1">
      <div class="text-caption">
        <b class="text-accent">{{ c.title }}</b>
      </div>
      <v-divider style="width: 150px" />

      {{ c.condition }}
    </div>
  </fieldset>
</template>

<script lang="ts">
export default {
  name: 'CCSitrepDisplay',
  props: {
    sitrep: { type: Object, required: true },
  },
};
</script>
