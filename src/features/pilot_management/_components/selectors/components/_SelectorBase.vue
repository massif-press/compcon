<template>
  <v-row>
    <v-col cols="3">
      <div id="float" :class="success ? 'bordered-success' : 'bordered-primary'">
        <div>
          <cc-title x-small :color="success ? 'success' : 'primary'" block>{{ title }}</cc-title>
          <slot name="left-column" />
        </div>
      </div>
    </v-col>
    <v-col ref="content" cols="9">
      <div id="content-col" :class="modal ? 'fixed-window' : ''">
        <slot name="right-column" />
      </div>
    </v-col>
  </v-row>
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
