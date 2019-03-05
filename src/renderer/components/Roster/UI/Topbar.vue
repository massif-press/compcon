<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
      <v-toolbar-title>COMP/CON {{ versionNumber }}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat disabled>Gear Catalog</v-btn>
        <v-btn flat disabled>About</v-btn>
        <v-btn flat disabled>Options</v-btn>
        <v-btn flat disabled>Help</v-btn>
        <v-btn @click="goBack" flat>Main Menu</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    methods: {
      goBack: function () {
        this.$router.push('/')
      }
    }
  }
</script>
