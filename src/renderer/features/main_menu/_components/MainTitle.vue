<template>
  <div class="clipped px-2 pt-1">
    <span id="title">COMP/CON</span>
    <!-- Shout out Netlify on web for their free open source plan -->
    <a
      v-if="$platform === 'web'"
      href="https://www.netlify.com"
      style="position: relative; top: 1px; left: 5px;"
    >
      <img src="https://www.netlify.com/img/global/badges/netlify-light.svg" />
    </a>
    <br />
    <div id="subtitle">
      <span>A digital toolset for the LANCER TTRPG</span>
      <v-icon size="8pt" color="white" class="ml-2 mr-2">mdi-delta</v-icon>
      <span>v{{ version }} // LANCER CORE {{ lancerVersion }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cci-banner',
})
</script>

<style scoped>
.clipped {
  position: relative;
  background-color: var(--v-primary-base);
  width: 70%;
  clip-path: polygon(100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 0);
  opacity: 1;
  z-index: 2;
}

#title {
  font-family: 'Helvetica Bold', sans-serif;
  color: white;
  font-weight: 900;
  /* letter-spacing: 10px; */
  text-transform: uppercase;
  font-size: 50pt;
  line-height: 35pt;
}

#subtitle {
  font-family: 'Consolas', monospace;
  color: white;
  font-size: 12pt;
  padding-left: 8px;
  padding-bottom: 4px;
}
</style>
