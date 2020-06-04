<template>
  <v-col cols="6">
    <v-card
      :ripple="!disabled"
      outlined
      tile
      class="text-center"
      @click="to ? $router.push(to) : $emit('clicked')"
    >
      <div :class="disabled ? 'grey py-4' : 'primary fade py-4'">
        <v-icon dark size="125">
          {{ icon }}
        </v-icon>
      </div>
      <h2 v-resize-text="{ minFontSize: '18px' }" class="heading mt-1 no-wrap">
        {{ title }}
      </h2>
      <v-divider class="my-1" />
      <span v-resize-text class="flavor-text px-2 no-wrap">
        {{ text }}
      </span>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'mobile-btn',
  props: {
    to: { type: String, required: false, default: '' },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    text: { type: String, required: true },
    disabled: { type: Boolean },
    loading: { type: Boolean },
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
