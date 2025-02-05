<template>
  <v-col :cols="landscape ? '' : 6">
    <div class="pip bg-accent" />
    <v-card
      variant="tonal"
      tile
      class="text-center"
      height="100%"
      style="clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)"
      @click="to ? $router.push(to) : $emit('clicked')">
      <div
        class="d-flex justify-center align-center"
        style="height: 90%; container-type: inline-size">
        <div class="primary py-4">
          <v-icon color="accent" size="100cqw">
            {{ icon }}
          </v-icon>
          <div class="heading no-wrap" style="font-size: 13cqw">
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
  computed: {
    landscape() {
      return this.$vuetify.display.smAndUp;
    },
  },
};
</script>

<style scoped>
.pip {
  width: 17px;
  height: 17px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}
</style>
