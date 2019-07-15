<template>
  <div class="recharge d-flex align-center justify-content-end ">
    <div @click.stop>
      <v-checkbox color="secondary" :value="charged" @click.stop="charged = !charged" />
    </div>
    <div class="mx-1 caption">{{ charged ? 'Charged' : 'Charging' }} ({{ value }}+)</div>
    <v-icon color="primary">mdi-history</v-icon>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'recharge',
  data: () => ({
    charged: false,
  }),
  props: {
    value: { type: Number, required: true },
    digital: { type: Boolean, default: true },
  },
  mounted() {
    this.charged = this.digital
  },
})
</script>

<style scoped>
.recharge {
  height: 24px;
  font-weight: bold;
}
/*
.failed {
  animation-name: shake-rotate;
  animation-duration: 500ms;
  animation-timing-function: ease-in;
}
@keyframes shake-rotate {
  0% {
    color: red;
    transform: rotate(-30deg);
  }
  25% {
    transform: rotate(30deg);
  }
  50% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
  100% {
    color: inherit;
  }
}
.last {
  position: relative;
  right: 15px;
  opacity: 0;
  pointer-events: none;
}
.last.floating {
  animation-name: resultfloat;
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}
@keyframes resultfloat {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-2em);
  }
} */
</style>
