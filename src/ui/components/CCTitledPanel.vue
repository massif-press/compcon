<template>
  <div id="panel-wrapper" :class="`mb-2 ${clickable ? 'clickable' : ''}`" @click="$emit('click')">
    <v-toolbar
      :color="color ? color : 'primary'"
      dark
      flat
      dense
      :class="`${dense ? 'clipped-invert' : 'clipped-large-invert'} ${clickable ? 'titlebar' : ''}`"
      :style="dense ? 'height: 28px' : ''"
    >
      <v-toolbar-title :class="dense ? 'mt-n6' : ''">
        <v-icon v-if="icon" :x-large="!dense" left>{{ icon }}</v-icon>
        <span :class="`heading h3 pr-3 ${clickable ? 'underline-slide' : ''}`">{{ title }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="mr-4">
        <slot name="items" />
      </v-toolbar-items>
    </v-toolbar>

    <v-card
      flat
      outlined
      :style="
        `border-color: ${color ? color : 'var(--v-primary-base)'} !important; margin-top: -2px`
      "
    >
      <v-card-text class="pt-2 pb-0 px-4">
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-titled-panel',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    color: {
      type: String,
      required: false,
      default: '',
    },
    clickable: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
  },
})
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}

.titlebar {
  filter: brightness(100%);
  transition: all 0.3s ease-in-out;
}

#panel-wrapper:hover .titlebar {
  filter: brightness(120%);
}

#panel-wrapper .v-icon {
  opacity: 0.7;
  transition: opacity 0.3s ease-in-out;
}

#panel-wrapper:hover .v-icon {
  opacity: 1;
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 5px;
  z-index: 100;
  background-color: white;
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

#panel-wrapper:hover .underline-slide::before {
  transform-origin: bottom right;
  transform: scaleX(1);
}
</style>
