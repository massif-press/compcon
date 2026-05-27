<template>
  <cc-icon-divider icon="cc:frame"
    class="my-4" />
  <v-row dense
    align="center">
    <v-col cols="auto"
      class="pr-6 mt-n1">
      <div class="heading h2 ml-2"
        style="font-size: 52px; line-height: 50px">
        {{ mech.Name }}
      </div>
      <div class="heading h3 ml-2"
        style="font-size: 22px; line-height: 22px">
        <v-icon size="x-small"
          class="mb-1"
          :icon="mech.Frame.ManufacturerIcon" />
        {{ mech.Frame.Source }} {{ mech.Frame.Name }}
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{ mech: any }>()
</script>
