<template>
  <div style="position: relative">
    <v-img
      ref="img"
      :src="src"
      class="pa-2"
      :width="size"
      min-height="100%"
      contain
      :class="white ? 'white-emblem' : $vuetify.theme.dark ? 'white-emblem' : 'black-emblem'"
      @error="imageLoadFailed()"
    />
    <div
      v-if="backup"
      :class="`banner ${small ? 'overline' : 'caption'}`"
      :style="`width: ${size}`"
    >
      {{ backup }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "talent-emblem",
  props: {
    url: { type: String, required: true },
    name: { type: String, required: true },
    small: { type: Boolean },
    large: { type: Boolean },
    white: { type: Boolean },
  },
  data: () => ({
    backup: "",
    src: "",
  }),
  computed: {
    size() {
      if (this.large) return "100px";
      if (this.small) return "50px";
      return "45px";
    },
  },
  mounted() {
    this.src = this.url;
  },
  methods: {
    imageLoadFailed() {
      this.src = "/assets/img/talent/GENERIC TALENT.svg";
      this.backup = this.name;
    },
  },
});
</script>

<style scoped>
.white-emblem {
  filter: invert(100%);
}

.black-emblem {
  filter: invert(0%);
}

.banner {
  background-color: var(--v-primary-base);
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
