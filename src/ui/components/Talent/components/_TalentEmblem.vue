<template>
  <span>
    <v-img
      ref="img"
      :src="src"
      class="pa-2"
      :width="size"
      min-height="100%"
      contain
      :class="
        white ? 'white-emblem' : $vuetify.theme.current.dark ? 'white-emblem' : 'black-emblem'
      "
      @error="imageLoadFailed()" />
    <span
      v-if="backup"
      :class="`banner ${small ? 'overline' : 'caption'}`"
      :style="`width: ${size}`">
      {{ backup }}
    </span>
  </span>
</template>

<script lang="ts">
export default {
  name: 'talent-emblem',
  props: {
    url: { type: String, required: true },
    name: { type: String, required: true },
    small: { type: Boolean },
    large: { type: Boolean },
    white: { type: Boolean },
  },
  data: () => ({
    backup: '',
    src: '',
  }),
  computed: {
    size() {
      if (this.large) return '100px';
      if (this.small) return '50px';
      return '45px';
    },
  },
  mounted() {
    this.src = this.url;
  },
  methods: {
    imageLoadFailed() {
      this.src = '/src/assets/img/talent/GENERIC TALENT.svg';
      this.backup = this.name;
    },
    getImageLoc() {
      return new URL(this.src, import.meta.url).href;
    },
  },
};
</script>

<style scoped>
.white-emblem {
  filter: invert(100%);
}

.black-emblem {
  filter: invert(0%);
}

.banner {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
