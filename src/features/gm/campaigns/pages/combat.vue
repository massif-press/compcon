<template>
  <page-base :item="item">
    {{ item }}
    {{ typeof item }}
  </page-base>
</template>

<script lang="ts">
import Vue from 'vue'
import PageBase from './_components.vue/PageBase.vue'

export default Vue.extend({
  name: 'campaign-beat-page',
  components: { PageBase },
  props: {
    item: { type: Object, required: true },
  },
})
</script>
