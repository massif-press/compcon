<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>BootstrapVue {{ versionNumber }}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat>Gear Catalog</v-btn>
        <v-btn flat>About</v-btn>
        <v-btn flat>Options</v-btn>
        <v-btn flat>Help</v-btn>
        <v-btn @click="goBack" flat>Back</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    computed: {
      version: function () {
        return this.versionNumber
      }
    },
    methods: {
      goBack: function () {
        this.$router.push('/')
      }
    }
  }
</script>
