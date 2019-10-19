<template>
  <pl-card-base title="PILOT ARMOR" :extended="extended" />
</template>

<script lang="ts">
import Vue from 'vue'
import PlCardBase from './PLCardBase.vue'

export default Vue.extend({
  name: 'pl-pilot-armor-card',
  components: { PlCardBase },
  props: {
    extended: {
      type: Boolean,
      required: false,
    },
  },
})
</script>