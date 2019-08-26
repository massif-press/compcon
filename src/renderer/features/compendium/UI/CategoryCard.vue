<template>
  <v-flex grow>
    <v-hover v-slot:default="{ hover }">
      <v-card
        id="underline-parent"
        :class="`clipped-x-large ${hover ? 'on-hover' : ''}`"
        :to="loc"
        height="10em"
        :color="color"
        tile
        outlined
      >
        <v-icon size="100" class="pa-0 ma-0" style="position: absolute; bottom: -5px; left: 0" dark>
          {{ icon }}
        </v-icon>
        <v-card-actions
          id="card-actions"
          class="text-right"
          :style="
            `display: inline-block; position: absolute; width: 100%; top: 0; left: 0; color: black; background: white`
          "
        >
          <span
            style="position:absolute; top: 0; right: 0; display: contents; font-size: 22pt"
            class="underline-slide px-4 heading h2"
          >
            {{ name }}
          </span>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'category-card',
  props: {
    icon: String,
    color: String,
    name: String,
    loc: String,
    size: Number,
  },
})
</script>

<style scoped>
.v-card {
  filter: brightness(120%);
  transition: all 0.3s ease-in-out;
}

.v-card > .v-icon {
  opacity: 0.7;
  transition: opacity 0.3s ease-in-out;
}

.v-card:hover > .v-icon {
  opacity: 1;
}

.v-card:not(.on-hover) {
  filter: brightness(100%);
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 5px;
  z-index: 100;
  background-color: black;
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

#underline-parent:hover > #card-actions > .underline-slide::before {
  transform-origin: bottom right;
  transform: scaleX(1);
}
</style>
