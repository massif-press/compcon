<template>
  <div>
    <div
      style="position: absolute; z-index: 2; height: 43px; left: 0; right: 0; top: 0; bottom: 20px; background-color: var(--v-primary-base); text-align: right"
    >
      <update-checker class="mt-2 mr-2" @mouseenter="$emit('logupdate')" />
      <v-btn
        v-extlink="'https://github.com/massif-press/compcon/blob/master/CHANGELOG.md'"
        dark
        outlined
        small
        class="mt-2 mr-2"
        @mouseenter="$emit('logupdate')"
      >
        <v-icon left small>
          mdi-information-outline
        </v-icon>
        View Changelog
      </v-btn>
    </div>
    <div class="clipped px-2 pt-1">
      <span id="title">COMP/CON</span>
      <!-- Shout out Netlify on web for their free open source plan -->
      <a
        v-if="$platform === 'web'"
        href="https://www.netlify.com"
        style="position: relative; top: 1px; left: 5px;"
        class="fadeSelect"
      >
        <img src="https://www.netlify.com/img/global/badges/netlify-light.svg" />
      </a>
      <br />
      <div id="subtitle">
        <span>VERSION: {{ $appVersion }} // LANCER CORE {{ $lancerVersion }}</span>
      </div>
    </div>
    <div
      class="hover-parent"
      style="position: absolute; left: calc(70% - 40px); top: 50px; display:inline-flex; z-index: 3"
    >
      <div
        style="width: 40px; height: 40px; background-color: var(--v-primary-base); clip-path: polygon(100% 0, 0% 100%, 100% 100%)"
      />
      <div
        class="hover-expand"
        style="width: 10px; height: 40px; background-color: var(--v-primary-base); margin-left: -1px"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UpdateChecker from './UpdateChecker.vue'

export default Vue.extend({
  name: 'cci-banner',
  components: { UpdateChecker }
})
</script>

<style scoped>
.clipped {
  position: relative;
  background-color: var(--v-primary-base);
  width: 70%;
  clip-path: polygon(100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 0);
  -webkit-clip-path: polygon(100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 0);
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

/* TODO: access point for CC-CLI */

/* .hover-expand {
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.8s;
}

.hover-parent:hover .hover-expand {
  width: 200px !important;
} */
</style>
