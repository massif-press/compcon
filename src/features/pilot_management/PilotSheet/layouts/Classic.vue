<template>
  <div>
    <info-view id="section-0" :pilot="pilot" />
    <tactical-view id="section-1" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InfoView from '../sections/info/index.vue'
import TacticalView from '../sections/tactical/index.vue'

export default Vue.extend({
  name: 'classic',
  components: { InfoView, TacticalView },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  watch: {
    page(newPage) {
      this.$vuetify.goTo(`#section-${newPage}`, {
        duration: 15,
        easing: 'easeInOutCubic',
        offset: 10,
      })
    },
  },
  mounted() {
    this.$vuetify.goTo(0, {
      duration: 0,
    })
  },
})
</script>
