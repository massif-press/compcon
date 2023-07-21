<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <div :class="`mb-2 ${clickable ? 'clickable' : ''}`" v-bind="props" @click="$emit('click')">
        <v-toolbar
          :color="clickable && isHovering ? 'active' : color ? color : 'primary'"
          density="compact"
          :class="`${density === `compact` ? 'clipped-invert' : 'clipped-large-invert'}}`"
        >
          <v-toolbar-title>
            <v-row dense align="center">
              <v-col cols="auto">
                <v-icon
                  v-if="icon"
                  :icon="clickable && isHovering ? 'mdi-chevron-double-right' : icon"
                />
              </v-col>
              <v-col cols="auto" class="heading h3 text-truncate" style="width: 80%">
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
          rounded="0"
          variant="outlined"
          :style="`background-color: rgb(var(--v-theme-background)); border-color: ${
            color ? color : 'rgb(var(--v-theme-primary))'
          } !important; `"
        >
          <v-card-text>
            <slot />
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'CCTitledPanel',
  emits: ['click'],
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
