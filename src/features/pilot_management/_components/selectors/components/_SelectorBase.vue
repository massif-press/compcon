<template>
  <v-layout>
    <div
      v-if="!flat"
      style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '322' : '352') : '0'}px; top: 6px`">
      <cc-button
        :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-if="!flat" v-model="showNav" class="mt-2 pr-4 py-2" width="350">
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
  <div
    :style="`position: fixed; bottom: ${mobile ? 24 : 35}px; left: ${mobile ? 4 : 20}px; right: ${floatSize}; z-index: 901; transition: right 0.2s ease`">
    <v-card flat tile class="px-2 py-1" border>
      <v-row :no-gutters="!expanded" align="center" justify="space-between">
        <v-col v-if="!expanded" cols="auto">
          <v-icon
            :color="success ? 'success' : 'error'"
            :icon="success ? 'mdi-check' : 'mdi-alert-box-outline'" />
        </v-col>
        <v-col v-if="expanded" cols="12" md="" class="text-center">
          <slot name="float" />
        </v-col>
        <v-col v-if="expanded" cols="12" md="" class="text-center">
          <slot name="jump" />
        </v-col>

        <v-col :cols="expanded ? 12 : 'auto'" md="auto" class="text-right">
          <v-btn
            size="x-small"
            @click="expanded = !expanded"
            :icon="!mobile || (mobile && !expanded)"
            :block="mobile && expanded"
            flat
            tile>
            <v-icon size="x-large">
              {{ expanded ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right' }}
            </v-icon>
            <span v-if="mobile && expanded">collapse</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
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
    flat: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    floating: false,
    expanded: false,
    listener: () => {},
    showNav: null,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    floatSize() {
      if (this.mobile) return this.expanded ? '4px' : 'calc(100vw - 78px)';
      return this.expanded ? '20px' : 'calc(100vw - 100px)';
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
