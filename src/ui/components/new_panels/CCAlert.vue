<template>
  <v-card
    :style="closed && 'display:none'"
    class="parent cc-panel-clip border-s-xl"
    :color="color"
    flat
    tile>
    <v-row no-gutters>
      <v-col cols="auto" v-if="icon && prominent && !mobile">
        <v-icon size="60" class="mt-2 ml-1 mr-n2">{{ icon }}</v-icon>
      </v-col>
      <v-col>
        <div v-if="title" class="heading h3 px-4 pt-2">
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
        <v-card-text class="py-2">
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
  },
  data: () => ({
    closed: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.cc-panel-clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%);
}
</style>
