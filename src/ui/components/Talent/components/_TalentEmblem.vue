<template>
  <div>
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
    <div v-if="backup" :class="`banner text-cc-overline`">
      {{ backup }}
    </div>
  </div>
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
      return 'calc(30px + 1vw)';
    },
  },
  created() {
    this.src = this.url;
  },
  methods: {
    imageLoadFailed() {
      this.src = '/public/talent/GENERIC TALENT.svg';
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
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 0;
  width: 100%;
  font-size: 10px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
