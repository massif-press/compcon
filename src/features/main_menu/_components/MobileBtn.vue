<template>
  <v-col cols="6">
    <v-card
      variant="tonal"
      tile
      class="text-center"
      height="100%"
      @click="to ? $router.push(to) : $emit('clicked')">
      <div class="d-flex justify-center align-center" style="height: 90%">
        <div class="primary py-4">
          <v-icon dark size="45vw">
            {{ icon }}
          </v-icon>
          <div class="heading no-wrap pb-4" style="font-size: 5.5vw">
            {{ title }}
          </div>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'mobile-btn',
  props: {
    to: { type: String, required: false, default: '' },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    disabled: { type: Boolean },
    loading: { type: Boolean },
  },
};
</script>
