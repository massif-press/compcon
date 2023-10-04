<template>
  <div class="text-center mr-6">
    <div class="border">
      <v-img v-if="pilot.Portrait" :src="pilot.Portrait" max-width="100%" />
    </div>
    <v-btn
      color="secondary"
      small
      block
      variant="plain"
      @click="($refs as any).imageSelector.open()"
    >
      <v-icon start>mdi-circle-edit-outline</v-icon>
      Set Pilot Portrait
    </v-btn>

    <cc-image-selector ref="imageSelector" :item="pilot" type="pilot" avatar />
  </div>
</template>

<script lang="ts">
import { Pilot } from '@/class';
export default {
  name: 'image-block',
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
};
</script>
