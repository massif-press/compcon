<template>
  <v-toolbar
    flat
    density="compact"
    :color="color"
    class="ma-0 pa-0"
    :class="mobile ? 'parent-mobile' : 'parent'">
    <v-row no-gutters align="center" class="mx-2" :class="mobile && 'mt-n3'" style="height: 100%">
      <v-col cols="auto">
        <v-icon v-if="icon" :icon="icon" start />
      </v-col>
      <v-col cols="auto">
        <span class="heading h3">
          <span v-text="title" />
        </span>
      </v-col>
      <v-spacer />
      <v-divider
        v-if="$slots['toolbar-items'] && !mobile && !extended"
        vertical
        class="mx-6"
        style="transform: skew(-45deg); opacity: 1 !important" />
      <v-col cols="auto">
        <v-toolbar-items>
          <slot name="toolbar-items" />
        </v-toolbar-items>
      </v-col>
      <v-divider
        v-if="!mobile && !extended"
        vertical
        class="mx-6"
        style="transform: skew(-45deg); opacity: 1 !important" />
      <v-col cols="auto">
        <v-btn @click="$emit('close')" tile size="small" icon variant="text" class="fade-select">
          <v-icon :size="mobile ? 30 : 40">mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: 'primary' },
    title: { type: String, default: '' },
    icon: { type: String },
    extended: { type: Boolean, default: false },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}

.parent-mobile:deep(.v-toolbar__content) {
  max-height: 28px;
}
</style>
