<template>
  <v-toolbar
    :color="color"
    :class="{ 'clipped-large': clipped }"
    :style="fixed ? 'position: fixed; width: 100%; z-index:99' : ''"
    :density="<any>density">
    <v-row
      align="center"
      :class="`heading ${$vuetify.display.mdAndDown ? 'h3' : 'h2'} px-2`"
      style="text-transform: uppercase">
      <v-col cols="auto">
        <v-icon v-if="icon" size="50" :icon="icon" />
      </v-col>
      <v-col cols="auto">
        <slot name="title" />
      </v-col>
      <v-col cols="auto">
        <slot name="title-chips" />
      </v-col>
      <v-spacer />
      <v-col cols="auto" class="mr-5">
        <slot name="title-items" />
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
export default {
  name: 'CCTitlebar',
  props: {
    fixed: {
      type: Boolean,
      required: false,
    },
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    clipped: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    large: {
      type: Boolean,
      required: false,
    },
    density: {
      type: String,
      required: false,
      default: 'default',
    },
  },
};
</script>
