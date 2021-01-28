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
      <a target="_blank" href="http://www.massifpress.com">
        massifpress.com
      </a>
    </p>
    <br />
    <div v-if="loading" class="text-center">
      <v-progress-circular :size="80" :width="5" color="primary" indeterminate />
    </div>
    <div v-else>
      <div class="heading h2 accent--text text-center mt-n1">LANCER by:</div>
      <v-row justify="center">
        <dev-badge v-for="c in credits.writers" :key="c.name" :info="c" big />
      </v-row>
      <div class="heading h2 accent--text text-center mt-2">COMP/CON Development by:</div>
      <v-row dense>
        <dev-badge v-for="c in credits.lead_devs" :key="c.name" :info="c" big />
      </v-row>
      <v-row dense>
        <dev-badge v-for="c in credits.devs" :key="c.name" :info="c" />
      </v-row>
      <v-divider class="my-3" />
      <span class="heading h3 text--text text-center mt-4">
        COMP/CON is supported by the generous
        <a target="_blank" href="https://www.patreon.com/compcon" v-html="'contributions'" />
        of:
      </span>
      <v-row>
        <tier-five v-for="c in credits.t5" :key="c.name" :info="c" />
      </v-row>
      <v-row dense>
        <tier-four v-for="c in credits.t4" :key="c.name" :info="c" />
      </v-row>
      <v-row dense>
        <tier-three v-for="c in credits.t3" :key="c" :name="c" />
      </v-row>
      <v-row dense>
        <tier-two v-for="c in credits.t2" :key="c" :name="c" />
      </v-row>
      <v-row dense>
        <tier-one v-for="c in credits.t1" :key="c" :name="c" />
      </v-row>
      <span class="heading h2 text--text mt-4">Special Thanks to:</span>
      <div class="my-2">
        <special-thanks v-for="c in credits.special_thanks" :key="c" :name="c" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import credits from './credits.json'
import DevBadge from './SupporterBadges/Dev.vue'
import TierFive from './SupporterBadges/TierFive.vue'
import TierFour from './SupporterBadges/TierFour.vue'
import TierThree from './SupporterBadges/TierThree.vue'
import TierTwo from './SupporterBadges/TierTwo.vue'
import TierOne from './SupporterBadges/TierOne.vue'
import SpecialThanks from './SupporterBadges/SpecialThanks.vue'

export default Vue.extend({
  name: 'about',
  components: { DevBadge, TierFive, TierFour, TierThree, TierTwo, TierOne, SpecialThanks },
  data: () => ({
    creditsUrl: 'https://compcon-text-assets.s3.amazonaws.com/credits.json',
    credits: credits,
    loading: true,
  }),
  mounted() {
    fetch(this.creditsUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then(res => res.json())
      .then(content => {
        this.credits = content
      })
      .catch(err => {
        console.error('There was an issue downloading the latest welcome message.', err)
      })
      .finally(() => (this.loading = false))
  },
})
</script>

<style scoped></style>
