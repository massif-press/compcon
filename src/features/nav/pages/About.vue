<template>
  <div :class="`${$vuetify.display.mdAndDown ? 'text-center' : ''}`">
    <div class="heading mech">COMP/CON</div>
    <div class="text-overline mt-n4 ml-1">
      C/C version:
      <b class="text-accent">{{ $appVersion }}</b>
      // LANCER CORE version:
      <b class="text-accent">{{ $lancerVersion }}</b>
    </div>
    <div align="center" class="my-2">
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
    </div>
    <v-row align="center" justify="center">
      <v-col xl="8" cols="11">
        <p class="body-text text-center">
          COMP/CON is a free, open-source digital toolkit and gameplay assistant
          for building and playing LANCER TTRPG games. The LANCER CORE Book,
          COMP/CON, and associated downloads and expansions can be found at
          <a target="_blank" href="http://www.massifpress.com"
            >massifpress.com</a
          >
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'about',
};
</script>
