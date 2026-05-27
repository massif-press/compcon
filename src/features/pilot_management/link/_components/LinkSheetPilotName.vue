<template>
  <v-col cols="auto"
    class="pr-6 mt-n1">
    <div class="heading h2 ml-2"
      style="font-size: 52px; line-height: 50px">
      {{ pilot.Callsign }}
    </div>
    <div class="heading h3 ml-2"
      style="font-size: 22px; line-height: 22px">
      {{ pilot.Name }}
      <span v-if="pilot.Background"
        class="heading h3 text-accent">
        <cc-slashes class="pl-1" />
        {{ pilot.Background }}
      </span>
    </div>
  </v-col>
</template>

<script setup lang="ts">
defineProps<{ pilot: any }>()
</script>
