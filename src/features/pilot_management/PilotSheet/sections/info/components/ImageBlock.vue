<template>
  <div class="text-center">
    <div class="border">
      <v-img v-if="pilot.Portrait" :src="pilot.Portrait" max-width="100%" />
    </div>
    <v-btn
      variant="outlined"
      color="secondary"
      small
      block
      class="fade-select"
      @click="$refs.imageSelector.open()"
    >
      <v-icon start>mdi-circle-edit-outline</v-icon>
      Set Pilot Portrait
    </v-btn>

    <cc-image-selector-web ref="imageSelector" :item="pilot" type="pilot" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'image-block',
};
</script>
