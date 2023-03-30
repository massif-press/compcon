<template>
  <div
    id="panel-wrapper"
    :class="`mb-2 ${clickable ? 'clickable' : ''}`"
    @click="$emit('click')"
  >
    <v-toolbar
      :color="color ? color : 'primary'"
      flat
      density="compact"
      dark
      :class="`${
        density === `compact` ? 'clipped-invert' : 'clipped-large-invert'
      } ${clickable ? 'titlebar' : ''}`"
      :style="density === `compact` ? 'height: 28px' : ''"
    >
      <v-toolbar-title :class="density === `compact` ? 'mt-n6' : ''">
        <v-icon v-if="icon" :x-large="density !== `compact`" left>{{
          icon
        }}</v-icon>
        <span :class="`heading h3 pr-3 ${clickable ? 'underline-slide' : ''}`">
          {{ title }}
        </span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="mr-4">
        <slot name="items" />
      </v-toolbar-items>
    </v-toolbar>

    <v-card
      flat
      variant="outlined"
      :style="`background-color: rgb(var(--v-theme-background)); border-color: ${
        color ? color : 'rgb(var(--v-theme-primary))'
      } !important; margin-top: -2px`"
    >
      <v-card-text class="pt-2 pb-0 px-4">
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCTitledPanel',
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
      required: false,
    },
    density: {
      type: String,
      required: false,
    },
  },
};
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
