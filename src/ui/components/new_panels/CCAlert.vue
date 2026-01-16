<template>
  <v-card
    :style="[
      closed && 'display:none',
      `border-color: rgb(var(--v-theme-${borderColor || color}))!important`,
      `border-left: 8px solid rgb(var(--v-theme-${borderColor || color})`,
    ]"
    style="corner-shape: bevel; border-radius: 0; border-bottom-right-radius: 24px"
    :color="color"
    flat>
    <v-row no-gutters>
      <v-col cols="auto" v-if="icon && prominent && !mobile">
        <v-icon size="60" class="mt-2 ml-2" :color="iconColor">{{ icon }}</v-icon>
      </v-col>
      <v-col>
        <div v-if="title" class="heading h3 px-4">
          <v-row dense align="center">
            <v-col cols="auto" v-if="icon && (!prominent || mobile)">
              <v-icon :icon="icon" />
            </v-col>
            <v-col cols="auto">
              <slot name="title">
                {{ title }}
              </slot>
            </v-col>
          </v-row>
          <v-divider class="mt-1" />
        </div>
        <v-card-text :class="compact ? 'py-1' : 'py-2'">
          <slot>Default Content</slot>
        </v-card-text>
      </v-col>
      <v-col v-if="closeable" cols="auto">
        <v-btn size="x-small" icon="mdi-close" variant="text" @click.stop="closed = true" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'cc-panel',
  props: {
    color: {
      type: String,
      default: 'panel',
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    prominent: {
      type: Boolean,
      default: false,
    },
    closeable: {
      type: Boolean,
    },
    iconColor: {
      type: String,
      default: '',
    },
    density: {
      type: String,
      default: '',
    },
    borderColor: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    closed: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    compact() {
      return this.density === 'compact';
    },
  },
};
</script>
