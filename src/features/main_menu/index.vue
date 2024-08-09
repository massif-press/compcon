<template>
  <div>
    <landing-page-mobile v-if="$vuetify.breakpoint.smAndDown" />
    <landing-page-desktop v-else />
    <welcome-message />
    <router-view />
    <v-dialog v-model="showStorageWarning" width="50vw">
      <v-toolbar dense color="error"><v-toolbar-title>Storage Limit Warning</v-toolbar-title></v-toolbar>
      <v-card>
        <v-card-text class="pt-4">
          You have used {{ storage.toFixed(2) }} KB of your 5 MB storage limit. This is likely due to many installed LCPs. COMP/CON will not function correctly if you exceed this limit, please remove some LCPs to free up space.<br><br>
          This limit will be completely removed in the forthcoming COMP/CON v3 update. You can track the progress of this version on the <a href="https://www.patreon.com/compcon" target="_blank">COMP/CON Dev Blog</a>. 
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="showStorageWarning = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LandingPageMobile from './mobile.vue'
import LandingPageDesktop from './desktop.vue'
import WelcomeMessage from './welcome.vue'

export default Vue.extend({
  name: 'landing-page',
  components: {
    LandingPageMobile,
    LandingPageDesktop,
    WelcomeMessage,
  },
  data: () => ({
    storage: 0,
    showStorageWarning: false,
  }),
  created() {
    this.storage = new Blob(Object.values(localStorage)).size / 1024;
    const usage = this.storage / (5 * 1024);
    console.info(`CC LOCALSTORAGE USAGE: ${this.storage.toFixed(2)} KB of 5MB (${(this.storage / (5 * 1024)).toFixed(2)}%)`);
    if (usage > 0.9) {
      this.showStorageWarning = true
    }
  },
  
})
</script>
