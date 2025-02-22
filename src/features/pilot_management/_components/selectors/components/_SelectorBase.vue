<template>
  <v-layout>
    <div
      style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '322' : '352') : '0'}px; top: 6px`">
      <cc-button
        :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav" class="mt-2 pr-4 py-2" width="350">
      <div id="float" :class="success ? 'bordered-success' : 'bordered-primary'">
        <div>
          <cc-title x-small :color="success ? 'success' : 'primary'" block>{{ title }}</cc-title>
          <slot name="left-column" />
        </div>
      </div>
    </v-navigation-drawer>
    <v-main ref="content" class="py-2">
      <div id="content" :class="modal ? 'fixed-window' : ''">
        <div class="mx-auto" :class="!mobile && 'px-12'" style="max-width: 1400px">
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  created() {
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
