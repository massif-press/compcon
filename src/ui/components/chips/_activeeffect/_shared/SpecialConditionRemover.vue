<template>
  <v-col v-if="event.RemoveSpecialStatus.length"
    :cols="cols">
    <div class="text-cc-overline text-disabled">remove special condition</div>
    <v-card v-for="(s, index) in event.RemoveSpecialStatus"
      :key="`remove-special-status-${index}`"
      flat
      border="sm"
      color="exotic"
      class="text-center heading h3 rounded-lg mt-1">
      {{ s }}
    </v-card>
  </v-col>
</template>



<script lang="ts">

export default {
  name: 'SpecialConditionRemover',
  props: {
    event: { type: Object, required: true },
    cols: { type: [Number, String], default: 'auto' }
  },
};
</script>