<template>
  <v-col :cols="cols"
    v-if="event.SpecialEvents.length">
    <div class="text-cc-overline text-disabled">remove special condition</div>
    <v-card v-for="s in event.RemoveSpecialStatus"
      flat
      border="sm"
      color="exotic"
      class="text-center heading h3 rounded-lg mt-1">
      {{ s }}
    </v-card>
  </v-col>
</template>



<script>
import { CompendiumStore } from '@/stores';

export default {
  name: 'SpecialConditionRemover',
  props: {
    event: { type: Object, required: true },
    cols: { type: [Number, String], default: 'auto' }
  },
};
</script>