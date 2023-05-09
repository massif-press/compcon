<template>
  <div id="panel-wrapper" :class="`mb-2 ${clickable ? 'clickable' : ''}`" @click="$emit('click')">
    <v-toolbar
      :color="color ? color : 'primary'"
      density="compact"
      :class="`${density === `compact` ? 'clipped-invert' : 'clipped-large-invert'}`"
    >
      <v-toolbar-title>
        <v-row dense align="center">
          <v-col cols="auto">
            <v-icon v-if="icon" :icon="icon" />
          </v-col>
          <v-col cols="auto" :class="`heading h3`">
            {{ title }}
          </v-col>
        </v-row>
      </v-toolbar-title>
      <v-spacer v-if="$slots.items" />
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
</style>
