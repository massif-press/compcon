<template>
  <div>
    <info-view v-show="page === '0'" key="v0" :pilot="pilot" />
    <narrative-view v-show="page === '1'" key="v1" :pilot="pilot" />
    <tactical-view v-show="page === '2'" key="v2" :pilot="pilot" />
    <mech-hangar-view v-show="page === '3'" key="v3" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NarrativeView from '../sections/narrative/index.vue'
import InfoView from '../sections/info/index.vue'
import TacticalView from '../sections/tactical/index.vue'
import MechHangarView from '../sections/hangar/index.vue'

export default Vue.extend({
  name: 'tabbed',
  components: { NarrativeView, InfoView, TacticalView, MechHangarView },
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
