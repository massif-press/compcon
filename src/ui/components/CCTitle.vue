<template>
  <div
    :class="`px-2 pt-2 pb-1 ml-n3 clipped${size} text-white`"
    :style="`width: max-content;  background-color: rgb(var(--v-theme-${color}));`"
  >
    <div :class="`pr-5 pb-1 pl-5 ctitle${size}`">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCTitle',
  props: {
    large: {
      type: Boolean,
      required: false,
    },
    small: {
      type: Boolean,
      required: false,
    },
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    size() {
      if (this.$vuetify.display.smAndDown) return '-small';
      return this.large ? '-large' : this.small ? '-small' : '';
    },
  },
};
</script>

<style scoped>
.ctitle-small {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 16pt;
  line-height: 15pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

.ctitle {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 30pt;
  line-height: 25pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

.ctitle-large {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 50pt;
  line-height: 38pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}
</style>
