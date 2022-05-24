<template>
  <div>
    <info-view v-show="page === '0'" key="v0" :pilot="pilot" />
    <tactical-view v-show="page === '1'" key="v1" :pilot="pilot" />
    <bonds-view v-show="page === '4'" key="v4" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InfoView from '../sections/info/index.vue'
import TacticalView from '../sections/tactical/index.vue'
import BondsView from '../sections/bonds/index.vue'

export default Vue.extend({
  name: 'tabbed',
  components: { InfoView, TacticalView, BondsView },
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
    page(oldPage, newPage) {
      this.$vuetify.goTo(0, {
        duration: 0,
      })
    },
    mounted() {
      this.$vuetify.goTo(0, {
        duration: 0,
      })
    },
  },
})
</script>
