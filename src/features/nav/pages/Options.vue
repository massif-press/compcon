<template>
  <div>
    <h3 class="heading primary--text">User Options</h3>
    <v-row dense>
      <v-col cols="8" class="mr-3">
        <div class="flavor-text">
          <b>USER ID:</b>
          <span class="primary--text">{{ userID }}</span>
        </div>
        <v-divider />
        <div class="mx-12">
          <v-btn outlined block color="secondary" class="my-1">Import All COMP/CON Data</v-btn>
          <v-btn outlined block color="secondary" class="my-1">Export All COMP/CON Data</v-btn>
          <v-btn outlined block color="secondary" class="my-1">Export Old COMP/CON v1.x Data</v-btn>
          <v-divider class="my-3" />
          <v-btn small block color="error" class="my-1">
            <v-icon left v-html="'mdi-alert'" />
            Delete All User Data
            <v-icon right v-html="'mdi-alert'" />
          </v-btn>
        </div>
      </v-col>
      <v-col>
        <h3 class="heading primary--text">Theme</h3>
        <v-select v-model="theme" dense outlined :items="['GMS Red (Default)']" />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h3 class="heading primary--text">Cloud Account</h3>
    <p class="panel py-3 text-center grey--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p>

    <h3 class="heading primary--text">Achievements</h3>
    <p class="panel py-3 text-center grey--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'preferences',
  data: () => ({
    theme: 'GMS Red (Default)',
  }),
  computed: {
    userID() {
      const store = getModule(CompendiumStore, this.$store)
      console.log(store)
      return store.UserProfile.ID
    },
  },
})
</script>
