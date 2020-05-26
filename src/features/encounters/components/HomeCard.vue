<template>
  <v-card ripple :to="to" outlined tile class="text-center">
    <div class="primary fade pt-10 pb-10">
      <v-icon dark size="180">
        {{ icon }}
      </v-icon>
    </div>
    <h2 class="heading mt-1">
      {{ title }}
    </h2>
    <v-divider class="my-2" />
    <p class="flavor-text px-2" style="min-height: 50px">
      {{ text }}
    </p>
  </v-card>
</template>

<script>
export default {
  name: 'home-card',
  props: {
    to: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    text: { type: String, required: true },
  },
}
</script>

<style scoped>
.fade {
  transition: all ease-in-out 0.2s;
}

.fade:hover {
  background-color: var(--v-active-base) !important;
}
</style>
