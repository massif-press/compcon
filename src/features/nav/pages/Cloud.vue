<template>
  <signed-in />
</template>

<script lang="ts">
import Vue from 'vue'
import SignedIn from '../../main_menu/_components/login/SignedIn.vue'

export default Vue.extend({
  name: 'navbar-cloud-dialog',
  components: { SignedIn },
})
</script>
