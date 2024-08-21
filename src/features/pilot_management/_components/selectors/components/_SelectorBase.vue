<template>
  <v-layout>
    <v-btn
      icon
      size="25"
      border
      :variant="showNav ? 'tonal' : 'elevated'"
      color="primary"
      :style="`position: absolute; z-index: 999; left: ${showNav ? '352' : '3'}px; top: 12px`"
      @click="(showNav as any) = !showNav">
      <v-icon size="24" :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'" />
    </v-btn>
    <v-navigation-drawer v-model="showNav" class="mt-2 pa-2" width="350">
      <div id="float" :class="success ? 'bordered-success' : 'bordered-primary'">
        <div>
          <cc-title x-small :color="success ? 'success' : 'primary'" block>{{ title }}</cc-title>
          <slot name="left-column" />
        </div>
      </div>
    </v-navigation-drawer>
    <v-main ref="content" class="py-2">
      <div id="content" :class="modal ? 'fixed-window' : ''">
        <div class="px-12 mx-auto" style="max-width: 1400px">
          <slot name="right-column" />
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
function handleScroll() {
  const e = document.getElementById('float');
  if (!e) return;

  if (window.scrollY >= 400) {
    e.classList.add('fixed-float');
  } else {
    e.classList.remove('fixed-float');
  }
}

export default {
  name: 'selector',

  props: {
    title: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: false,
    },
    modal: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    floating: false,
    listener: () => {},
    showNav: null,
  }),
  mounted() {
    window.addEventListener('scroll', handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', handleScroll);
  },
};
</script>

<style scoped>
.fixed-float {
  position: fixed;
  top: 60px;
  max-width: 20vw;
}

.fixed-window {
  max-height: calc(100vh - 125px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 16px;
}
</style>
