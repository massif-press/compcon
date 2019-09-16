<template>
  <div
    :class="`px-2 ml-n3 clipped${size()}`"
    :style="`width: max-content; background-color: ${getColor()};`"
  >
    <span :class="`ctitle${size()} ${dark ? 'white--text' : 'black--text'}`" class="pl-5 pr-5 pb-1">
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-title',
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
  methods: {
    size() {
      return this.large ? '-large' : this.small ? '-small' : ''
    },
  },
})
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
