<template>
  <cc-major-btn icon="cci-pilot" name="Create New Pilot" @clicked="$router.push('new')" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'new-pilot-button',
})
</script>
