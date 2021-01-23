<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'
// import { handleOAuthRedirectRequest } from './patreon'
import axios from 'axios'
import { UserStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'oauth-store-interface',
  async created() {
    console.log(this.$route)
    // const userstore = getModule(UserStore, this.$store)
    const { code, state } = this.$route.query
    if (!code || !state) {
      this.$router.push('/')
      return
    }
    // handleOAuthRedirectRequest(code, { end: fn => console.log(fn) })
    // const token = await Patreon.getUserToken(code, state).then(res => res.data)
    // userstore.setPatreonToken(token)
    // console.log(token)
    // const data = await Patreon.getUserCampaigns(token.access_token).then(res => res.data)
    // console.log(data)

    //cuse patreon API here to check against if they subscribe to patreon, based on this set true or false

    // if (this.code && this.state) userstore.IsPatron = true
    this.$router.push('/')
  },
})
</script>
