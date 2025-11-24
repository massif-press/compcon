<template>
  <v-col v-if="hasSave" cols="auto" class="pl-5 pr-2">
    <div class="text-cc-overline text-disabled">Save Half</div>
    <div class="mt-2">
      <cc-switch
        :model-value="saveHalf"
        size="large"
        color="error"
        bg-color="background"
        @update:model-value="$emit('update:save-half', $event)" />
    </div>
  </v-col>
</template>

<script>
export default {
  name: 'SaveHalfToggle',
  props: {
    saveHalf: { type: Boolean, required: true },
    hasSave: { type: Boolean, required: true },
  },
  emits: ['update:save-half'],
};
</script>
