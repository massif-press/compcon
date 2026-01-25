<template>
  <v-card v-if="duration"
    style="width: 100%"
    flat
    tile
    variant="elevated"
    class="mt-1 pa-1"
    color="light-panel">
    <div class="text-text text-caption text-center">
      <span>Until&nbsp;</span>
      <b>{{ duration }}</b>
    </div>
  </v-card>
</template>


<script>
export default {
  name: 'BaseDurationDisplay',
  props: {
    duration: { type: Object, required: true }
  },
};
</script>
