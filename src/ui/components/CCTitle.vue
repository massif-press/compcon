<template>
  <div
    :class="block ? 'text-white' : `clipped${size} text-white`"
    :style="`width: ${
      block ? '100%' : 'max-content'
    };  background-color: rgb(var(--v-theme-${color}));`"
  >
    <div :class="`px-5 py-1 ctitle${size}`">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCTitle',
  props: {
    block: {
      type: Boolean,
    },
    large: {
      type: Boolean,
    },
    small: {
      type: Boolean,
    },
    xSmall: {
      type: Boolean,
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
      if (this.xSmall) return '-x-small';
      return this.large ? '-large' : this.small ? '-small' : '';
    },
  },
};
</script>

<style scoped>
.ctitle-x-small {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 14pt;
  line-height: 13pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

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
