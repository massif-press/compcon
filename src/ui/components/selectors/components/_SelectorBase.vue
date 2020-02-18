<template>
  <v-container fluid style="overflow: hidden">
    <v-row>
      <v-col cols="3" style="position: relative" class="pr-4">
        <div
          :style="`position: fixed; width: 23vw; transform: translateY(-${offsetTop}px)`"
          :class="success ? 'bordered-success' : 'bordered-primary'"
        >
          <div width="90%" class="ml-3">
            <cc-title small :color="success ? 'success' : 'primary'">{{ title }}</cc-title>
            <slot name="left-column" />
          </div>
        </div>
      </v-col>
      <v-col cols="9">
        <slot name="right-column" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'selector',

  props: {
    title: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: false,
      default: '90vh',
    },
    success: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    offsetTop: 0,
  }),
  mounted() {
    window.addEventListener(
      'scroll',
      () => {
        const scrollPos = window.scrollY
        this.offsetTop = scrollPos > 400 ? 400 : scrollPos
      },
      true
    )
  },
  beforeDestroy() {
    window.removeEventListener('scroll', null, false)
  },
})
</script>
