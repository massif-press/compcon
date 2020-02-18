<template>
  <v-container fluid style="overflow: hidden">
    <v-row>
      <v-col cols="3" class="pr-4">
        <div
          ref="float"
          style="width: 23vw"
          :class="
            `${floating ? 'fixed-float' : ''} ${success ? 'bordered-success' : 'bordered-primary'}`
          "
        >
          <div width="90%" class="ml-3">
            <cc-title small :color="success ? 'success' : 'primary'">{{ title }}</cc-title>
            <slot name="left-column" />
          </div>
        </div>
      </v-col>
      <v-col ref="content" cols="9">
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
    floating: false,
  }),
  mounted() {
    this.floating = false
    window.addEventListener(
      'scroll',
      () => {
        if (!this.$refs.float || !this.$refs.content) return
        const floatY = this.$refs['float'].getBoundingClientRect().top
        const containerY = this.$refs['content'].getBoundingClientRect().top
        if (floatY && floatY <= 30) this.floating = true
        else if (floatY < containerY) this.floating = false
      },
      true
    )
  },
  beforeDestroy() {
    this.floating = false
    window.removeEventListener('scroll', null, false)
  },
})
</script>

<style scoped>
.fixed-float {
  position: fixed;
  top: 60px;
}
</style>
