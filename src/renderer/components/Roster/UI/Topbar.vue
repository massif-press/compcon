<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
      <v-toolbar-title class="font-weight-regular">C O M P / C O N&emsp;<span class="grey--text" style="font-size:16px">v{{ versionNumber }}</span></v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat disabled>About</v-btn>
        <v-btn flat disabled>Options</v-btn>
        <v-btn flat disabled>Help</v-btn>
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
      goBack: function () {
        this.$router.push('/roster')
      }
    }
  }
</script>
