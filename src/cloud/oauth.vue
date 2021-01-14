<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'
import Patreon from './patreon'
import axios from 'axios'
import { CloudStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'oauth-store-interface',
  async created() {
    console.log(this.$route)
    const cloudstore = getModule(CloudStore, this.$store)
    // ?code=k0eClWmn1nXgaK3Z52Noo4KOsPGdsp&state=chill
    const { code, state } = this.$route.query
    if (!code || !state) {
      this.$router.push('/')
      return
    }
    const token = await Patreon.getUserToken(code, state).then(res => res.data)
    cloudstore.setPatreonToken(token)
    console.log(token)
    const data = await Patreon.getUserCampaigns(token.access_token).then(res => res.data)
    console.log(data)

    //cuse patreon API here to check against if they subscribe to patreon, based on this set true or false

    // if (this.code && this.state) cloudstore.IsPatron = true
    this.$router.push('/')
  },
  mounted() {
    console.log(this.$route.query)
  },
})
</script>
