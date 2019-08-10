<template>
  <div :class="`px-2 clipped-${size()}`">
    <span :class="`title-${size()} white--text`" class="px-2 pb-1">
      <slot></slot>&nbsp;
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
  },
  methods: {
    size() {
      return this.large ? 'large' : this.small ? 'small' : 'reg'
    },
  },
})
</script>

<style scoped>
.clipped-small {
  width: max-content;
  background-color: var(--v-primary-base);
}

.clipped-reg {
  width: max-content;
  background-color: var(--v-primary-base);
  clip-path: polygon(100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 0);
}

.clipped-large {
  width: max-content;
  background-color: var(--v-primary-base);
  clip-path: polygon(100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 0);
}

.title-small {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 16pt;
  line-height: 15pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

.title-reg {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 30pt;
  line-height: 25pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}

.title-large {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 50pt;
  line-height: 38pt;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
}
</style>
