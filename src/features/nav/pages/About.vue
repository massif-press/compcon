<template>
  <div :class="`mt-2 ${$vuetify.breakpoint.mdAndDown ? 'text-center' : ''}`">
    <p class="heading mech mt-2">COMP/CON</p>
    <div class="mx-2">
      C/C version:
      <b class="accent--text">{{ $appVersion }}</b>
      // LANCER CORE version:
      <b class="accent--text">{{ $lancerVersion }}</b>
    </div>
    <p align="center" class="my-2">
      <a href="https://app.netlify.com/sites/compcon/deploys">
        <img
          alt="Netlify Status"
          src="https://api.netlify.com/api/v1/badges/8c8ba126-8074-4a99-98f9-9b0529107214/deploy-status"
        />
      </a>
      <a href="https://discord.gg/rwcpzsU">
        <img
          src="https://img.shields.io/badge/discord-%23compcon-7289DA?logo=discord&logoColor=white"
          alt="Join the LANCER discord"
        />
      </a>
      <br />
      <a href="https://patreon.com/compcon">
        <img
          src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dcompcon%26type%3Dpatrons&style=for-the-badge"
          alt="Support COMP/CON on Patreon"
        />
      </a>
    </p>
    <v-divider class="mr-10 my-2" />
    <p class="body-text text-center">
      COMP/CON is a free, open-source digital toolkit and gameplay assistant for building and
      playing LANCER TTRPG games. The LANCER CORE Book, COMP/CON, and associated downloads and
      expansions can be found at
      <a target="_blank" href="http://www.massifpress.com">massifpress.com</a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'about',
})
</script>