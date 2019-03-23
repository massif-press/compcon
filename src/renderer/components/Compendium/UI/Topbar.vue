<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
      <v-toolbar-title class="font-weight-regular spaced">COMPENDIUM&emsp;<span class="grey--text" style="font-size:16px">LANCER v{{ lancerVersionNumber }}</span></v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat :to="'/roster'">Pilot Roster</v-btn>
        <v-btn @click="goBack" flat>Back</v-btn>
        <!-- <v-btn @click="goBack" flat>Main Menu</v-btn> -->
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      goBack: function () {
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .spaced {
    letter-spacing: 5px
  }
</style>

