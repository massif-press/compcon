<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'
import { CloudStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'oauth-store-interface',
  props: {
    code: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
  },
  created() {
    console.log(this.code, this.state)
    const cloudstore = getModule(CloudStore, this.$store)
    //cuse patreon API here to check against if they subscribe to patreon, based on this set true or false

    if (this.code && this.state) cloudstore.IsPatron = true
    this.$router.push('/')
  },
  mounted() {
    console.log(this.code, this.state)
  },
})
</script>
