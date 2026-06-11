<template>
  <v-container>
    <div class="heading mech" style="line-height: 30px">{{ a.title }}</div>
    <div class="text-caption ml-1 my-2">
      {{ a.ccVersion }}
      <b class="text-accent">{{ $appVersion }}</b>
      <cc-slashes class="pl-1" />
      {{ a.lancerCoreVersion }}
      <b class="text-accent">{{ $lancerVersion }}</b>
    </div>
    <v-row dense align="center" justify="center" class="my-2">
      <v-col cols="auto">
        <a href="https://app.netlify.com/sites/compcon/deploys">
          <img
            alt="Netlify Status"
            src="https://api.netlify.com/api/v1/badges/8c8ba126-8074-4a99-98f9-9b0529107214/deploy-status" />
        </a>
      </v-col>
      <v-col cols="auto">
        <a href="https://discord.gg/rwcpzsU">
          <img
            src="https://img.shields.io/badge/discord-%23compcon-7289DA?logo=discord&logoColor=white"
            alt="Join the LANCER discord" />
        </a>
      </v-col>
    </v-row>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="auto">
        <a href="https://patreon.com/compcon">
          <img
            src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dcompcon%26type%3Dpatrons&style=for-the-badge"
            alt="Support COMP/CON on Patreon" />
        </a>
      </v-col>
    </v-row>

    <div class="d-flex justify-center align-center my-6" style="width: 100%">
      <p style="max-width: 80vw; text-align: center">
        {{ a.description }}
        <br />
        <br />
        {{ a.coreBookInfo }}
        <a target="_blank" href="http://www.massifpress.com">massifpress.com</a>
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

const a = section('about')
</script>
